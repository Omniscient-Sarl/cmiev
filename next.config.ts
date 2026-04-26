import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cmiev.ch",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  async redirects() {
    return [
      // Old WordPress: /therapeutes → /praticiens
      { source: "/therapeutes", destination: "/fr/praticiens", permanent: true },
      { source: "/fr/therapeutes", destination: "/fr/praticiens", permanent: true },
      { source: "/:locale/therapeutes", destination: "/:locale/praticiens", permanent: true },

      // Old WordPress: /photos → /galerie
      { source: "/photos", destination: "/fr/galerie", permanent: true },
      { source: "/fr/photos", destination: "/fr/galerie", permanent: true },
      { source: "/en/photos", destination: "/en/galerie", permanent: true },
      { source: "/es/photos", destination: "/es/galerie", permanent: true },
      { source: "/it/photos", destination: "/it/galerie", permanent: true },

      // Old WordPress: English variants
      { source: "/en/therapists", destination: "/en/praticiens", permanent: true },
      { source: "/en/about", destination: "/en", permanent: true },

      // Old WordPress: discipline pages → homepage
      { source: "/fr/osteopathie", destination: "/fr/praticiens/elio-bosani", permanent: true },
      { source: "/fr/physiotherapie", destination: "/fr/praticiens", permanent: true },
      { source: "/fr/homeopathie", destination: "/fr/praticiens/beatrice-milbert", permanent: true },
      { source: "/fr/psychiatrie", destination: "/fr/praticiens/corinne-dauve", permanent: true },
      { source: "/fr/fasciatherapie", destination: "/fr/praticiens/severine-schwab", permanent: true },

      // Old WordPress: other common paths
      { source: "/fr/pilates-2", destination: "/fr/pilates", permanent: true },
      { source: "/fr/contact-2", destination: "/fr/contact", permanent: true },
      { source: "/fr/a-propos", destination: "/fr", permanent: true },
      { source: "/fr/equipe", destination: "/fr/praticiens", permanent: true },
      { source: "/fr/accueil", destination: "/fr", permanent: true },
      { source: "/fr/nos-therapeutes", destination: "/fr/praticiens", permanent: true },
      { source: "/fr/galerie-photos", destination: "/fr/galerie", permanent: true },
      { source: "/fr/cours", destination: "/fr/cours-collectifs", permanent: true },
    ];
  },
};

export default nextConfig;
