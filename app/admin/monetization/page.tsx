import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function MonetizationPage() {
  return (
    <div className="space-y-4">
      <Card className="border-border/70">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Monetization</CardTitle>
            <Badge variant="secondary">Planned</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            This section is prepared for Flutter app monetization analytics.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              Revenue metrics are currently mock values in the dashboard. Connect
              backend analytics endpoints here once mobile monetization is live.
            </p>
          </div>
          <Separator />
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Suggested next steps:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Create endpoint for monthly revenue and transaction summaries.</li>
              <li>Track fee/subscription events from Flutter app securely.</li>
              <li>Add filters by date range, platform, and monetization type.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
