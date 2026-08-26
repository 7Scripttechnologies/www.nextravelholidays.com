import type { Metadata } from "next";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPrivacyPage } from "@/data/privacy";

const page = getPrivacyPage();

export const metadata: Metadata = {
  title: `${page.title} — NexTravel Holidays`,
  description: page.description,
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-14 md:py-20">
          <Container className="max-w-3xl">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#E20E17] uppercase">
              Legal
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#EDEDED] md:text-4xl">
              {page.title}
            </h1>
            <p className="mt-3 text-sm text-muted">Last updated: {page.lastUpdated}</p>
            <p className="mt-6 text-sm leading-7 text-[#B0B0B0] md:text-[15px] md:leading-8">
              {page.intro}
            </p>

            <div className="mt-10 space-y-9">
              {page.sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-lg font-bold text-[#EDEDED]">{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="mt-2 text-sm leading-7 text-muted md:text-[15px] md:leading-8"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets ? (
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted md:text-[15px]">
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="mt-12 border-t border-white/10 pt-6 text-sm leading-7 text-[#B0B0B0]">
              {page.contactNote}
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
