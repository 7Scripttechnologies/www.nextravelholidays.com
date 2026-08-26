import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Sign Up — Travelog",
  description: "Create a Travelog account to save destinations and book curated tours.",
};

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-[28px] border border-line bg-card p-8 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          <Logo />
          <h1 className="mt-6 text-2xl font-extrabold text-[#EDEDED]">Create your account</h1>
          <p className="mt-2 text-sm text-muted">
            Join travelers discovering the world with Travelog.
          </p>
          <form className="mt-8 space-y-4" action="/destinations">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-[#EDEDED]">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="mt-1.5 w-full rounded-2xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none focus:border-brand"
              />
            </div>
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
                minLength={8}
                autoComplete="new-password"
                className="mt-1.5 w-full rounded-2xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none focus:border-brand"
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
