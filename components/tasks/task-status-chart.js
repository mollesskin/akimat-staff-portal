"use client";

const colors = {
  "Новая": "#2563EB",
  "В работе": "#F59E0B",
  "Выполнена": "#10B981"
};

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y, "L", cx, cy, "Z"].join(" ");
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(angleInRadians), y: cy + r * Math.sin(angleInRadians) };
}

export function TaskStatusChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let currentAngle = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          {total === 0 ? (
            <circle cx="100" cy="100" r="78" fill="#E5E7EB" />
          ) : (
            data.map((item) => {
              const angle = (item.count / total) * 360;
              if (angle >= 359.99) {
                return <circle key={item.status} cx="100" cy="100" r="82" fill={colors[item.status] || "#94A3B8"} />;
              }
              const path = describeArc(100, 100, 82, currentAngle, currentAngle + angle);
              currentAngle += angle;
              return <path key={item.status} d={path} fill={colors[item.status] || "#94A3B8"} />;
            })
          )}
          <circle cx="100" cy="100" r="50" className="fill-card" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-semibold">{total}</div>
          <div className="text-xs text-muted-foreground">задач</div>
        </div>
      </div>
      <div className="grid flex-1 gap-3">
        {["Новая", "В работе", "Выполнена"].map((status) => {
          const count = data.find((item) => item.status === status)?.count || 0;
          return (
            <div key={status} className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[status] }} />
                <span className="text-sm font-medium">{status}</span>
              </div>
              <span className="text-sm text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
