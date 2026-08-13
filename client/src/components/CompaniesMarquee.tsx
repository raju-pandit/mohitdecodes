import React, { useState } from 'react';

interface Company {
  name: string;
  slug: string;
  color: string;
  logoUrl?: string;
}

const row1Companies: Company[] = [
  { name: 'Google', slug: 'google', color: '#4285F4', logoUrl: 'https://www.vectorlogo.zone/logos/google/google-ar21.svg' },
  { name: 'Microsoft', slug: 'microsoft', color: '#00A4EF', logoUrl: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg' },
  { name: 'Amazon', slug: 'amazon', color: '#FF9900', logoUrl: 'https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg' },
  { name: 'Adobe', slug: 'adobe', color: '#FF0000', logoUrl: 'https://www.vectorlogo.zone/logos/adobe/adobe-ar21.svg' },
  { name: 'Apple', slug: 'apple', color: '#A2AAAD', logoUrl: 'https://www.vectorlogo.zone/logos/apple/apple-ar21.svg' },
  { name: 'Meta', slug: 'meta', color: '#0668E1', logoUrl: 'https://www.vectorlogo.zone/logos/facebook/facebook-ar21.svg' },
  { name: 'Netflix', slug: 'netflix', color: '#E50914', logoUrl: 'https://www.vectorlogo.zone/logos/netflix/netflix-ar21.svg' },
  { name: 'NVIDIA', slug: 'nvidia', color: '#76B900', logoUrl: 'https://www.vectorlogo.zone/logos/nvidia/nvidia-ar21.svg' },
  { name: 'IBM', slug: 'ibm', color: '#054ADA', logoUrl: 'https://www.vectorlogo.zone/logos/ibm/ibm-ar21.svg' },
  { name: 'Accenture', slug: 'accenture', color: '#A100FF', logoUrl: 'https://www.vectorlogo.zone/logos/accenture/accenture-ar21.svg' },
  { name: 'Deloitte', slug: 'deloitte', color: '#86BC25', logoUrl: 'https://www.vectorlogo.zone/logos/deloitte/deloitte-ar21.svg' },
  { name: 'Salesforce', slug: 'salesforce', color: '#00A1E0', logoUrl: 'https://www.vectorlogo.zone/logos/salesforce/salesforce-ar21.svg' },
  { name: 'Oracle', slug: 'oracle', color: '#F80000', logoUrl: 'https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg' },
  { name: 'Atlassian', slug: 'atlassian', color: '#0052CC', logoUrl: 'https://www.vectorlogo.zone/logos/atlassian/atlassian-ar21.svg' },
  { name: 'Cisco', slug: 'cisco', color: '#1BA0D7', logoUrl: 'https://www.vectorlogo.zone/logos/cisco/cisco-ar21.svg' },
  { name: 'Intel', slug: 'intel', color: '#0068B5', logoUrl: 'https://www.vectorlogo.zone/logos/intel/intel-ar21.svg' },
  { name: 'SAP', slug: 'sap', color: '#008FD3', logoUrl: 'https://www.vectorlogo.zone/logos/sap/sap-ar21.svg' },
  { name: 'ServiceNow', slug: 'servicenow', color: '#81B5A1', logoUrl: 'https://www.vectorlogo.zone/logos/servicenow/servicenow-ar21.svg' },
  { name: 'Uber', slug: 'uber', color: '#FFFFFF', logoUrl: 'https://www.vectorlogo.zone/logos/uber/uber-ar21.svg' },
  { name: 'Airbnb', slug: 'airbnb', color: '#FF5A5F', logoUrl: 'https://www.vectorlogo.zone/logos/airbnb/airbnb-ar21.svg' },
  { name: 'Spotify', slug: 'spotify', color: '#1DB954', logoUrl: 'https://www.vectorlogo.zone/logos/spotify/spotify-ar21.svg' },
  { name: 'PayPal', slug: 'paypal', color: '#003087', logoUrl: 'https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg' },
  { name: 'Walmart', slug: 'walmart', color: '#0071CE', logoUrl: 'https://www.vectorlogo.zone/logos/walmart/walmart-ar21.svg' },
  { name: 'JPMorgan Chase', slug: 'jpmorgan', color: '#117ACA', logoUrl: 'https://www.vectorlogo.zone/logos/jpmorgan/jpmorgan-ar21.svg' },
];

const row2Companies: Company[] = [
  { name: 'TCS', slug: 'tata', color: '#38bdf8' },
  { name: 'Infosys', slug: 'infosys', color: '#0284c7' },
  { name: 'Wipro', slug: 'wipro', color: '#60a5fa' },
  { name: 'HCLTech', slug: 'hcl', color: '#2563eb' },
  { name: 'Tech Mahindra', slug: 'techmahindra', color: '#f43f5e' },
  { name: 'Cognizant', slug: 'cognizant', color: '#3b82f6' },
  { name: 'Capgemini', slug: 'capgemini', color: '#0070AD' },
  { name: 'LTIMindtree', slug: 'ltimindtree', color: '#14b8a6' },
  { name: 'Zoho', slug: 'zoho', color: '#ef4444' },
  { name: 'Freshworks', slug: 'freshworks', color: '#3b82f6' },
  { name: 'Flipkart', slug: 'flipkart', color: '#eab308' },
  { name: 'Paytm', slug: 'paytm', color: '#06b6d4' },
  { name: 'PhonePe', slug: 'phonepe', color: '#a855f7' },
  { name: 'Zomato', slug: 'zomato', color: '#ef4444' },
  { name: 'Swiggy', slug: 'swiggy', color: '#f97316' },
  { name: 'Unacademy', slug: 'unacademy', color: '#10b981' },
  { name: 'Razorpay', slug: 'razorpay', color: '#0284c7' },
  { name: 'CRED', slug: 'cred', color: '#f8fafc' },
  { name: 'Meesho', slug: 'meesho', color: '#ec4899' },
  { name: 'Myntra', slug: 'myntra', color: '#f43f5e' },
  { name: 'Groww', slug: 'groww', color: '#10b981' },
  { name: 'Zerodha', slug: 'zerodha', color: '#3b82f6' },
  { name: 'BYJU\'S', slug: 'byjus', color: '#a855f7' },
  { name: 'Dream11', slug: 'dream11', color: '#ef4444' },
];

const CompanyLogoItem: React.FC<{ company: Company }> = ({ company }) => {
  const [imageError, setImageError] = useState(false);
  const simpleIconUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${company.slug}.svg`;
  const showCustomImg = company.logoUrl && !imageError;

  return (
    <div className="flex items-center gap-3 shrink-0 group cursor-pointer px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5">
      {showCustomImg ? (
        <img
          src={company.logoUrl}
          alt={`${company.name} logo`}
          onError={() => setImageError(true)}
          className="h-6 sm:h-7 w-auto max-w-[120px] object-contain transition-all duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div 
          className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundColor: company.color,
            maskImage: `url(${simpleIconUrl})`,
            WebkitMaskImage: `url(${simpleIconUrl})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        />
      )}

      <span 
        className="font-bold text-sm sm:text-base tracking-tight transition-all duration-300 whitespace-nowrap group-hover:brightness-125"
        style={{ color: company.color }}
      >
        {company.name}
      </span>
    </div>
  );
};

