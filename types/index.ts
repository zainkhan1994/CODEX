export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface MetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}
