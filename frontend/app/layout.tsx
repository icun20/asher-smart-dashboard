import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DeviceProvider } from "@/components/DeviceContext";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Asher EcoDash Dashboard",
  description:
    "Real-time ESG, US EPA OSWI HSE compliance, IPCC carbon accounting, and AI Waste Vision platform for The ASHER.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Asher EcoDash",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/asher-icon.svg", type: "image/svg+xml" },
      { url: "/api/pwa-icon?size=192", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/asher-icon.svg",
    apple: "/api/pwa-icon?size=180",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${poppins.variable} font-sans h-screen flex overflow-hidden bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <DeviceProvider>
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden bg-background">
              <Header />
              <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-10">
                <div className="mx-auto max-w-7xl">{children}</div>
              </main>
            </div>
          </DeviceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
