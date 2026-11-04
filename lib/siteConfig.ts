/**
 * Every word on the site lives here so the owner can edit content in one place.
 * Components read from this file and never hard-code copy.
 */

export const site = {
  name: 'Anthem Consult',
  wordmark: 'ANTHEM CONSULT',
  domain: 'https://www.anthemconsult.com',
  tagline: 'Strategies for profitable growth.',
  description:
    'Anthem Consult helps organizations grow through business services, outsourcing, software and training — economically, on time and without compromising quality. Guntur, Andhra Pradesh, since 1993.',
  foundedYear: 1993,
  themeColor: '#070A12',
  copyright: '© 2026 Anthem Consult. All rights reserved.',
  location: {
    city: 'Guntur',
    country: 'IN',
    label: 'GUNTUR · IN',
    coords: '16.29° N / 80.43° E',
    lat: 16.291562733450778,
    lng: 80.42746247346936,
    timeZone: 'Asia/Kolkata',
    timeZoneLabel: 'IST',
  },
  contact: {
    addressLines: [
      'Flat No. 201, Block A, Rishi Valley Apartment',
      'Srinivasarao Thota, Opp. Medical Club Road',
      'Guntur 522004, Andhra Pradesh, India',
    ],
    email: 'info@anthemconsult.com',
    phone: '+91 92468 31142',
    phoneHref: 'tel:+919246831142',
    mapsUrl: 'https://www.google.com/maps?q=16.291562733450778,80.42746247346936',
  },
  social: [
    { label: 'Facebook', href: 'https://facebook.com/Anthemconsult' },
    { label: 'Twitter / X', href: 'https://twitter.com/anthemconsult' },
  ],
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Contact', href: '/contact' },
] as const;

export const cta = {
  consultation: { label: 'Get a consultation', href: '/contact' },
  services: { label: 'Explore services', href: '/services' },
} as const;

export type ServiceId =
  | 'software-development'
  | 'web-design-development'
  | 'outsourcing'
  | 'business-services'
  | 'online-trainings'
  | 'corporate-training-services';

export interface Service {
  id: ServiceId;
  index: string;
  title: string;
  short: string;
  intro: string;
  paragraphs: string[];
  bullets?: { heading: string; items: string[] };
}

