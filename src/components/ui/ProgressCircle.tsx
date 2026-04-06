'use client';

const spinStyle = `
  @keyframes smooth-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .smooth-spin {
    animation: smooth-spin 2s linear infinite;
  }
`;

export function ProgressCircle({
  progress = 65,
  size = 28,
  strokeWidth = 3,
  color = "#3b82f6",
  backgroundColor = "#e5e7eb",
  loading = false,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      <style>{spinStyle}</style>
      <svg
        width={size}
        height={size}
        className={loading ? "smooth-spin" : "transform -rotate-90"}
        style={{ display: "inline-block" }}
      >
        {/* Background circle */}
        {!loading && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />
        )}
        {/* Progress or loading circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={loading ? circumference / 4 : circumference}
          strokeDashoffset={loading ? 0 : strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: loading ? "none" : "stroke-dashoffset 0.3s ease",
          }}
        />
      </svg>
    </>
  );
}
