import UserShell from "./_components/UserShell";

export const dynamic = "force-dynamic";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserShell>{children}</UserShell>;
}
