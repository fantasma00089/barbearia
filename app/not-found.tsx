import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { NotFoundView } from "@/components/shared/not-found-view";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <NotFoundView />
      </main>
      <Footer />
    </>
  );
}
