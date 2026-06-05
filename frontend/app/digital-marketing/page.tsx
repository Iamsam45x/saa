'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Search,
  Share2,
  MousePointerClick,
  FileText,
  CheckCircle2,
  ChevronRight,
  Star,
  Target,
  TrendingUp,
  BarChart3,
  Users,
  MessageCircle,
  PhoneCall,
  ArrowRight,
  Building2,
  Rocket,
  Layers,
  Settings2,
  LineChart,
  Eye,
  Heart,
  ShoppingCart,
  UserPlus,
  Sparkles,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

function SectionWrapper({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function FadeInCard({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } },
      }}
    >
      {children}
    </motion.div>
  );
}

const services = [
  {
    id: 'seo',
    title: 'Search Engine Optimization',
    icon: Search,
    gradient: 'from-blue-600 to-cyan-500',
    lightBg: 'bg-blue-50 dark:bg-blue-950/30',
    description:
      'Boost your organic search rankings and drive qualified traffic to your website with our comprehensive SEO strategies.',
    features: [
      'Website Audit & On-Page Optimization',
      'Keyword Research & Implementation',
      'Link Building & Off-Page SEO',
      'Local SEO & Google Business Profile Optimization',
      'Monthly Performance Reports',
    ],
    price: '₹12,000/month + GST',
  },
  {
    id: 'smm',
    title: 'Social Media Marketing',
    icon: Share2,
    gradient: 'from-purple-600 to-pink-500',
    lightBg: 'bg-purple-50 dark:bg-purple-950/30',
    description:
      'Build a strong social media presence that engages your audience and drives meaningful brand interactions.',
    features: [
      'Strategy Development & Content Calendar Planning',
      'Graphic Design Creation',
      'Reels and Video Content Creation',
      'Social Media Post Design and Publishing',
      'Platform Management: Facebook, Instagram, X, LinkedIn',
      'Community Engagement & Hashtag Research',
      'Paid Ad Campaign Setup & Optimization',
    ],
    price: '₹15,000/month + GST',
  },
  {
    id: 'ppc',
    title: 'Pay-Per-Click Advertising',
    icon: MousePointerClick,
    gradient: 'from-emerald-600 to-teal-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    description:
      'Maximize your ROI with targeted paid advertising campaigns across Google and Meta platforms.',
    features: [
      'Google Ads: Search, Display, Video Ads',
      'Meta Advertising: Facebook & Instagram Ads',
      'Retargeting & Remarketing Campaigns',
      'Conversion Tracking Setup',
      'Ad Optimization',
      'Monthly Campaign Reports',
    ],
    price: '₹10,000/month + GST',
  },
  {
    id: 'content',
    title: 'Content Marketing',
    icon: FileText,
    gradient: 'from-orange-600 to-amber-500',
    lightBg: 'bg-orange-50 dark:bg-orange-950/30',
    description:
      'Create compelling content that tells your brand story and converts visitors into loyal customers.',
    features: [
      'SEO-Friendly Blog Writing',
      'Website Content Creation',
      'Landing Page Content',
      'Product and Service Content',
      'Marketing Copywriting',
      'Content Strategy Development',
    ],
    price: '₹8,000/month + GST',
  },
];

const pricingData = [
  { service: 'SEO', description: 'As detailed above', price: '₹12,000/month' },
  { service: 'Content Marketing', description: 'As detailed above', price: '₹8,000/month' },
  { service: 'PPC Ads Management', description: 'As detailed above', price: '₹10,000/month' },
  { service: 'Social Media Marketing', description: 'As detailed above', price: '₹15,000/month' },
];

const approachSteps = [
  {
    step: 1,
    title: 'Discovery',
    icon: Target,
    description: 'Understand your business, audience, industry, and goals.',
  },
  {
    step: 2,
    title: 'Strategy',
    icon: Layers,
    description: 'Craft a tailored digital marketing plan aligned with business objectives.',
  },
  {
    step: 3,
    title: 'Execution',
    icon: Rocket,
    description: 'Implement campaigns with consistency, creativity, and performance focus.',
  },
  {
    step: 4,
    title: 'Optimization',
    icon: Settings2,
    description: 'Analyze campaign data and continuously improve performance.',
  },
  {
    step: 5,
    title: 'Reporting',
    icon: LineChart,
    description: 'Provide transparent, data-driven monthly insights and recommendations.',
  },
];

