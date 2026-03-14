import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DribbbleReplicaHero from '@/components/DribbbleReplicaHero';
import Marquee from '@/components/Marquee';
import CodeTerminal from '@/components/CodeTerminal';

import AboutSection from '@/components/AboutSection';
import AboutDamnGood from '@/components/AboutDamnGood';
import ContactSection from '@/components/ContactSection';
import SocialLinks from '@/components/SocialLinks';
import ProjectsSection from '@/components/ProjectsSection';

import ScrollReveal from '@/components/ui/ScrollReveal';
import FluidCursor from '@/components/ui/FluidCursor';
import GlobalFrame from '@/components/ui/GlobalFrame';
import TestimonialsSection from '@/components/TestimonialsSection';

export default function HomePage() {
  return (
    <>
      <FluidCursor />
      <div className="relative min-h-screen bg-deep-black text-foreground selection:bg-white/20 selection:text-white">

        <div className="relative z-10">
          <Header />

          <main className="flex flex-col gap-0">
            {/* Hero does NOT get ScrollReveal — it has its own scroll-driven animation */}
            <DribbbleReplicaHero />

            <ScrollReveal direction="up" distance={80} duration={1.2}>
              <AboutSection />
            </ScrollReveal>

            <ScrollReveal direction="up" distance={80} duration={1}>
              <TestimonialsSection />
            </ScrollReveal>



            <ScrollReveal direction="up" distance={60} duration={1}>
              <AboutDamnGood />
            </ScrollReveal>

            <Marquee />

            <ScrollReveal direction="up" distance={60} duration={1}>
              <CodeTerminal />
            </ScrollReveal>

            <ScrollReveal direction="up" distance={60} duration={1}>
              <ProjectsSection />
            </ScrollReveal>

            <ScrollReveal direction="up" distance={60} duration={1.2}>
              <SocialLinks />
            </ScrollReveal>

            <ScrollReveal direction="up" distance={80} duration={1.2}>
              <ContactSection />
            </ScrollReveal>
          </main>

          <ScrollReveal direction="up" distance={40} duration={0.8}>
            <Footer />
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}