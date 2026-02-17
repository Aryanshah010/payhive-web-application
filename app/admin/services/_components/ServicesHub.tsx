"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlightsTable from "./FlightsTable";
import HotelsTable from "./HotelsTable";
import InternetServicesTable from "./InternetServicesTable";
import TopupServicesTable from "./TopupServicesTable";

type ServiceTab = "flights" | "hotels" | "internet" | "topup";

const getTabFromSearchParam = (value: string | null): ServiceTab => {
  if (value === "hotels") return "hotels";
  if (value === "internet") return "internet";
  if (value === "topup") return "topup";
  return "flights";
};

export default function ServicesHub() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = getTabFromSearchParam(searchParams.get("tab"));

  const createHref = useMemo(() => {
    switch (activeTab) {
      case "hotels":
        return "/admin/services/hotels/create";
      case "internet":
        return "/admin/services/internet/create";
      case "topup":
        return "/admin/services/topup/create";
      default:
        return "/admin/services/flights/create";
    }
  }, [activeTab]);

  const createButtonLabel = useMemo(() => {
    switch (activeTab) {
      case "hotels":
        return "Create Hotel";
      case "internet":
        return "Create Internet Service";
      case "topup":
        return "Create Mobile Data/Topup";
      default:
        return "Create Flight";
    }
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    const nextTab = getTabFromSearchParam(tab);
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
              Manage flights, hotels, internet, and mobile data/topup services.
            </p>
          </div>
          <Button asChild>
            <Link href={createHref}>{createButtonLabel}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="flights">Flights</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="internet">Internet</TabsTrigger>
              <TabsTrigger value="topup">Mobile Data/Topup</TabsTrigger>
            </TabsList>

            <TabsContent value="flights">
              <FlightsTable />
            </TabsContent>

            <TabsContent value="hotels">
              <HotelsTable />
            </TabsContent>

            <TabsContent value="internet">
              <InternetServicesTable />
            </TabsContent>

            <TabsContent value="topup">
              <TopupServicesTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
