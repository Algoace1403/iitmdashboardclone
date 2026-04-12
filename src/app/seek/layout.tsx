import { Roboto } from "next/font/google";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function SeekLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${roboto.variable} font-[family-name:var(--font-roboto)] min-h-screen bg-[#fafafa]`}>
      {children}
    </div>
  );
}
