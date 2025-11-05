import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "Hubung.In",
  description: "Marketplace Jasa Freelance Terdepan di Indonesia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>
            {/* INI BAGIAN PENTING YANG SEBELUMNYA HILANG */}
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}