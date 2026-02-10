import SendMoneyFlow from "./_components/SendMoneyFlow";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-b from-background to-muted/30 p-4 md:p-6">
      <div className="w-full max-w-lg mx-auto space-y-6">
        <SendMoneyFlow />
      </div>
    </div>
  );
}