const nextSteps = [
  { step: 1, title: 'Review & Approve', description: 'Review and approve the proposal.' },
  { step: 2, title: 'Sign Agreement', description: 'Sign the service agreement.' },
  {
    step: 3,
    title: 'Kick-off Meeting',
    description: 'Attend the kick-off meeting and onboarding session.',
  },
  {
    step: 4,
    title: 'Campaign Launch',
    description: 'Campaign strategy development and execution begins.',
  },
];

const deliverables = [
  { icon: Eye, text: 'Increased Visibility and User Engagement', color: 'text-blue-600' },
  {
    icon: Sparkles,
    text: 'Social Media Creative Design and Video Uploads',
    color: 'text-purple-600',
  },
  {
    icon: BarChart3,
    text: 'Monthly Performance Reports with Actionable Insights',
    color: 'text-emerald-600',
  },
  { icon: ShoppingCart, text: 'Increased Customer Sales and Orders', color: 'text-orange-600' },
  { icon: TrendingUp, text: 'Social Media Growth and Increased Followers', color: 'text-cyan-600' },
  {
    icon: UserPlus,
    text: 'Improved Lead Generation and Conversion Opportunities',
    color: 'text-rose-600',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'CEO, TechStart Solutions',
    content:
      'S P ASSOCIATES transformed our digital presence completely. Our organic traffic increased by 200% within just 3 months of their SEO campaign.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Founder, GreenEarth Organics',
    content:
      'Their social media marketing strategy helped us build a thriving community of brand advocates. Our engagement rates have never been higher.',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    role: 'Marketing Head, UrbanCraft India',
    content:
      'The PPC campaigns managed by S P ASSOCIATES delivered an exceptional ROI. Their data-driven approach is truly world-class.',
    rating: 5,
  },
];

const faqs = [
  {
    question: 'How long does it take to see results from SEO?',
    answer:
      'SEO is a long-term strategy. Typically, you can start seeing initial improvements in 3-6 months, with significant results building over 6-12 months. We provide monthly progress reports to track improvements.',
  },
  {
    question: 'Which social media platforms should my business use?',
    answer:
      'The ideal platform mix depends on your target audience and business goals. During our discovery phase, we analyze your audience demographics and industry to recommend the most effective platforms for your brand.',
  },
  {
    question: 'What is the minimum budget for PPC campaigns?',
    answer:
      'The advertising budget is separate from our management fee and is set by you. We recommend a minimum ad spend of ₹15,000-₹20,000/month for meaningful results, but we can work with any budget and optimize accordingly.',
  },
  {
    question: 'How do you measure campaign success and report performance?',
    answer:
      'We provide comprehensive monthly reports covering key metrics such as website traffic, conversion rates, engagement metrics, ROI, and more. We also offer real-time dashboard access and monthly strategy calls.',
  },
  {
    question: 'Can I customize my service package?',
    answer:
      'Absolutely! We understand every business has unique needs. You can mix and match services or opt for our complete digital marketing package for the best value. Contact us for a customized proposal.',
  },
  {
    question: 'What is the payment terms and contract duration?',
    answer:
      'Our services are billed monthly with payment due within 7 days of invoice. We typically work on a minimum 3-month contract to allow sufficient time for strategy implementation and results measurement.',
  },
];

function ServiceCard({ service, index }: { service: (typeof services)[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <FadeInCard index={index}>
      <Card
        className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-zinc-900 rounded-2xl"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className={cn('h-2 w-full bg-gradient-to-r', service.gradient)} />
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4 mb-3">
            <div
              className={cn(
                'flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110',
                service.gradient,
              )}
            >
              <service.icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <Badge variant="outline" className="text-xs font-medium">
                Starting from
              </Badge>
              <p className="text-lg font-bold text-foreground mt-1">{service.price}</p>
            </div>
          </div>
          <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
          <CardDescription className="text-sm mt-2">{service.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {service.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0.7, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 text-sm"
              >
                <CheckCircle2
                  className={cn(
                    'h-4 w-4 mt-0.5 flex-shrink-0 transition-colors duration-300',
                    isExpanded ? 'text-emerald-500' : 'text-muted-foreground',
                  )}
                />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </FadeInCard>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30',
          )}
        />
      ))}
    </div>
  );
}

