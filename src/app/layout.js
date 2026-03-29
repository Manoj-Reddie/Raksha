import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";
import LegalGuide from "@/components/legalGuide";
import Image from "next/image";
import logo from "../../public/raksha-logo.svg";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Raksha - Women's Safety & Empowerment",
  description: "Tech-Powered Security & Empowerment Platform for Women",
  manifest: "/manifest.json",
  keywords: ["women safety", "security", "empowerment", "legal aid", "community"],
  authors: [{ name: "Raksha Team" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Raksha",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/raksha-logo.svg",
    apple: "/raksha-logo.svg",
  },
  openGraph: {
    type: "website",
    title: "Raksha - Women's Safety & Empowerment",
    description: "Tech-Powered Security & Empowerment Platform for Women",
    url: "https://raksha.app",
    images: [
      {
        url: "/raksha-logo.svg",
        width: 512,
        height: 512,
        alt: "Raksha Logo",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Raksha" />
        <link rel="apple-touch-icon" href="/raksha-logo.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/raksha-logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-full`}
      >
        <PWAInstallPrompt />
        <div className=" hidden md:flex z-10 fixed justify-start   p-2 pt-0 rounded-b-lg items-center ml-20">
          <Image
            className=""
            src={logo}
            alt="Raksha Logo"
            width={70}
            height={70}
          />
          <p className="text-2xl font-bold logo-font">Raksha</p>
        </div>
        <div className="h-full w-full flex flex-row">
          <Navbar />
          <div className="flex-1 md:m-6">{children}</div>
          <Toaster position="top-right" />
          <LegalGuide />
        </div>
      </body>
    </html>
  );
}
