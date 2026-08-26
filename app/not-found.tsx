import Button from "@/components/Button";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center">
        <Container className="py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink">
            404
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-[#EDEDED]">Page not found</h1>
          <p className="mx-auto mt-3 max-w-md text-muted">
            The page you are looking for does not exist or has been moved.
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
