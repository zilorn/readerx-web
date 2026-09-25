import Navbar from "~/components/Navbar";
import Hero from "~/components/Hero";
import Features from "~/components/Features";
import Showcase from "~/components/Showcase";
import BookSources from "~/components/BookSources";
import Download from "~/components/Download";
import Faq from "~/components/Faq";
import Footer from "~/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="content">
        <Hero />
        <Features />
        <Showcase />
        <BookSources />
        <Download />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
