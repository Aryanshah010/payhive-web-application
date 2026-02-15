import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const servicePlaceholders = [
  {
    name: "Wallet Transfers",
    status: "Active",
    description: "Core peer-to-peer transfer service connected to app flows.",
  },
  {
    name: "Monetization Engine",
    status: "Planned",
    description: "Revenue processing and fee aggregation from Flutter events.",
  },
  {
    name: "Refund Workflow",
    status: "Planned",
    description: "Operator review and approval queue for reversal requests.",
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-4">
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <p className="text-sm text-muted-foreground">
            Service modules overview and rollout placeholders.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {servicePlaceholders.map((service) => (
            <div
              key={service.name}
              className="rounded-lg border border-border/70 bg-card p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{service.name}</p>
                <Badge variant={service.status === "Active" ? "secondary" : "outline"}>
                  {service.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
