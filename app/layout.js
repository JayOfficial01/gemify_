"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import UpdateCartProvider from "./_context/UpdateCartContext";

const outfit = Outfit({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  const params = usePathname();

  const isShowHeader =
    params == "/sign-in" || params == "/create-account" ? false : true;

  return (
    <html lang="en">
      <body className={outfit.className}>
        <UpdateCartProvider>
          {isShowHeader && <Header />}
          {children}
          <Toaster />
          {isShowHeader && <Footer />}
        </UpdateCartProvider>
      </body>
    </html>
  );
}
