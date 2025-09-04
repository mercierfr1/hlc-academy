"use client";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import Hero from "../components/Hero";
import FeatureGrid from "../components/FeatureGrid";
import Steps from "../components/Steps";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeatureGrid />
      <Steps />
      <Testimonials />
      <Pricing />
      <FAQ />
      
      {/* Final CTA Section */}
      <Section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join 2,400+ traders who've mastered institutional supply & demand with our neuroscience-led approach
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                href="/onboarding"
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Start Free Trial
              </Button>
              <Button
                href="#demo"
                variant="secondary"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
              >
                See Live Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-blue-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">30-Day Money-Back Guarantee • No Questions Asked</span>
            </div>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}
