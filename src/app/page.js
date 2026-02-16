// landing page update by sarthak
import Benefits from "@/components/Landing/Benefits";
import ContactSection from "@/components/Landing/Contact";
import CTA from "@/components/Landing/CTA";
import Features from "@/components/Landing/Features";
import Footer from "@/components/Landing/Footer";
import HeroSection from "@/components/Landing/HeroSection";
import Modules from "@/components/Landing/Modules";
import Navbar from "@/components/Landing/Navbar";
import CircularPillars from "@/components/Landing/CircularPillars"
import Testimonials from "@/components/Landing/Testimonials";
import BlogsSection from "@/components/Landing/BlogsSection";
import Image from "next/image";


export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CircularPillars />
      <Benefits />
      <Modules />
      <Features />
      <Testimonials />
      <BlogsSection />
      {/* <CTA/> */}
      <ContactSection />
      <Footer />
    </>
  );
}
