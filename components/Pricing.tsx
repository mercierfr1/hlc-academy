"use client";
import { motion } from "framer-motion";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Container from "./ui/Container";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";

const plans = [
  {
    name: "Kickstart",
    description: "Perfect for beginners ready to learn the fundamentals",
    price: "£47",
    period: "/month",
    features: [
      "Complete Supply & Demand Course",
      "Bias Checklist System",
      "Trading Journal Template",
      "Weekly Group Calls",
      "Community Access",
      "Email Support"
    ],
    cta: "Start Free Trial",
    href: "https://link.fastpaydirect.com/payment-link/68b75a8c67ee3b3dca68bf37",
    popular: false
  },
  {
    name: "Scale Up",
    description: "The sweet spot for serious traders ready to accelerate",
    price: "£97",
    period: "/month",
    features: [
      "Everything in Kickstart",
      "Priority Support & Office Hours",
      "Advanced Trading Psychology Modules",
      "Private Study Groups",
      "Monthly 1-on-1 Strategy Sessions",
      "Exclusive Market Analysis Tools",
      "30-Day Money-Back Guarantee"
    ],
    cta: "Start Free Trial",
    href: "https://link.fastpaydirect.com/payment-link/68b810352197095fd3e18dd7",
    popular: true
  },
  {
    name: "Mastery",
    description: "For traders committed to achieving consistent profits",
    price: "£279",
    period: "/3 months",
    features: [
      "Everything in Scale Up",
      "Personal Trading Coach",
      "Custom Strategy Development",
      "Advanced Risk Management",
      "Priority Market Analysis",
      "Exclusive Mastermind Group",
      "Lifetime Access to Updates"
    ],
    cta: "Start Free Trial",
    href: "https://link.fastpaydirect.com/payment-link/68b8107c219709accbe18ddb",
    popular: false
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function Pricing() {
  return (
    <Section className="bg-gray-50 dark:bg-gray-800" id="pricing">
      <Container>
        <SectionHeading
          title="Choose Your Path to Trading Mastery"
          subtitle="Transform your trading psychology and master institutional supply & demand in as little as 12 weeks"
        />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <Card className={`p-8 h-full ${plan.popular ? 'ring-2 ring-blue-500/20' : ''}`}>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4">
                    <Button
                      href={plan.href}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            All plans include a 30-day money-back guarantee. No questions asked.
          </p>
        </motion.div>
      </Container>
    </Section>
  );
}