export default function DigitalMarketingPage() {
  return (
    <div className="h-full overflow-auto bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-cyan-500/5 to-purple-600/5 dark:from-blue-600/10 dark:via-cyan-500/10 dark:to-purple-600/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 px-4 py-2 text-sm bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border-0">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Digital Marketing Services Proposal
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Transform Your Digital
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                Presence Today
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
              Thank you for considering <strong className="text-foreground">S P ASSOCIATES</strong>{' '}
              as your digital marketing partner. We are a results-driven digital marketing service
              provider dedicated to helping brands grow their online presence, engage their target
              audience, and drive measurable business results through strategic digital marketing
              solutions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-xl hover:shadow-blue-500/25 transition-all duration-300 rounded-xl"
                onClick={() =>
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Explore Services <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base border-2 hover:bg-muted/50 rounded-xl"
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Schedule a Consultation
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { number: '50+', label: 'Clients Served', icon: Building2 },
                { number: '200+', label: 'Campaigns Run', icon: Rocket },
                { number: '95%', label: 'Client Retention', icon: Heart },
                { number: '4.9', label: 'Avg. Rating', icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.number}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Objectives Section */}
      <SectionWrapper className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border-0">
              Our Objectives
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What We Aim to Achieve
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our digital marketing services are designed to deliver measurable impact across every
              channel.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Globe,
                title: 'Brand Visibility',
                desc: 'Enhance brand visibility across digital platforms',
                gradient: 'from-blue-600 to-cyan-500',
              },
              {
                icon: Users,
                title: 'Lead Generation',
                desc: 'Generate high-quality leads for your business',
                gradient: 'from-purple-600 to-pink-500',
              },
              {
                icon: Heart,
                title: 'Community Building',
                desc: 'Build a loyal community and strengthen online reputation',
                gradient: 'from-rose-600 to-red-500',
              },
              {
                icon: TrendingUp,
                title: 'Traffic & Rankings',
                desc: 'Drive website traffic and improve search engine rankings',
                gradient: 'from-emerald-600 to-teal-500',
              },
              {
                icon: BarChart3,
                title: 'ROI Optimization',
                desc: 'Improve ROI on paid media campaigns',
                gradient: 'from-orange-600 to-amber-500',
              },
              {
                icon: Target,
                title: 'Strategic Growth',
                desc: 'Data-driven strategies for sustainable business growth',
                gradient: 'from-cyan-600 to-blue-500',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="group relative p-6 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br shadow-md mb-4',
                    item.gradient,
                  )}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Services Section */}
      <SectionWrapper id="services" className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent dark:from-blue-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border-0">
              Services Offered
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Comprehensive Digital Marketing Solutions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From SEO to social media, we offer end-to-end digital marketing services tailored to
              your business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Pricing Summary Table */}
      <SectionWrapper id="pricing" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-emerald-600/10 text-emerald-600 dark:bg-emerald-600/20 dark:text-emerald-400 border-0">
              Pricing Summary
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Transparent & Competitive Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the services you need or go with our complete package for maximum value.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-cyan-500">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                        Service
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                        Description
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-white">
                        Starting Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pricingData.map((row, i) => (
                      <motion.tr
                        key={row.service}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-foreground">{row.service}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {row.description}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-foreground">
                          {row.price}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Complete Package */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <Badge className="mb-4 bg-white/20 text-white border-0 hover:bg-white/30">
                  Best Value
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  Complete Digital Marketing Package
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[
                    'SEO',
                    'Content Marketing',
                    'PPC Ads Management',
                    'Social Media Marketing',
                    'Monthly Reporting',
                    'Strategy Consultation',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-6 border-t border-white/20">
                  <div>
                    <p className="text-sm text-white/70">Total Package Cost</p>
                    <p className="text-3xl sm:text-4xl font-bold">₹35,000/month + GST</p>
                    <p className="text-sm text-white/70 mt-1">*Advertising Budget Not Included</p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-white/90 shadow-xl px-8 h-12 text-base"
                    onClick={() =>
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Get This Package <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Our Approach */}
      <SectionWrapper id="approach" className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent dark:via-blue-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-purple-600/10 text-purple-600 dark:bg-purple-600/20 dark:text-purple-400 border-0">
              Our Approach
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How We Deliver Results
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A proven 5-step methodology that ensures every campaign is strategic, data-driven, and
              results-oriented.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-cyan-500 to-purple-600 hidden md:block" />

            <div className="space-y-8 md:space-y-0 relative">
              {approachSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="md:flex items-start gap-8 pb-8 md:pb-12 relative"
                >
                  <div className="hidden md:flex w-16 flex-shrink-0 justify-center relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
                      <step.icon className="h-7 w-7" />
                    </div>
                  </div>

                  {/* Mobile step indicator */}
                  <div className="flex md:hidden items-center gap-4 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <Badge className="bg-blue-600/10 text-blue-600 border-0">
                      Step {step.step}
                    </Badge>
                  </div>

                  <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border shadow-sm hover:shadow-lg transition-all duration-300">
                    <Badge className="hidden md:inline-flex mb-3 bg-blue-600/10 text-blue-600 border-0">
                      Step {step.step}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Next Steps */}
      <SectionWrapper className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-amber-600/10 text-amber-600 dark:bg-amber-600/20 dark:text-amber-400 border-0">
              Next Steps
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Your Onboarding Journey
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A seamless 4-step process to get your campaigns up and running quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {nextSteps.map((step, i) => (
              <FadeInCard key={step.step} index={i}>
                <div className="relative p-6 sm:p-8 bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-orange-500 text-white text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </FadeInCard>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Deliverables */}
      <SectionWrapper className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/5 to-transparent dark:from-emerald-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-emerald-600/10 text-emerald-600 dark:bg-emerald-600/20 dark:text-emerald-400 border-0">
              Deliverables
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What You Can Expect
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tangible results and measurable outcomes delivered every month.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {deliverables.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group flex items-start gap-4 p-6 bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-foreground pt-2.5">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Important Note */}
      <SectionWrapper className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/50 mx-auto mb-4">
              <span className="text-2xl font-bold text-amber-600">!</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Important Note</h3>
            <p className="text-base text-muted-foreground font-medium">
              Ad Budget will be provided separately by the Client and is not included in service
              fees.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* Testimonials */}
      <SectionWrapper className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-yellow-600/10 text-yellow-600 dark:bg-yellow-600/20 dark:text-yellow-400 border-0">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real feedback from businesses we have helped grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <FadeInCard key={t.name} index={i}>
                <Card className="h-full border-0 shadow-lg bg-white dark:bg-zinc-900 rounded-2xl">
                  <CardHeader>
                    <StarRating rating={t.rating} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-sm">
                        {t.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInCard>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ Section */}
      <SectionWrapper id="faq" className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent dark:from-blue-600/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border-0">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Answers to common questions about our digital marketing services.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm p-2">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="px-4">
                  <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline hover:text-blue-600 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </SectionWrapper>

      {/* Acceptance / Signature Section */}
      <SectionWrapper className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-zinc-900 border shadow-lg">
            <div className="text-center mb-10">
              <Badge className="mb-4 px-4 py-1.5 text-sm bg-blue-600/10 text-blue-600 border-0">
                Acceptance
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Proposal Acceptance
              </h2>
              <p className="text-muted-foreground">
                By signing below, the client agrees to the terms and conditions outlined in this
                quotation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-6 rounded-xl bg-muted/30 border">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Client Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Client Signature</p>
                    <div className="h-10 border-b-2 border-dashed border-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <div className="h-10 border-b-2 border-dashed border-muted-foreground/30" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/30 border">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-cyan-600" />
                  Agency Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Authorized Signature (Agency)
                    </p>
                    <div className="h-10 border-b-2 border-dashed border-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <div className="h-10 border-b-2 border-dashed border-muted-foreground/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Closing Message + Footer */}
      <SectionWrapper className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 sm:p-14 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-700 text-white shadow-2xl"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mx-auto mb-6">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Thank You for Considering S P ASSOCIATES
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              We look forward to working with you and helping your business achieve measurable
              digital growth and long-term success.
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-8" />
            <p className="text-white/60 text-sm">Yours sincerely,</p>
            <p className="text-lg font-bold mt-2">For and on behalf of S P ASSOCIATES</p>

            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
              <p>&copy; {new Date().getFullYear()} S P ASSOCIATES. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>
    </div>
  );
}
