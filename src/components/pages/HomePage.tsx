import React, { Suspense } from 'react';
import Header from '@/components/Header';
import DribbbleReplicaHero from '@/components/DribbbleReplicaHero';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FluidCursor from '@/components/ui/FluidCursor';

// Lazy load below-the-fold components to improve initial load performance
const AboutSection = React.lazy(() => import('@/components/AboutSection'));
const TestimonialsSection = React.lazy(() => import('@/components/TestimonialsSection'));
const Marquee = React.lazy(() => import('@/components/Marquee'));
const CodeTerminal = React.lazy(() => import('@/components/CodeTerminal'));
const ProjectsSection = React.lazy(() => import('@/components/ProjectsSection'));
const SocialLinks = React.lazy(() => import('@/components/SocialLinks'));
const ContactSection = React.lazy(() => import('@/components/ContactSection'));
const Footer = React.lazy(() => import('@/components/Footer'));

export default function HomePage() {
  return (
    <>
      <FluidCursor />
      <div className="relative min-h-screen bg-deep-black text-foreground selection:bg-white/20 selection:text-white">
        <div className="relative z-10">
          <Header />

          <main className="flex flex-col gap-0">
            {/* Hero loads immediately for fast LCP */}
            <DribbbleReplicaHero />

            {/* Defer loading rest of the page until React is idle */}
            <Suspense fallback={<div className="h-screen w-full bg-deep-black" />}>
              <ScrollReveal direction="up" distance={80} duration={1.2}>
                <AboutSection />
              </ScrollReveal>

              <ScrollReveal direction="up" distance={80} duration={1}>
                <TestimonialsSection />
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
            </Suspense>
          </main>

          <Suspense fallback={<div className="h-32" />}>
            <ScrollReveal direction="up" distance={40} duration={0.8}>
                <Footer />
            </ScrollReveal>
          </Suspense>
        </div>
      </div>
    </>
  );
}