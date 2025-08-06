/* eslint-disable @typescript-eslint/no-explicit-any */
export type MaxWrapperTypes = {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
  [key: string]: any;
};

export type ErrorDisplayProps = {
  message?: string;
};

export type SubNavLinkType = {
  name: string;
  href: string;
  description: string;
};

export type PromoCardType = {
  imageUrl: string;
  imageAlt: string;
  title: string;
  linkText: string;
  href: string;
  bgColor: string;
};

export type NavLinksType = {
  name: string;
  href: string;
  subNav?: SubNavLinkType[];
  promo?: PromoCardType;
};

export type PartnersType = {
  src: string;
  alt: string;
  width: number;
  height: number;
};
