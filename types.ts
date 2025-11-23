
export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  imageUrl: string;
}

export interface Testimonial {
  id: number;
  name: string;
  comment: string;
  rating: number;
  avatar: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  recommendedAge: string;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  category: string;
}

export enum SectionId {
  HOME = 'home',
  ABOUT = 'about',
  SERVICES = 'services',
  PACKAGES = 'packages',
  BLOG = 'blog',
  BENEFITS = 'benefits',
  CONTACT = 'contact',
}
