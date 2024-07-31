import type { Metadata } from "next";
import { Inter, Rammetto_One } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" }); // Configurando a fonte Rammetto One

export const metadata: Metadata = {
  title: "IBUC QUIZ",
  description: "Aprendendo a Bíblia Sagrada através de perguntas e respostas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
