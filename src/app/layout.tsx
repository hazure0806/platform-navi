// src/app/layout.tsx
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-500 flex flex-col items-center px-4 py-12">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
