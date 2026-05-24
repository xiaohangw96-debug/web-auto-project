export function ProgressBar({
  value,
  max = 100,
  size = "md",
  animated = true,
}: {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const height = { sm: "h-1", md: "h-2", lg: "h-3" }[size];

  return (
    <div
      className={`w-full ${height} bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden`}
    >
      <div
        className={`${height} bg-primary-500 rounded-full ${
          animated ? "transition-all duration-700 ease-out" : ""
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
