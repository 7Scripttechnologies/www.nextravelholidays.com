import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { comingSoonPages, getComingSoonPage } from "@/data/comingSoon";

interface ComingSoonPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return comingSoonPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: ComingSoonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getComingSoonPage(slug);

  if (!page) {
    return { title: "Coming Soon — NexTravel" };
  }

  return {
    title: `${page.title} — Coming Soon | NexTravel`,
    description: `${page.title} is coming soon on NexTravel.`,
  };
}

export default async function ComingSoonPage({ params }: ComingSoonPageProps) {
  const { slug } = await params;
  const page = getComingSoonPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center">
        <Container className="py-20 text-center md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E20E17]">
            Coming soon
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#EDEDED] md:text-5xl">
            {page.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted md:text-base">
            This page is on the way. We&apos;re putting the finishing touches on {page.title.toLowerCase()}{" "}
            so it matches the rest of NexTravel.
          </p>
          <Button href="/" className="mt-8">
            Back to home
          </Button>
        </Container>
      </main>
      <Footer />
    </>
  );
}
