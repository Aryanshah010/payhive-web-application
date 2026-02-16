"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlightsTable from "./FlightsTable";
import HotelsTable from "./HotelsTable";

type ServiceTab = "flights" | "hotels";

const getTabFromSearchParam = (value: string | null): ServiceTab => {
  return value === "hotels" ? "hotels" : "flights";
};

export default function ServicesHub() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = getTabFromSearchParam(searchParams.get("tab"));

  const createHref = useMemo(() => {
    return activeTab === "hotels"
      ? "/admin/services/hotels/create"
      : "/admin/services/flights/create";
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    const nextTab = tab === "hotels" ? "hotels" : "flights";
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Services</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage flights and hotels inventory used in booking flows.
            </p>
          </div>
          <Button asChild>
            <Link href={createHref}>
              {activeTab === "hotels" ? "Create Hotel" : "Create Flight"}
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="flights">Flights</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
            </TabsList>

            <TabsContent value="flights">
              <FlightsTable />
            </TabsContent>

            <TabsContent value="hotels">
              <HotelsTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
