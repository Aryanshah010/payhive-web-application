import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen">
      <div className="grid min-h-screen md:grid-cols-2">
        <div className="hidden md:flex flex-col">
          <header className="py-4 px-2 md:py-6 lg:py-10 text-center shrink-0 ">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
              Welcome to <span className="text-primary">PayHive</span>
            </h2>

            <p className="mt-2 sm:mt-3 text-sm  sm:text-base leading-relaxed  text-muted-foreground">
              Your smart and secure digital wallet for everyday payments.
            </p>
          </header>

          <div className="relative flex-1  overflow-hidden">
            <Image
              src="/auth-illustration.png"
              alt="Welcome illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex h-full items-center justify-center px-4 md:px-10">
          <div className="w-full max-w-md rounded-xl border border-black/10 dark:border-white/10 bg-background/80 supports-backdrop-filter:backdrop-blur p-6 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
