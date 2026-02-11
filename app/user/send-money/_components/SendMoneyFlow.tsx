"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  AmountInput,
  amountSchema,
  BeneficiaryLookupInput,
  beneficiaryLookupSchema,
  PinInput,
  pinSchema,
} from "../schema";
import {
  handleConfirmTransfer,
  handleLookupBeneficiary,
  handlePreviewTransfer,
} from "@/lib/actions/transaction-action";
import { LoadingButton } from "@/app/_components/LoadingButton";
import { toast } from "react-toastify";
const steps = ["Recipient", "Amount", "PIN"] as const;

type Step = "recipient" | "amount" | "pin" | "success";

type UserRef = {
  id: string;
  fullName?: string;
  phoneNumber?: string;
};

type PreviewData = {
  from: UserRef;
  to: UserRef;
  amount: number;
  remark?: string;
  warning?: { largeAmount?: boolean; avg30d?: number };
};

type Receipt = {
  txId: string;
  status: string;
  amount: number;
  remark?: string;
  from: UserRef;
  to: UserRef;
  createdAt: string;
};

const generateIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatAmount = (value?: number) => {
  if (typeof value !== "number") return "—";
  return Number.isInteger(value) ? `${value}` : value.toFixed(2);
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function SendMoneyFlow() {
  const [step, setStep] = useState<Step>("recipient");
  const [recipient, setRecipient] = useState<UserRef | null>(null);
  const [draft, setDraft] = useState<{
    toPhoneNumber: string;
    amount?: number;
    remark?: string;
  }>({ toPhoneNumber: "" });
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const recipientForm = useForm<BeneficiaryLookupInput>({
    resolver: zodResolver(beneficiaryLookupSchema),
    defaultValues: {
      phoneNumber: draft.toPhoneNumber,
    },
  });

  const amountForm = useForm<AmountInput>({
    resolver: zodResolver(amountSchema),
    defaultValues: {
      amount: draft.amount,
      remark: draft.remark,
    },
  });

  const remarkValue = useWatch({
    control: amountForm.control,
    name: "remark",
  });

  const pinForm = useForm<PinInput>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    recipientForm.reset({ phoneNumber: draft.toPhoneNumber });
  }, [draft.toPhoneNumber, recipientForm]);

  useEffect(() => {
    if (step === "amount") {
      amountForm.reset({
        amount: draft.amount,
        remark: draft.remark,
      });
    }
  }, [step, draft.amount, draft.remark, amountForm]);

  const warningMessage = useMemo(() => {
    if (!preview?.warning?.largeAmount) return null;
    const avg = preview.warning.avg30d ?? 0;
    return `This amount is more than 2× your 30-day average (avg: ${formatAmount(
      avg,
    )}).`;
  }, [preview]);

  const resetFlow = () => {
    setStep("recipient");
    setRecipient(null);
    setDraft({ toPhoneNumber: "" });
    setPreview(null);
    setReceipt(null);
    setIdempotencyKey("");
    setError(null);
    recipientForm.reset({ phoneNumber: "" });
    amountForm.reset({ amount: undefined, remark: "" });
    pinForm.reset({ pin: "" });
  };

  const onLookupRecipient = async (values: BeneficiaryLookupInput) => {
    setError(null);
    startTransition(async () => {
      const result = await handleLookupBeneficiary(values.phoneNumber);
      if (!result.success) {
        setError(result.message || "Recipient lookup failed");
        return;
      }

      setRecipient(result.data);
      setDraft({ toPhoneNumber: values.phoneNumber });
      setIdempotencyKey(generateIdempotencyKey());
      setStep("amount");
    });
  };

  const onPreview = async (values: AmountInput) => {
    if (!recipient) return;
    setError(null);

    startTransition(async () => {
      if (typeof values.amount !== "number") {
        setError("Amount is required");
        return;
      }
      const trimmedRemark = values.remark?.trim();
      const payload = {
        toPhoneNumber: recipient.phoneNumber || draft.toPhoneNumber,
        amount: values.amount,
        ...(trimmedRemark ? { remark: trimmedRemark } : {}),
      };

      const result = await handlePreviewTransfer(payload);
      if (!result.success) {
        setError(result.message || "Preview failed");
        return;
      }

      setDraft({
        toPhoneNumber: payload.toPhoneNumber,
        amount: values.amount,
        remark: trimmedRemark,
      });
      setPreview(result.data);
      setStep("pin");
    });
  };

  const onConfirm = async (values: PinInput) => {
    if (!recipient || !draft.amount) return;
    setError(null);

    startTransition(async () => {
      const payload = {
        toPhoneNumber: recipient.phoneNumber || draft.toPhoneNumber,
        amount: draft.amount as number,
        remark: draft.remark,
        pin: values.pin,
      };

      const result = await handleConfirmTransfer(payload, idempotencyKey);
      if (!result.success) {
        if (result.status === 423 && result.details?.remainingMs) {
          const minutes = Math.ceil(result.details.remainingMs / 60000);
          setError(`PIN locked. Try again in ${minutes} minute(s).`);
        } else {
          setError(result.message || "Transfer failed");
        }
        return;
      }

      toast.success("Transfer successful");
      setReceipt(result.data.receipt);
      setPreview({
        from: result.data.receipt.from,
        to: result.data.receipt.to,
        amount: result.data.receipt.amount,
        remark: result.data.receipt.remark,
        warning: result.data.warning,
      });
      pinForm.reset({ pin: "" });
      setStep("success");
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Send Money</CardTitle>
          <Badge variant="secondary">Secure Transfer</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {steps.map((label, index) => {
            const isActive =
              (step === "recipient" && index === 0) ||
              (step === "amount" && index === 1) ||
              (step === "pin" && index === 2) ||
              (step === "success" && index === 2);

            return (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`h-6 w-6 rounded-full border flex items-center justify-center text-xs font-semibold ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <span className={isActive ? "text-foreground" : ""}>
                  {label}
                </span>
                {index < steps.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {step === "recipient" && (
          <form
            onSubmit={recipientForm.handleSubmit(onLookupRecipient)}
            className="space-y-4"
          >
            <FieldGroup>
              <Field className="space-y-0">
                <FieldLabel>Recipient phone number</FieldLabel>
                <Input
                  {...recipientForm.register("phoneNumber")}
                  placeholder="eg: 9876543210"
                  inputMode="numeric"
                  type="tel"
                  disabled={pending}
                />
                {recipientForm.formState.touchedFields.phoneNumber &&
                  recipientForm.formState.errors.phoneNumber && (
                    <p className="text-sm text-destructive">
                      {recipientForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
              </Field>
            </FieldGroup>

            <LoadingButton
              type="submit"
              loading={pending}
              loadingText="Checking..."
              className="mt-4"
            >
              Continue
            </LoadingButton>
          </form>
        )}

        {step === "amount" && recipient && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-muted/30 px-4 py-3">
              <div className="text-sm text-muted-foreground">Sending to</div>
              <div className="text-base font-semibold">
                {recipient.fullName || "PayHive User"}
              </div>
              <div className="text-sm text-muted-foreground">
                {recipient.phoneNumber}
              </div>
            </div>

            <form
              onSubmit={amountForm.handleSubmit(onPreview)}
              className="space-y-4"
            >
              <FieldGroup>
                <Field className="space-y-0">
                  <FieldLabel>Amount</FieldLabel>
                  <Input
                    {...amountForm.register("amount", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    type="number"
                    min="0"
                    disabled={pending}
                  />
                  {amountForm.formState.touchedFields.amount &&
                    amountForm.formState.errors.amount && (
                      <p className="text-sm text-destructive">
                        {amountForm.formState.errors.amount.message}
                      </p>
                    )}
                </Field>

                <Field className="space-y-0">
                  <FieldLabel>Remark (optional)</FieldLabel>
                  <textarea
                    {...amountForm.register("remark")}
                    rows={3}
                    maxLength={140}
                    placeholder="Add a note for the recipient"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={pending}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {amountForm.formState.errors.remark?.message || ""}
                    </span>
                    <span>{(remarkValue || "").length}/140</span>
                  </div>
                </Field>
              </FieldGroup>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setError(null);
                    setPreview(null);
                    setStep("recipient");
                  }}
                >
                  Back
                </Button>
                <LoadingButton
                  type="submit"
                  loading={pending}
                  loadingText="Reviewing..."
                  className="w-auto"
                >
                  Continue
                </LoadingButton>
              </div>
            </form>
          </div>
        )}

        {step === "pin" && preview && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-muted/30 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Recipient</div>
                  <div className="font-semibold">{preview.to.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {preview.to.phoneNumber}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="text-lg font-semibold">
                    {formatAmount(preview.amount)}
                  </div>
                </div>
              </div>
              {preview.remark && (
                <div className="text-sm text-muted-foreground">
                  Remark: {preview.remark}
                </div>
              )}
              {warningMessage && (
                <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700">
                  {warningMessage}
                </div>
              )}
            </div>

            <form
              onSubmit={pinForm.handleSubmit(onConfirm)}
              className="space-y-4"
            >
              <FieldGroup>
                <Field className="space-y-0">
                  <FieldLabel>Enter PIN</FieldLabel>
                  <Input
                    {...pinForm.register("pin")}
                    placeholder="••••"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    disabled={pending}
                  />
                  {pinForm.formState.touchedFields.pin &&
                    pinForm.formState.errors.pin && (
                      <p className="text-sm text-destructive">
                        {pinForm.formState.errors.pin.message}
                      </p>
                    )}
                </Field>
              </FieldGroup>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setError(null);
                    setPreview(null);
                    pinForm.reset({ pin: "" });
                    setStep("amount");
                  }}
                >
                  Back
                </Button>
                <LoadingButton
                  type="submit"
                  loading={pending}
                  loadingText="Sending..."
                  className="w-auto"
                >
                  Send Money
                </LoadingButton>
              </div>
            </form>
          </div>
        )}

        {step === "success" && receipt && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-emerald-500/10 px-4 py-3 text-emerald-700">
              Transfer complete
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Receipt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tx ID</span>
                    <span className="font-medium">{receipt.txId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium">{receipt.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">
                      {formatAmount(receipt.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {formatDate(receipt.createdAt)}
                    </span>
                  </div>
                  {receipt.remark && (
                    <div className="pt-2 text-muted-foreground">
                      Remark: {receipt.remark}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recipient</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{receipt.to.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">
                      {receipt.to.phoneNumber}
                    </span>
                  </div>
                </CardContent>
                  
                <CardHeader>
                  <CardTitle className="text-base">Sender</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{receipt.from.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">
                      {receipt.from.phoneNumber}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {preview?.warning?.largeAmount && (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700">
                {warningMessage}
              </div>
            )}

            <Separator />

            <div className="flex justify-end gap-4">
              <Button onClick={resetFlow}>Send another</Button>
              <Button variant="outline" onClick={() => window.print()}>
                🖨️ Print Receipt
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