export const services: Service[] = [
  {
    id: 'software-development',
    index: '01',
    title: 'Software Development',
    short: 'Software that performs — secure, high quality and good value, on Microsoft, Java and mobile.',
    intro:
      'Started through a group company, our software practice delivers applications that perform, stay secure and hold their quality while remaining good value.',
    paragraphs: [
      'We bring expertise in Microsoft technologies, Java and mobile platforms, and we take projects end to end: web development, e-commerce, software and application design, and the application support and maintenance that follows.',
      'Our enterprise applications and custom e-commerce systems streamline processes and integrate operations across the organization.',
      'We aim to be your right technology partners: improving the way work flows and finding operational savings along the way.',
    ],
    bullets: {
      heading: 'What we build',
      items: [
        'Web development and e-commerce',
        'Software and application design',
        'Enterprise application integration',
        'Application support and maintenance',
      ],
    },
  },
  {
    id: 'web-design-development',
    index: '02',
    title: 'Web Design & Development',
    short: 'End-to-end web and e-commerce builds designed around each client’s needs.',
    intro:
      'End-to-end web development and e-commerce solutions, built around what each client actually needs.',
    paragraphs: [
      'Every site and store we design exists to create opportunities, streamline processes and cut operating costs — not to decorate.',
      'From the first wireframe to launch and beyond, one team carries the work, so decisions stay consistent and the result stays maintainable.',
    ],
    bullets: {
      heading: 'Outcomes we design for',
      items: ['New commercial opportunities', 'Streamlined processes', 'Lower operating costs'],
    },
  },
  {
    id: 'outsourcing',
    index: '03',
    title: 'Outsourcing',
    short: 'A ten-step recruitment methodology, from the first discussion to post-employment feedback.',
    intro:
      'Anthem Consult Recruitment Methodology: ten deliberate steps that take a role from a conversation with the client to a settled, suitable hire.',
    paragraphs: [
      'Every organization and every candidate is unique. Our outsourcing practice exists to match them well, and to keep supporting the match after the offer is signed.',
    ],
  },
  {
    id: 'business-services',
    index: '04',
    title: 'Business Services',
    short: 'Research and analysis, customized to each client and applied to specific business problems.',
    intro:
      'We evaluate measurement data, combine it with client and third-party data, and apply it to the specific business problem in front of you.',
    paragraphs: [
      'Research is customized to each client and can be viewed by industry, product category or geography, with tailored survey design and cost-efficient results.',
      'Every analysis is strictly confidential. Our interviewers are trained for hard-to-reach groups and sensitive topics.',
      'We help you understand why campaigns succeed or fail — pricing, promotion, targeting and the marketing mix as a whole.',
    ],
  },
  {
    id: 'online-trainings',
    index: '05',
    title: 'Online Trainings',
    short: 'Software and IT courses by certified, working trainers, with live classrooms and online labs.',
    intro:
      'Software and IT courses taught by certified professionals and working trainers, in weekday and weekend batches, for students and working professionals alike.',
    paragraphs: [
      'Our faculty are qualified, certified IT professionals with real industry experience, and they teach at the learner’s pace.',
      'Classes run in live, interactive virtual classrooms.',
      'Online labs let learners practise on remote lab machines in real time, during or after sessions, with trainer support on hand.',
    ],
    bullets: {
      heading: 'How it runs',
      items: [
        'Weekday and weekend batches',
        'Live interactive virtual classrooms',
        'Remote lab machines, during or after sessions',
        'Trainer support throughout',
      ],
    },
  },
  {
    id: 'corporate-training-services',
    index: '06',
    title: 'Corporate Training Services',
    short: 'Technical and non-technical training for companies and institutions across India, in-house or on-site.',
    intro:
      'Technical and non-technical training for companies, colleges, universities, schools, and government and private institutions across India — in-house or on-site.',
    paragraphs: [
      'Programmes align people’s skills with industry needs and emerging technologies.',
      'We build attitude and professional skills at every level of the organization, not only at the top.',
    ],
    bullets: {
      heading: 'Methods',
      items: ['Online assessments', 'On-the-job training', 'Classroom sessions', 'Experiential learning'],
    },
  },
];

export const methodology = {
  title: 'Anthem Consult Recruitment Methodology',
  eyebrow: 'How we recruit',
  steps: [
    {
      name: 'Requirements',
      text: 'Detailed discussion with the client to ascertain their personnel requirements.',
    },
    { name: 'Job profiles', text: 'Jointly develop the job profiles and descriptions.' },
    { name: 'Peer discussions', text: 'Hold discussions with the peer group for the positions to be filled.' },
    {
      name: 'Sourcing plan',
      text: 'Finalize sourcing with the client: advertising, headhunting, targeting specific organizations and other options.',
    },
    { name: 'Search', text: 'Search and identify suitable candidates.' },
    { name: 'Screening', text: 'Preliminary screening and selection of candidates by Anthem Consult.' },
    { name: 'Testing', text: 'Assist the client with technical, personality and soft-skills tests.' },
    { name: 'Interviews', text: 'Assist the client with initial and final interviews.' },
    { name: 'Terms', text: 'Assist with negotiating and finalizing employment terms.' },
    {
      name: 'Feedback',
      text: 'Post-employment suitability feedback, followed by counselling if required.',
    },
  ],
  sectors: [
    'Software Development',
    'Pharmaceutical & Chemicals',
    'Human Resource Management',
    'Manufacturing / Engineering / Automotive / Construction',
    'Insurance / Banking / Financial Services',
    'BPO',
    'Call Center',
    'FMCG',
    'Construction & Real Estate',
    'Retail',
    'Agriculture',
    'Telecom',
    'Medical',
    'NGOs',
  ],
} as const;

