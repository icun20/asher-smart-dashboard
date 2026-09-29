import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DeviceProvider } from "@/components/DeviceContext";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const poppins = Poppins({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "The ASHER Dashboard",
  description: "The world's most practical & effective waste management solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${poppins.variable} font-sans h-screen flex overflow-hidden bg-background text-foreground`}>
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
              <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                <div className="mx-auto max-w-7xl">
                  {children}
                </div>
              </main>
            </div>
          </DeviceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
