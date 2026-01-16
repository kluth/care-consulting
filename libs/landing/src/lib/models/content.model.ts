/**
 * Content models for the landing page feature.
 * These interfaces define the structure of JSON content files.
 */

export interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
  backgroundImage?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features?: string[];
}

export interface ServicesContent {
  sectionTitle: string;
  sectionSubtitle?: string;
  services: Service[];
}

export interface EducationContent {
  sectionTitle: string;
  sectionSubtitle?: string;
  webinar?: WebinarInfo;
  resources?: Resource[];
}

export interface WebinarInfo {
  title: string;
  description: string;
  date: string; // ISO date string
  duration: string;
  registrationCta: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'article';
  downloadUrl?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export interface TestimonialsContent {
  sectionTitle: string;
  testimonials: Testimonial[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  credentials?: string[];
  linkedIn?: string;
}

export interface AboutContent {
  sectionTitle: string;
  introduction?: string;
  team: TeamMember[];
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: AddressInfo;
}

export interface AddressInfo {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface FooterContent {
  contact: ContactInfo;
  copyright: string;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: 'linkedin' | 'twitter' | 'instagram' | 'facebook';
  url: string;
}

export interface LegalPageContent {
  title: string;
  content: string; // HTML or Markdown content
  lastUpdated?: string;
}

/**
 * Complete landing page content structure
 */
export interface LandingPageContent {
  hero: HeroContent;
  services: ServicesContent;
  education: EducationContent;
  testimonials: TestimonialsContent;
  about: AboutContent;
  footer: FooterContent;
}

/**
 * Newsletter subscription request
 */
export interface NewsletterSubscription {
  email: string;
  consentGiven: boolean;
  source?: string;
  language?: string;
}

/**
 * Newsletter subscription response
 */
export interface NewsletterSubscriptionResponse {
  success: boolean;
  message: string;
  alreadySubscribed?: boolean;
}
