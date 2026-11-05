import { Hero } from "@/components/home/Hero";
import { PainPoints } from "@/components/home/PainPoints";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { Pricing } from "@/components/home/Pricing";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PainPoints />
      <Services />
      <Process />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
