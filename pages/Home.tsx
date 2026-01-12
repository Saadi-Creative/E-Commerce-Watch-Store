import React from 'react';
import { Helmet } from 'react-helmet-async';

// Components
import HeroSection from '../components/HeroSection';
import CollectionGrid from '../components/CollectionGrid';
import BrandStory from '../components/BrandStory';
import TestimonialsMasonry from '../components/TestimonialsMasonry';
import TrustBadges from '../components/TrustBadges';
import WhatsAppLink from '../components/WhatsAppLink';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>WristHub PK - Premium Watches in Pakistan</title>
        <meta name="description" content="Discover WristHub PK: The ultimate destination for premium watches in Pakistan. Luxury timepieces, cash on delivery, and exclusive designs." />
      </Helmet>

      <main className="bg-brand-darker min-h-screen text-white overflow-x-hidden">
        {/* 1. Hero Section (Video + Impact) */}
        <HeroSection />

        {/* 2. Trust Indicators (Immediate credibility) */}
        <TrustBadges />

        {/* 3. Featured Collections (Bento Grid) */}
        <div id="collections">
          <CollectionGrid />
        </div>

        {/* 4. Brand Story (Emotional Connection) */}
        <BrandStory />

        {/* 5. Social Proof (Testimonials) */}
        <TestimonialsMasonry />

        {/* Floating WhatsApp CTA */}
        <WhatsAppLink />
      </main>
    </>
  );
};

export default Home;