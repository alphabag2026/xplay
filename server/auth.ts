/**
 * Self-hosted Authentication Module
 * Email/Password + Google Authenticator TOTP 2FA
 */
import { Router, Request, Response } from "express";
import { hashSync, compareSync } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import * as db from "./db";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

const authRouter = Router();

function getSecretKey() {
  const secret = ENV.cookieSecret;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

async function createSessionToken(user: { openId: string; name: string | null }) {
  return new SignJWT({
    openId: user.openId,
    appId: ENV.appId || "xplay",
    name: user.name || "",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(Math.floor((Date.now() + ONE_YEAR_MS) / 1000))
    .sign(getSecretKey());
}

// ========== POST /api/auth/login ==========
// Step 1: email + password → if TOTP enabled, return { requireTotp: true }
// Step 2: email + password + totpCode → full login
authRouter.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password, totpCode } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요" });
      return;
    }

    const user = await db.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다" });
      return;
    }

    const valid = compareSync(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다" });
      return;
    }

    // Check if TOTP is enabled
    if (user.totpEnabled && user.totpSecret) {
      if (!totpCode) {
        // Return signal that TOTP is required
        res.json({ requireTotp: true, message: "Google Authenticator 코드를 입력해주세요" });
        return;
      }

      // Verify TOTP code
      const totp = new OTPAuth.TOTP({
        issuer: "XPLAY Admin",
        label: user.email || "admin",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(user.totpSecret),
      });

      const delta = totp.validate({ token: totpCode, window: 1 });
      if (delta === null) {
        res.status(401).json({ error: "인증 코드가 올바르지 않습니다" });
        return;
      }
    }

    // Create JWT session token
    const token = await createSessionToken(user);

    // Update last signed in
    await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });

    // Set cookie
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        totpEnabled: user.totpEnabled,
      },
    });
  } catch (error) {
    console.error("[Auth] Login failed:", error);
    res.status(500).json({ error: "로그인 실패" });
  }
});

// ========== POST /api/auth/register ==========
// Admin-only: disabled for public registration
authRouter.post("/api/auth/register", async (_req: Request, res: Response) => {
  res.status(403).json({ error: "회원가입이 비활성화되어 있습니다. 관리자에게 문의하세요." });
});

// ========== POST /api/auth/logout ==========
authRouter.post("/api/auth/logout", async (req: Request, res: Response) => {
  const cookieOptions = getSessionCookieOptions(req);
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
  res.json({ success: true });
});

// ========== POST /api/auth/change-password ==========
authRouter.post("/api/auth/change-password", async (req: Request, res: Response) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "모든 필드를 입력해주세요" });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: "새 비밀번호는 6자 이상이어야 합니다" });
      return;
    }

    // Try to identify user from JWT session cookie first, then fall back to email
    let user;
    try {
      const cookies = new Map(
        (req.headers.cookie || "").split(";").map((c) => {
          const [k, ...v] = c.trim().split("=");
          return [k, v.join("=")] as [string, string];
        })
      );
      const sessionCookie = cookies.get(COOKIE_NAME);
      if (sessionCookie) {
        const { payload } = await jwtVerify(sessionCookie, getSecretKey());
        const openId = payload.openId as string;
        if (openId) {
          user = await db.getUserByOpenId(openId);
        }
      }
    } catch (_) {
      // JWT verification failed, fall back to email
    }

    // Fall back to email if JWT didn't work
    if (!user && email) {
      user = await db.getUserByEmail(email);
    }

    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "인증 실패" });
      return;
    }

    const valid = compareSync(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "현재 비밀번호가 올바르지 않습니다" });
      return;
    }

    const newHash = hashSync(newPassword, 10);
    await db.updateUserPassword(user.id, newHash);

    res.json({ success: true });
  } catch (error) {
    console.error("[Auth] Change password failed:", error);
    res.status(500).json({ error: "비밀번호 변경 실패" });
  }
});

// ========== POST /api/auth/totp/setup ==========
// Generate TOTP secret + QR code for Google Authenticator
authRouter.post("/api/auth/totp/setup", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "인증이 필요합니다" });
      return;
    }

    const user = await db.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "인증 실패" });
      return;
    }

    const valid = compareSync(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "비밀번호가 올바르지 않습니다" });
      return;
    }

    // Generate new TOTP secret
    const secret = new OTPAuth.Secret({ size: 20 });
    const totp = new OTPAuth.TOTP({
      issuer: "XPLAY Admin",
      label: user.email || "admin",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret,
    });

    const otpauthUrl = totp.toString();
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    // Save secret to DB (not yet enabled)
    await db.updateUserTotp(user.id, secret.base32, false);

    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      otpauthUrl,
    });
  } catch (error) {
    console.error("[Auth] TOTP setup failed:", error);
    res.status(500).json({ error: "TOTP 설정 실패" });
  }
});

// ========== POST /api/auth/totp/verify ==========
// Verify TOTP code and enable 2FA
authRouter.post("/api/auth/totp/verify", async (req: Request, res: Response) => {
  try {
    const { email, password, totpCode } = req.body;
    if (!email || !password || !totpCode) {
      res.status(400).json({ error: "모든 필드를 입력해주세요" });
      return;
    }

    const user = await db.getUserByEmail(email);
    if (!user || !user.passwordHash || !user.totpSecret) {
      res.status(401).json({ error: "TOTP가 설정되지 않았습니다" });
      return;
    }

    const valid = compareSync(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "비밀번호가 올바르지 않습니다" });
      return;
    }

    // Verify the TOTP code
    const totp = new OTPAuth.TOTP({
      issuer: "XPLAY Admin",
      label: user.email || "admin",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.totpSecret),
    });

    const delta = totp.validate({ token: totpCode, window: 1 });
    if (delta === null) {
      res.status(401).json({ error: "인증 코드가 올바르지 않습니다. 다시 시도해주세요." });
      return;
    }

    // Enable TOTP
    await db.updateUserTotp(user.id, user.totpSecret, true);

    res.json({ success: true, message: "Google Authenticator 2FA가 활성화되었습니다" });
  } catch (error) {
    console.error("[Auth] TOTP verify failed:", error);
    res.status(500).json({ error: "TOTP 인증 실패" });
  }
});

// ========== POST /api/auth/totp/disable ==========
// Disable TOTP 2FA
authRouter.post("/api/auth/totp/disable", async (req: Request, res: Response) => {
  try {
    const { email, password, totpCode } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "인증이 필요합니다" });
      return;
    }

    const user = await db.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "인증 실패" });
      return;
    }

    const valid = compareSync(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "비밀번호가 올바르지 않습니다" });
      return;
    }

    // If TOTP is enabled, require TOTP code to disable
    if (user.totpEnabled && user.totpSecret) {
      if (!totpCode) {
        res.status(400).json({ error: "현재 TOTP 코드를 입력해주세요" });
        return;
      }
      const totp = new OTPAuth.TOTP({
        issuer: "XPLAY Admin",
        label: user.email || "admin",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(user.totpSecret),
      });
      const delta = totp.validate({ token: totpCode, window: 1 });
      if (delta === null) {
        res.status(401).json({ error: "인증 코드가 올바르지 않습니다" });
        return;
      }
    }

    await db.updateUserTotp(user.id, null, false);
    res.json({ success: true, message: "2FA가 비활성화되었습니다" });
  } catch (error) {
    console.error("[Auth] TOTP disable failed:", error);
    res.status(500).json({ error: "TOTP 비활성화 실패" });
  }
});

export { authRouter };
