import type { Metadata } from "next";
import { Poppins, Roboto_Condensed } from "next/font/google";
import "./globals.css";

const FontPoppins = Poppins({
  variable: "--poppins",
  weight: ["600", "800"],
  subsets: ["latin"],
});

const FontRoboto_Condensed = Roboto_Condensed({
  variable: "--roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IoT-Pot",
  description: "IoT-Pot Monitoring App",
  icons: [
    { rel: "icon", url: "/favicon-32x32.png" },
    { rel: "apple-touch-icon", url: "/apple-icon.png" },
  ],
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${FontPoppins.variable} ${FontRoboto_Condensed.variable}`}
      >
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
