import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "My Dashboard - IIT Madras BS Online Degree Programme",
  description: "Student Dashboard - IIT Madras BS Degree in Data Science and Applications",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  manifest: "/manifest.json",
  themeColor: "#aa3535",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IIT Madras",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body
        className="font-[family-name:var(--font-open-sans)]"
        style={{ margin: 0, background: "#f5f5f5", minHeight: "100vh" }}
      >
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
