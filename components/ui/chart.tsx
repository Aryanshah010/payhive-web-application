"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

type ChartContextType = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextType | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("Chart components must be used inside <ChartContainer />");
  }
  return context;
}

type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
};

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, children, config, ...props }, ref) => {
    const chartId = React.useId();
    const style = React.useMemo<React.CSSProperties>(() => {
      const entries = Object.entries(config).reduce(
        (acc, [key, item]) => {
          if (item.color) {
            acc[`--color-${key}` as `--${string}`] = item.color;
          }
          return acc;
        },
        {} as Record<`--${string}`, string>,
      );

      return entries;
    }, [config]);

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          data-slot="chart"
          data-chart={id ?? chartId}
          ref={ref}
          style={style}
          className={cn(
            "h-55 w-full text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-grid_line]:stroke-border/50 [&_.recharts-tooltip-cursor]:stroke-border [&_.recharts-reference-line_line]:stroke-border",
            className,
          )}
          {...props}
        >
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  },
);
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipContentProps = React.ComponentProps<"div"> &
  {
    active?: boolean;
    payload?: Array<{
      dataKey?: string | number;
      name?: string | number;
      value?: ValueType;
      color?: string;
    }>;
    label?: string | number;
    formatter?: (
      value: ValueType,
      name: NameType,
      item: {
        dataKey?: string | number;
        name?: string | number;
        value?: ValueType;
        color?: string;
      },
      index: number,
      payload: Array<{
        dataKey?: string | number;
        name?: string | number;
        value?: ValueType;
        color?: string;
      }>,
    ) => React.ReactNode;
    hideLabel?: boolean;
    hideIndicator?: boolean;
  };

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  hideLabel = false,
  hideIndicator = false,
  formatter,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-background px-3 py-2 shadow-lg",
        className,
      )}
    >
      {!hideLabel && label ? (
        <p className="mb-2 text-xs font-medium text-foreground">
          {String(label)}
        </p>
      ) : null}

      <div className="space-y-1.5">
        {payload.map((item, index) => {
          const key = String(item.dataKey ?? item.name ?? "");
          const itemConfig = config[key];
          const itemLabel = itemConfig?.label ?? String(item.name ?? key);
          const value = typeof item.value === "number" ? item.value : Number(item.value);
          const formattedInput = (item.value ?? 0) as ValueType;
          const formattedName = (item.name ?? key) as NameType;
          const displayValue = formatter
            ? formatter(formattedInput, formattedName, item, index, payload)
            : Number.isFinite(value)
              ? value.toLocaleString("en-NP")
              : item.value;
          const color = item.color ?? itemConfig?.color ?? "var(--muted-foreground)";

          return (
            <div
              key={`${key}-${index}`}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                {!hideIndicator ? (
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                ) : null}
                <span>{itemLabel}</span>
              </div>
              <span className="font-medium text-foreground">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
