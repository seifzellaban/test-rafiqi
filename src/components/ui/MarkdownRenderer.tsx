import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isRTL?: boolean;
  hasArabic?: boolean;
}

function isRTLText(text: string): boolean {
  // Improved: check for first strong character direction
  for (const char of text) {
    if (/\s/.test(char)) continue;
    if (
      /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
        char
      )
    ) {
      return true;
    }
    if (/[A-Za-z0-9]/.test(char)) {
      return false;
    }
  }
  // fallback: if >30% RTL
  const rtlRegex =
    /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const rtlChars = (text.match(rtlRegex) || []).length;
  const totalChars = text.replace(/\s/g, "").length;
  return totalChars > 0 && rtlChars / totalChars > 0.3;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
  isRTL,
  hasArabic,
}) => {
  const trimmedContent = content.replace(/\n{3,}/g, "\n\n").trim(); // Remove excessive blank lines
  const rtl = typeof isRTL === "boolean" ? isRTL : isRTLText(trimmedContent);
  const arabic =
    typeof hasArabic === "boolean"
      ? hasArabic
      : /[\u0600-\u06FF]/.test(trimmedContent);

  return (
    <div
      className={className}
      dir={rtl ? "rtl" : "ltr"}
      lang={arabic ? "ar" : "en"}
      style={{
        fontFamily: arabic
          ? '"IBM Plex Sans Arabic", "Noto Sans Arabic", "Cairo", "Amiri", "Scheherazade New", system-ui, sans-serif'
          : "inherit",
        lineHeight: arabic ? "1.8" : "1.5",
        unicodeBidi: "plaintext",
        whiteSpace: "pre-line",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        margin: 0,
        padding: 0,
      }}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p style={{ margin: 0, padding: 0 }}>{children}</p>
          ),
        }}
      >
        {trimmedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
