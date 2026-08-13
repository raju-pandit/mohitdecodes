import React, { useState } from 'react';

interface Company {
  name: string;
  slug: string;
  customLogo?: string;
}

const row1Companies: Company[] = [
  { name: 'Google', slug: 'google' },
  { name: 'Microsoft', slug: 'microsoft' },
  { name: 'Amazon', slug: 'amazon' },
  { name: 'Adobe', slug: 'adobe' },
  { name: 'Apple', slug: 'apple' },
  { name: 'Meta', slug: 'meta' },
  { name: 'Netflix', slug: 'netflix' },
  { name: 'NVIDIA', slug: 'nvidia' },
  { name: 'IBM', slug: 'ibm' },
  { name: 'Accenture', slug: 'accenture' },
  { name: 'Deloitte', slug: 'deloitte' },
  { name: 'Salesforce', slug: 'salesforce' },
  { name: 'Oracle', slug: 'oracle' },
  { name: 'Atlassian', slug: 'atlassian' },
  { name: 'Cisco', slug: 'cisco' },
  { name: 'Intel', slug: 'intel' },
  { name: 'SAP', slug: 'sap' },
  { name: 'ServiceNow', slug: 'servicenow' },
  { name: 'Uber', slug: 'uber' },
  { name: 'Airbnb', slug: 'airbnb' },
  { name: 'Spotify', slug: 'spotify' },
  { name: 'PayPal', slug: 'paypal' },
  { name: 'Walmart', slug: 'walmart' },
  { name: 'JPMorgan Chase', slug: 'jpmorgan' },
];

const row2Companies: Company[] = [
  { name: 'TCS', slug: 'tata' },
  { name: 'Infosys', slug: 'infosys' },
  { name: 'Wipro', slug: 'wipro' },
  { name: 'HCLTech', slug: 'hcl' },
  { name: 'Tech Mahindra', slug: 'techmahindra' },
  { name: 'Cognizant', slug: 'cognizant' },
  { name: 'Capgemini', slug: 'capgemini' },
  { name: 'LTIMindtree', slug: 'ltimindtree' },
  { name: 'Zoho', slug: 'zoho' },
  { name: 'Freshworks', slug: 'freshworks' },
  { name: 'Flipkart', slug: 'flipkart' },
  { name: 'Paytm', slug: 'paytm' },
  { name: 'PhonePe', slug: 'phonepe' },
  { name: 'Zomato', slug: 'zomato' },
  { name: 'Swiggy', slug: 'swiggy' },
  { name: 'Unacademy', slug: 'unacademy' },
  { name: 'Razorpay', slug: 'razorpay' },
  { name: 'CRED', slug: 'cred' },
  { name: 'Meesho', slug: 'meesho' },
  { name: 'Myntra', slug: 'myntra' },
  { name: 'Groww', slug: 'groww' },
  { name: 'Zerodha', slug: 'zerodha' },
  { name: 'BYJU\'S', slug: 'byjus' },
  { name: 'Dream11', slug: 'dream11' },
];

const CompanyLogoItem: React.FC<{ company: Company }> = ({ company }) => {
  const [imageError, setImageError] = useState(false);
  const logoUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${company.slug}.svg`;

  return (
    <div className="flex items-center gap-3 shrink-0 group cursor-pointer px-4 py-2 transition-all duration-300">
      {!imageError ? (
        <img
          src={logoUrl}
          alt={`${company.name} logo`}
          onError={() => setImageError(true)}
          className="h-7 sm:h-8 w-auto max-w-[140px] object-contain filter invert opacity-75 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
          loading="lazy"
        />
      ) : null}

      <span className="font-bold text-slate-300 group-hover:text-white text-base sm:text-lg tracking-tight transition-colors whitespace-nowrap">
        {company.name}
      </span>
    </div>
  );
};

export const CompaniesMarquee: React.FC = () => {
  // Multiply arrays for seamless infinite scrolling loop
  const row1Items = [...row1Companies, ...row1Companies, ...row1Companies];
  const row2Items = [...row2Companies, ...row2Companies, ...row2Companies];

  return (
    <section className="py-20 relative overflow-hidden border-b border-dark-800 bg-[#060814]">
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
      <div className="relative w-full overflow-hidden space-y-8 select-none">
        {/* Left Gradient Fade Mask */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#060814] via-[#060814]/80 to-transparent z-20 pointer-events-none" />
        
        {/* Right Gradient Fade Mask */}
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#060814] via-[#060814]/80 to-transparent z-20 pointer-events-none" />

        {/* Row 1 — Right to Left (Continuous) */}
        <div className="flex overflow-hidden group/row1">
          <div className="flex shrink-0 items-center gap-16 sm:gap-20 lg:gap-24 animate-marquee-left group-hover/row1:[animation-play-state:paused] [animation-duration:22s]">
            {row1Items.map((company, index) => (
              <CompanyLogoItem key={`r1-${company.name}-${index}`} company={company} />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-16 sm:gap-20 lg:gap-24 animate-marquee-left group-hover/row1:[animation-play-state:paused] [animation-duration:22s]" aria-hidden="true">
            {row1Items.map((company, index) => (
              <CompanyLogoItem key={`r1-dup-${company.name}-${index}`} company={company} />
            ))}
          </div>
        </div>

        {/* Row 2 — Left to Right (Continuous) */}
        <div className="flex overflow-hidden group/row2">
          <div className="flex shrink-0 items-center gap-16 sm:gap-20 lg:gap-24 animate-marquee-right group-hover/row2:[animation-play-state:paused] [animation-duration:22s]">
            {row2Items.map((company, index) => (
              <CompanyLogoItem key={`r2-${company.name}-${index}`} company={company} />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-16 sm:gap-20 lg:gap-24 animate-marquee-right group-hover/row2:[animation-play-state:paused] [animation-duration:22s]" aria-hidden="true">
            {row2Items.map((company, index) => (
              <CompanyLogoItem key={`r2-dup-${company.name}-${index}`} company={company} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
