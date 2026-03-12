import { IMAGES } from "@/lib/data";

export default function Footer() {
  return (
    <footer
      className="py-12 px-4 text-center"
      style={{
        background: "rgba(10,14,26,0.95)",
        borderTop: "1px solid rgba(0,245,255,0.08)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <img
          src={IMAGES.logo}
          alt="XPLAY"
          className="w-10 h-10 mx-auto mb-4 object-contain"
          style={{ filter: "drop-shadow(0 0 15px rgba(0,245,255,0.3))" }}
        />
        <p
          className="text-sm font-bold mb-2"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          XPLAY — AI 자동 수익 × GameFi 듀얼 엔진
        </p>
        <p className="text-xs mb-4" style={{ color: "rgba(226,232,240,0.4)" }}>
          공식 사이트:{" "}
          <a
            href="https://www.xplay.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#00f5ff" }}
          >
            WWW.XPLAY.IO
          </a>
        </p>
        <div className="h-px w-20 mx-auto mb-4" style={{ background: "rgba(0,245,255,0.15)" }} />
        <p className="text-[10px]" style={{ color: "rgba(226,232,240,0.25)" }}>
          본 웹사이트는 XPLAY 프로젝트의 수익 구조를 분석한 정보성 콘텐츠입니다.
          <br />
          모든 투자에는 리스크가 따르며, 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
        </p>
      </div>
    </footer>
  );
}
