import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="conteudo" tabIndex={-1} className="min-h-[60vh] outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
