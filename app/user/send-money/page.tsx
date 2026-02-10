import SendMoneyFlow from "./_components/SendMoneyFlow";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-b from-background to-muted/30 p-6">
      <div className="w-full max-w-4xl mx-auto">
        <SendMoneyFlow />
      </div>
    </div>
  );
}
