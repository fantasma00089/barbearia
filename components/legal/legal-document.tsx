import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { formatDateStr } from "@/lib/time";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function LegalDocument({
  title,
  intro,
  sections,
  lastUpdated,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  lastUpdated: string;
}) {
  const updated = formatDateStr(lastUpdated, { day: "numeric", month: "long", year: "numeric" });
  return (
    <>
      <PageHeader eyebrow="Documento legal" title={title} description={intro}>
        <p className="mt-5 text-sm text-muted-foreground">
          Última atualização: <time dateTime={lastUpdated}>{updated}</time>
        </p>
      </PageHeader>
      <div className="container grid gap-10 py-10 md:py-14 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Seções do documento" className="hidden lg:block">
          <ol className="sticky top-28 space-y-2 border-l pl-4 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted-foreground transition-colors hover:text-primary">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="prose prose-neutral max-w-3xl dark:prose-invert prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide prose-h2:text-2xl prose-a:text-primary prose-li:marker:text-primary">
          <p className="not-prose mb-8 flex gap-3 rounded-lg border border-dashed border-primary/40 p-4 text-sm text-muted-foreground">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span>
              Modelo de documento para demonstração. Antes de publicar, revise com um profissional jurídico e substitua os
              dados marcados como fictícios (razão social, CNPJ, e-mails e endereço).
            </span>
          </p>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2>
                {i + 1}. {s.title}
              </h2>
              {s.content}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
