import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/dash");
  }
  return (
    <main className="flex h-[calc(100vh-3.5rem-1px)] w-screen items-center justify-center">
      {children}
    </main>
  );
}
