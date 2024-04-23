import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { User } from "@supabase/gotrue-js";
import Script from "next/script";
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
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-DYXVZ48YPQ"
      ></Script>
      <Script id="gtag">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DYXVZ48YPQ');
        `}
      </Script>

      <Script id="tiktok">
        {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject = t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++
              )ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('COJN7R3C77UAA32C5DVG');
              ttq.page();
            }(window, document, 'ttq');
          `}
      </Script>
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
    </>
  );
}
