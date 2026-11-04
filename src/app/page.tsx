import { CinematicOpening } from "@/components/home/CinematicOpening";
import { SelectedSolutions } from "@/components/home/SelectedSolutions";
import { AgencyApproach } from "@/components/home/AgencyApproach";
import { GradientInterlude } from "@/components/home/GradientInterlude";
import { TargetSectors } from "@/components/home/TargetSectors";
import { Testimonials } from "@/components/home/Testimonials";
import { ConsultationCta } from "@/components/home/ConsultationCta";

export default function HomePage() {
  return (
    <>
      <CinematicOpening />
      <SelectedSolutions />
      <AgencyApproach />
      <GradientInterlude />
      <TargetSectors />
      <Testimonials />
      <ConsultationCta />
    </>
  );
}
