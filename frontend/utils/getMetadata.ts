import type { Metadata } from "next";

const isProduction = process.env.NODE_ENV === "production";
const baseUrl = isProduction
  ? "https://chronify-s.vercel.app/"
  : `http://localhost:${process.env.PORT || 3000}`;

const titleTemplate = "%s | Chronify";

export const getMetadata = ({
  title,
  description,
}: {
  title: string;
  description: string;
  imageRelativePath?: string;
}): Metadata => {
  // const imageUrl = `${baseUrl}${imageRelativePath}`;

  return {
    generator: "Chronify",
    applicationName: "Chronify",
    referrer: "origin-when-cross-origin",
    keywords: [
      "Hedera",
      "Hello Future Hackathon",
      "Supply Chain",
      "Blockchain",
      "EIP-2535",
      "Diamond Standard",
      "NFT",
      "Traceability",
      "Provenance",
      "Smart Contract",
      "DApp",
    ],
    creator: "Chronify",
    publisher: "Chronify",
    metadataBase: new URL(baseUrl),
    manifest: `/manifest.json`,
    alternates: {
      canonical: baseUrl,
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    title: {
      default: title,
      template: titleTemplate,
    },
    description: description,
    openGraph: {
      title: {
        default: title,
        template: titleTemplate,
      },
      description: description,
      images: [
        {
          url: "/black-logo.png",
          alt: "Chronify: The Future of Supply Chain Transparency",
        },
      ],
      type: "website",
      siteName: "Chronify",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: {
        default: title,
        template: titleTemplate,
      },
      description: description,
      images: [
        {
          url: "/black-logo.png",
          alt: "Chronify: The Future of Supply Chain Transparency",
        },
      ],
    },
    icons: {
      icon: [
        {
          url: `/favicon-32x32.png`,
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: `/favicon-16x16.png`,
          sizes: "16x16",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: `/apple-touch-icon.png`,
          sizes: "180x180",
          type: "image/png",
        },
      ],
      shortcut: `/favicon.ico`,
    },
  };
};
