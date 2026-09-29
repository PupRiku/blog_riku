import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import Link from "next/link";
import { AdScripts } from "@/components/Ads";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const raleway = Raleway({ subsets: ["latin"], weight: "700", variable: "--font-raleway", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.riku.gay"),
  title: { default: "blog.riku.gay", template: "%s · blog.riku.gay" },
  description: "Riku's blog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${raleway.variable}`}>
      <body>
        <div className="container">
          <header className="site-header">
            <Link href="/" className="site-title">
              blog.riku.gay
            </Link>
            <nav className="site-nav" aria-label="Main">
              <Link href="/about">About</Link>
              <a href="https://riku.gay">
                riku.gay <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">© {new Date().getFullYear()} riku</footer>
        </div>
        <AdScripts />
      </body>
    </html>
  );
}
