import Container from "@/components/Container";
import Footer from "@/components/Footer";
import LegalAccordion from "@/components/LegalAccordion";
import Navbar from "@/components/Navbar";
import type { LegalPage } from "@/data/terms";

interface LegalDocumentProps {
  page: LegalPage;
}

export default function LegalDocument({ page }: LegalDocumentProps) {
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

            <div className="mt-10 md:mt-12">
              <LegalAccordion sections={page.sections} />
            </div>

            {page.acknowledgment ? (
              <p className="mt-10 text-sm leading-7 text-[#8A8A8A] italic md:text-[15px] md:leading-8">
                {page.acknowledgment}
              </p>
            ) : null}

            <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-7 text-[#B0B0B0]">
              {page.contactNote}
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
