import { ImageResponse } from "next/og";

export const runtime = "edge";

// Text processing utilities
function decodeText(encodedStr) {
  return encodedStr;
}

function stripHtml(html) {
  return html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Process text inputs
  const title = decodeText(searchParams.get("title") || "New Post");
  const description = stripHtml(
    decodeText(searchParams.get("description") || "")
  );
  const image = searchParams.get("image");

  // Color palette (adjust to match your brand)
  const colors = {
    background: "#111827", // Dark slate
    textPrimary: "#f9fafb", // White
    textSecondary: "#e5e7eb", // Light gray
    accent: "#3b82f6", // Blue-500
    overlay: "rgba(17, 24, 39, 0.85)",
  };

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: colors.background,
          fontFamily: '"Inter", sans-serif',
          position: "relative",
        }}
      >
        {/* Background image with overlay */}
        {image && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(8px)",
              opacity: 0.3,
            }}
          />
        )}

        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "4rem",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.overlay,
          }}
        >
          {/* Title with gradient text */}
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "2rem",
              backgroundImage: "linear-gradient(90deg, #3b82f6, #10b981)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p
              style={{
                fontSize: "32px",
                color: colors.textSecondary,
                textAlign: "center",
                maxWidth: "800px",
                lineHeight: 1.4,
                marginBottom: "3rem",
              }}
            >
              {description.length > 150
                ? `${description.substring(0, 150)}...`
                : description}
            </p>
          )}

          {/* Branding footer */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: "4rem",
              right: "4rem",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  color: colors.textPrimary,
                  fontWeight: "bold",
                }}
              >
                journeyskill.online
              </span>
              <span
                style={{
                  fontSize: "16px",
                  color: colors.textSecondary,
                }}
              >
                Share your learning journey
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "max-age=0, s-maxage=86400",
      },
    }
  );
}
