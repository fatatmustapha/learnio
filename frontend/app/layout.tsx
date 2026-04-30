import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FDF8F3] text-[#2F3E34]">

        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main>{children}</main>

        {/* FOOTER */}
        <Footer />

      </body>
    </html>
  );
}