export const CompaniesMarquee: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden border-t border-white/5 bg-transparent">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mb-14">
        {/* Header Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-extrabold uppercase tracking-wider mb-5 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          TOP COMPANIES WHERE OUR STUDENTS WORK
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Trusted By Leading <span className="gradient-text-blue">Companies</span>
        </h2>

        <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
          Our students have gone on to build careers at some of the world's most renowned organizations. Their success is proof that the skills you gain here open doors to top opportunities across the industry.
        </p>
      </div>

      {/* Marquee Wrapper with side fade masks */}
      <div className="relative w-full overflow-hidden space-y-7 select-none">
        {/* Left Gradient Fade Mask */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#060814] via-[#060814]/70 to-transparent z-20 pointer-events-none" />
        
        {/* Right Gradient Fade Mask */}
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#060814] via-[#060814]/70 to-transparent z-20 pointer-events-none" />

        {/* Row 1 — Right to Left (100% Smooth Infinite Loop) */}
        <div className="flex overflow-hidden group/row1">
          <div className="flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8 animate-marquee-left group-hover/row1:[animation-play-state:paused] [animation-duration:38s]">
            {row1Companies.map((company, index) => (
              <CompanyLogoItem key={`r1-${company.name}-${index}`} company={company} />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8 animate-marquee-left group-hover/row1:[animation-play-state:paused] [animation-duration:38s]" aria-hidden="true">
            {row1Companies.map((company, index) => (
              <CompanyLogoItem key={`r1-dup-${company.name}-${index}`} company={company} />
            ))}
          </div>
        </div>

        {/* Row 2 — Left to Right (100% Smooth Infinite Loop) */}
        <div className="flex overflow-hidden group/row2">
          <div className="flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8 animate-marquee-right group-hover/row2:[animation-play-state:paused] [animation-duration:38s]">
            {row2Companies.map((company, index) => (
              <CompanyLogoItem key={`r2-${company.name}-${index}`} company={company} />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8 animate-marquee-right group-hover/row2:[animation-play-state:paused] [animation-duration:38s]" aria-hidden="true">
            {row2Companies.map((company, index) => (
              <CompanyLogoItem key={`r2-dup-${company.name}-${index}`} company={company} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