export const analyses = [
  'Market opportunity analysis',
  'Demand assessment',
  'Product portfolio analysis',
  'Competition analysis',
  'Monitoring industries and companies',
  'Market entry strategies',
  'Strategies for growth',
  'Customer management',
  'Operational efficiency',
  'Performance improvement',
  'Product potential survey',
  'Analysis of customer segments, products, channels and technologies',
] as const;

export const industries = [
  'Software / IT',
  'Pharmaceutical & Chemicals',
  'Lifesciences',
  'Financial Services',
  'BPO / Call Center',
  'Management',
  'Retail',
  'Construction & Real Estate',
  'FMCG',
  'Telecom',
  'Agri Business',
  'Others',
] as const;

export const offerings = [
  {
    title: 'Business Intelligence Pro',
    text: 'Packaged research, from company profiles to in-depth economic, industry and company analysis, covering global, regional and national markets. Custom work is available.',
  },
  {
    title: 'Knowledge Services',
    text: 'Customized, outsourced research on economies, industries and companies — sector, demand-supply and product analysis — under strict confidentiality, with NDAs available.',
  },
  {
    title: 'Business Advisory Services',
    text: 'Growth strategy, market entry, demand assessment, market tracking, equity valuation, supply-chain and competitive analysis.',
  },
] as const;

export const figures = [
  { value: '25+', label: 'Years of consulting experience' },
  { value: '1993', label: 'Serving clients since' },
  { value: '1,563+', label: 'Global clients' },
  { value: '12', label: 'Industries served' },
] as const;

export const home = {
  hero: {
    eyebrow: 'Business consulting · Outsourcing · Since 1993',
    headline: 'Strategies for profitable growth.',
    lead: 'Anthem Consult helps organizations grow through business services, outsourcing, software and training — economically, on time and without compromising quality.',
  },
  services: {
    eyebrow: 'Services',
    heading: 'Six ways we work with you',
    lead: 'One firm, six practices. Hover a practice to see where it stands in the field.',
  },
  recruit: {
    eyebrow: 'How we recruit',
    heading: 'Ten steps from a conversation to the right hire',
    lead: 'Our outsourcing practice follows one methodology for every role, so clients know exactly what happens next.',
    link: { label: 'See the full methodology', href: '/services#outsourcing' },
  },
  industries: {
    eyebrow: 'Industries',
    heading: 'Twelve industries, one standard',
    lead: 'Consultants with hands-on experience across sectors, applying the same rigour to each.',
    link: { label: 'Find your industry', href: '/industries' },
  },
  figures: {
    eyebrow: 'Key figures',
    heading: 'Built over three decades',
  },
  closing: {
    quote: 'We do what is right, not what is most profitable for us.',
    text: 'Tell us where you want to grow. We will tell you honestly how we can help.',
  },
} as const;

export const about = {
  hero: {
    eyebrow: 'About',
    heading: 'Welcome to Anthem Consult',
    paragraphs: [
      'Anthem Consult looks for business opportunities across organizations, serving clients in business services and outsourcing with economical development benefits while keeping quality and timelines.',
      'Every organization and every candidate is unique. The work is matching them well.',
    ],
  },
  vision: {
    eyebrow: 'Vision',
    heading: 'To build one of the best-known outsourcing and business services firms.',
  },
  mission: {
    eyebrow: 'Mission',
    heading:
      'To help our clients make distinctive, lasting and substantial improvements in their performance, and to build a firm that attracts, develops and retains exceptional people.',
    text: 'Our research and analytics exist so that clients make decisions on the right information.',
  },
  timeline: {
    eyebrow: 'History',
    heading: 'A line that keeps rising',
    milestones: [
      {
        year: '1993',
        title: 'Where we started',
        text: 'A vision to empower organizations and individuals to reach their full potential.',
      },
      { year: '1995', title: 'A team of 100+', text: 'A team of more than one hundred people.' },
      {
        year: '2001',
        title: 'A culture of ambition',
        text: 'A culture that nurtures and supports our people’s ambitions.',
      },
    ],
  },
  principle: {
    eyebrow: 'Principle',
    heading: 'Flexible, long-term support.',
    text: 'We take pride in doing what is right rather than what is right for the profitability of our firm.',
  },
} as const;

