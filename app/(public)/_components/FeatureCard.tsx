export default function FeatureCard({
  title,
  desc,
  icon,
  highlight = false,
}: {
  title: string;
  desc: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-sm`}
      style={{
        backgroundColor: highlight ? "var(--card)" : "var(--card)",
        border: highlight ? "1px solid var(--primary)" : undefined,
      }}
    >
      <div className="text-2xl mb-3">{icon}</div>
      <h4 className="font-medium mb-2" style={{ color: "var(--foreground)" }}>
        {title}
      </h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}