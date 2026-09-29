import type { Metadata } from "next";
import Link from "next/link";
import { AdScripts } from "@/components/Ads";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.riku.gay"),
  title: { default: "blog.riku.gay", template: "%s · blog.riku.gay" },
  description: "Riku's blog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="site-header">
            <Link href="/" className="site-title">
              blog.riku.gay
            </Link>
          </header>
          <main>{children}</main>
          <footer className="site-footer">© {new Date().getFullYear()} riku</footer>
        </div>
        <AdScripts />
      </body>
    </html>
  );
}
