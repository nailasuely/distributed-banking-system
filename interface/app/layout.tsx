import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
})

export const metadata: Metadata = {
  title: "Horizon",
  description: "Horizon is a modern banking platform for everyone.",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = {firstName: "Naila", lastName: "JSM"};

  if(!loggedIn) redirect('/sign-in');

  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        <main className="flex h-screen w-full font-inter">
          <Sidebar user={loggedIn} />
          <div className="flex flex-grow flex-col">
            <div className="root-layout">
              <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
              <MobileNav user={loggedIn} />
            </div>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
