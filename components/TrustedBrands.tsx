function ExpediaMark() {
  return (
    <span className="inline-flex items-center gap-1.5 sm:gap-2">
      <svg viewBox="0 0 32 32" className="size-5 shrink-0 sm:size-7" aria-hidden="true">
        <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          fill="currentColor"
          d="M7 18.2h7.2l8.4-6.2c.5-.4 1.1.2.7.7l-4.2 5.5h5.4c.5 0 .6.7.2.9l-7.6 3.2-1.4 3.2c-.2.4-.8.3-.9-.2L14.2 22H7.1c-.6 0-.8-.8-.3-1.1L10 18.2H7Z"
        />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight sm:text-lg md:text-xl">Expedia</span>
    </span>
  );
}

function TripadvisorMark() {
  return (
    <span className="inline-flex items-center gap-1.5 sm:gap-2">
      <svg viewBox="0 0 40 32" className="h-5 w-7 shrink-0 sm:h-7 sm:w-9" aria-hidden="true">
        <circle cx="12.5" cy="17" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="27.5" cy="17" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12.5" cy="17" r="2.4" fill="currentColor" />
        <circle cx="27.5" cy="17" r="2.4" fill="currentColor" />
        <path
          fill="currentColor"
          d="M20 9.2 16.4 4.6c-.2-.3.1-.7.5-.6L20 5.4l3.1-1.4c.4-.2.7.3.5.6L20 9.2Z"
        />
      </svg>
      <span className="text-[15px] font-medium tracking-tight lowercase sm:text-lg md:text-xl">
        tripadvisor
      </span>
    </span>
  );
}

function BookingMark() {
  return (
    <span className="text-[15px] font-bold tracking-tight sm:text-lg md:text-xl">
      Booking
      <span className="font-semibold">.com</span>
    </span>
  );
}

function AirbnbMark() {
  return (
    <span className="inline-flex items-center gap-1.5 sm:gap-2">
      <svg viewBox="0 0 24 24" className="size-5 shrink-0 sm:size-7" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.1 21.8c-.4-.6-3.8-5.4-5.8-8.6C4.6 10.6 3.5 8.7 3.5 6.8 3.5 3.7 5.9 1.8 8.6 1.8c1.7 0 3.1.9 3.5 2.3.4-1.4 1.8-2.3 3.5-2.3 2.7 0 5.1 1.9 5.1 5 0 1.9-1.1 3.8-2.8 6.4-2 3.2-5.4 8-5.8 8.6Z"
        />
      </svg>
      <span className="text-[15px] font-medium tracking-tight lowercase sm:text-lg md:text-xl">
        airbnb
      </span>
    </span>
  );
}

function OrbitzMark() {
  return (
    <span className="inline-flex items-center gap-1.5 sm:gap-2">
      <svg viewBox="0 0 32 32" className="size-5 shrink-0 sm:size-7" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          d="M16 5.5a10.5 10.5 0 0 1 9.3 15.4"
        />
        <path fill="currentColor" d="M26.8 18.2 22 21.4l2.6-5.4 2.2 2.2Z" />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          d="M16 26.5A10.5 10.5 0 0 1 6.7 11.1"
        />
        <path fill="currentColor" d="M5.2 13.8 10 10.6 7.4 16 5.2 13.8Z" />
      </svg>
      <span className="text-[15px] font-extrabold tracking-wide italic sm:text-lg md:text-xl">
        ORBITZ
      </span>
    </span>
  );
}

const brands = [
  { name: "Expedia", mark: <ExpediaMark /> },
  { name: "Tripadvisor", mark: <TripadvisorMark /> },
  { name: "Booking.com", mark: <BookingMark /> },
  { name: "Airbnb", mark: <AirbnbMark /> },
  { name: "Orbitz", mark: <OrbitzMark /> },
];

export default function TrustedBrands() {
  const loop = [...brands, ...brands];

  return (
    <section aria-label="Trusted travel brands" className="py-8 md:py-10">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent sm:w-20" />
        <div className="flex w-max animate-marquee-ltr hover:[animation-play-state:paused]">
          {loop.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              aria-hidden={index >= brands.length || undefined}
              className="flex h-8 shrink-0 items-center px-8 text-[#9A9A9A] transition-colors duration-300 hover:text-[#EDEDED] sm:h-10 sm:px-12 md:px-14"
              title={index < brands.length ? brand.name : undefined}
            >
              {brand.mark}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
