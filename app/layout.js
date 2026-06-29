import "./globals.css";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/hooks/use-toast";
import { ThemeProvider } from "@/components/layout/theme-provider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata = {
  title: "Akimat Staff Portal",
  description: "Внутренний портал сотрудников акимата города Щучинска"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