export const servicesPage = {
  hero: {
    eyebrow: 'Services',
    heading: 'Six practices, one firm',
    lead: 'Software, web, outsourcing, business services and training, delivered by the same people who answer the phone.',
  },
  outsourcing: {
    sectorsHeading: 'Sectors we recruit for',
  },
  businessServices: {
    analysesHeading: 'Twelve analyses',
    analysesLead: 'Hover an analysis to light its tile.',
  },
  closing: {
    heading: 'Which practice fits the problem in front of you?',
    text: 'Tell us what you are trying to change. We will say plainly which of the six practices can help, and which cannot.',
  },
} as const;

export const industriesPage = {
  hero: {
    eyebrow: 'Industries',
    heading: 'Find your industry solution',
    lead: 'Our consultants bring hands-on experience across sectors, helping clients respond to competitive, regulatory and technology change.',
  },
  ring: {
    eyebrow: 'Twelve industries',
    heading: 'The same rigour, sector by sector',
    lead: 'Hover an industry to light its tower.',
  },
  offerings: {
    eyebrow: 'Three offerings',
    heading: 'Research, knowledge and advisory',
  },
  closing: {
    heading: 'Please contact us for client rankings and success stories.',
    text: 'We share references and outcomes directly with prospective clients.',
  },
} as const;

export const contactPage = {
  eyebrow: 'Contact',
  heading: 'Get in touch with us.',
  lead: 'Write to us about a role to fill, a system to build or a market to understand. We reply from Guntur within one working day.',
  form: {
    heading: 'Send an enquiry',
    fields: {
      name: 'Your name',
      organization: 'Organization',
      email: 'Email',
      phone: 'Phone',
      service: 'Service of interest',
      message: 'Message',
    },
    submit: 'Send enquiry',
    sending: 'Sending…',
    successHeading: 'Thank you. Your enquiry is with us.',
    successText: 'Keep this reference for your records. We will reply by email.',
    errorHeading: 'We could not send your enquiry.',
    errorText: 'Please email us directly instead — the message below is ready to send.',
    mailtoLabel: 'Open in your email app',
    privacy: 'Your details are used only to answer this enquiry.',
  },
  details: {
    addressLabel: 'Office',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    mapsLabel: 'Open in Google Maps',
  },
} as const;

export const footer = {
  tagline: 'Strategies for profitable growth, from Guntur to the world, since 1993.',
  columns: {
    services: 'Services',
    contact: 'Contact',
    follow: 'Follow',
  },
} as const;

export const pageMeta = {
  '/': {
    title: 'Anthem Consult — Strategies for profitable growth',
    description: site.description,
  },
  '/about': {
    title: 'About — Anthem Consult',
    description:
      'Anthem Consult has served clients in business services and outsourcing since 1993, matching organizations and people well while keeping quality and timelines.',
  },
  '/services': {
    title: 'Services — Anthem Consult',
    description:
      'Software development, web design, outsourcing and recruitment, business services and research, online and corporate training from Anthem Consult.',
  },
  '/industries': {
    title: 'Industries — Anthem Consult',
    description:
      'Twelve industries served with one standard: software, pharma, lifesciences, financial services, BPO, retail, construction, FMCG, telecom, agri business and more.',
  },
  '/contact': {
    title: 'Contact — Anthem Consult',
    description:
      'Get in touch with Anthem Consult in Guntur, Andhra Pradesh. Email info@anthemconsult.com or call +91 92468 31142.',
  },
} as const;

export type RouteKey = keyof typeof pageMeta;

export const pageLabels: Record<RouteKey, string> = {
  '/': 'Home',
  '/about': 'About',
  '/services': 'Services',
  '/industries': 'Industries',
  '/contact': 'Contact',
};
