import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { User } from "@supabase/gotrue-js";
const inter = Inter({ subsets: ["latin"] });
import Provider from "@/app/theme";
import { Header } from "@/components/header/Header";
import { getUser } from "@/server/supabase";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Chures",
  description: "Din Plattform för Flexibla Jobb",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user: User | null = await getUser();
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body className={inter.className}>
        <Provider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster></Toaster>
          <div className="leading-default">
            <Header user={user}></Header>
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
