import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    canonicalUrl?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    schema?: object; // JSON-LD Structured Data
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "Discover WristHub's premium collection of luxury watches in Pakistan. Elegant designs, superior craftsmanship, and nationwide delivery.",
    canonicalUrl = "https://wristhub.pk",
    image = "https://wristhub.pk/wristhublogo.svg",
    type = 'website',
    schema
}) => {
    const siteTitle = `${title} | WristHub Premium`;

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": "WristHub Premium Watches",
        "image": "https://wristhub.pk/wristhublogo.svg",
        "@id": "https://wristhub.pk",
        "url": "https://wristhub.pk",
        "telephone": "+923000000000",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Main Market",
            "addressLocality": "Lahore",
            "postalCode": "54000",
            "addressCountry": "PK"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 31.5204,
            "longitude": 74.3587
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "10:00",
            "closes": "22:00"
        },
        "sameAs": [
            "https://www.facebook.com/wristhubpk",
            "https://www.instagram.com/wristhubpk"
        ]
    }; // Default store schema if no specific product schema is provided

    const finalSchema = schema || localBusinessSchema;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={canonicalUrl} />

            <meta property="og:locale" content="en_PK" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD Structured Data (Google Rich Snippets) */}
            <script type="application/ld+json">
                {JSON.stringify(finalSchema)}
            </script>
        </Helmet>
    );
};

export default SEO;
