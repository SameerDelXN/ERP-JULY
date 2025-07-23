import Benefits from "@/components/Landing/Benefits";
import ContactSection from "@/components/Landing/Contact";
import CTA from "@/components/Landing/CTA";
import Features from "@/components/Landing/Features";
import Footer from "@/components/Landing/Footer";
import HeroSection from "@/components/Landing/HeroSection";
import Modules from "@/components/Landing/Modules";
import Navbar from "@/components/Landing/Navbar";
import Testimonials from "@/components/Landing/Testimonials";
import Image from "next/image";

export default function Home() {
  return (
   <>
    <Navbar/>
    <HeroSection/>
    <Benefits/>
    <Modules/>
    <Features/>
    <Testimonials/>
    <CTA/>
    <ContactSection/>
    <Footer/>
   </>
  );
}
