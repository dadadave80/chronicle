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

export type NavLinksType = {
  name: string;
  to: string;
};

export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export type RegisterInputValues = {
  name: string;
  role: string;
};

export type SideBarLinksTypes = {
  href: string;
  title: string;
  icon: ReactNode;
};
