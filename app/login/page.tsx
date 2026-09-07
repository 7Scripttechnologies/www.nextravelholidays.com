import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to NexTravel Holidays.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-[28px] border border-line bg-card p-8 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          <Logo />
          <h1 className="mt-6 text-2xl font-extrabold text-[#EDEDED]">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Log in to continue planning your next trip.</p>
          <form className="mt-8 space-y-4" action="/destinations">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-[#EDEDED]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-2xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none focus:border-brand"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-[#EDEDED]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-2xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none focus:border-brand"
              />
            </div>
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            New to Travelog?{" "}
            <Link href="/signup" className="font-semibold text-brand">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
