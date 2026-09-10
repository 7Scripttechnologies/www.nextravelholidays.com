import AppImage from "@/components/AppImage";
import Container from "@/components/Container";
import FadeUp from "@/components/FadeUp";
import SectionLabel from "@/components/SectionLabel";
import { getSiteImages } from "@/lib/site-images";

const valuesMeta = [
  {
    key: "home_value_1",
    title: "Lot of choices",
    description: "Embrace life's vastness, venture forth,",
    alt: "Suitcase, globe and camera travel illustration",
    width: 407,
    height: 305,
    fallback: "/images/value-choices.png",
  },
  {
    key: "home_value_2",
    title: "Best Tour Guide",
    description: "Embrace life's vastness, venture forth,",
    alt: "Yellow paper airplane illustration",
    width: 336,
    height: 314,
    fallback: "/images/value-guide.png",
  },
  {
    key: "home_value_3",
    title: "Easy Booking",
    description: "Embrace life's vastness, venture forth,",
    alt: "Credit card booking illustration",
    width: 446,
    height: 344,
    fallback: "/images/value-booking.png",
  },
] as const;

export default async function ValueSection() {
  const images = await getSiteImages();

  return (
    <section id="about" className="scroll-mt-24 py-12 sm:py-16 md:py-24">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-4 lg:gap-8 xl:gap-10">
          <FadeUp className="text-center lg:text-left">
            <SectionLabel>What we serve</SectionLabel>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-tight text-[#EDEDED] sm:text-3xl md:text-4xl">
              Top Values For You
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted lg:mx-0 lg:max-w-[240px]">
              Embrace life&apos;s vastness, venture forth,
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:contents">
            {valuesMeta.map((value, index) => {
              const src = images[value.key]?.src ?? value.fallback;
              return (
                <FadeUp
                  key={value.title}
                  delay={(index + 1) * 90}
                  className="text-center sm:text-left"
                >
                  <div className="flex h-[120px] items-end justify-center sm:justify-start">
                    <AppImage
                      src={src}
                      alt={value.alt}
                      width={value.width}
                      height={value.height}
                      className="h-[100px] w-auto max-w-full object-contain"
                      unoptimized={/^https?:\/\//i.test(src)}
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[#EDEDED]">{value.title}</h3>
                  <p className="mx-auto mt-2 max-w-[260px] text-sm leading-6 text-muted sm:mx-0">
                    {value.description}
                  </p>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
