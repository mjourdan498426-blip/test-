import Image from "next/image";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import portrait from "@/public/jourdan-marc.jpg";

const CONTACT_EMAIL = "jourdanmarc@aol.com";

const services = [
  {
    title: "Audit IA",
    description:
      "Cartographie de vos processus et identification des cas d'usage IA à plus fort impact. Vous repartez avec une feuille de route claire, chiffrée et priorisée.",
    icon: (
      <path
        d="M11 4a7 7 0 1 0 4.95 11.95L20 20m-4-9a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Automatisation",
    description:
      "Intégration de solutions IA sur mesure — assistants, traitement documentaire, workflows — pour libérer vos équipes des tâches répétitives et gagner en productivité.",
    icon: (
      <path
        d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2 2m-9 9-2 2m13 0-2-2m-9-9-2-2M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Formation",
    description:
      "Montée en compétences de vos collaborateurs sur les outils IA du quotidien. Des sessions concrètes, adaptées à votre métier, pour une adoption durable et sereine.",
    icon: (
      <path
        d="M12 4 3 9l9 5 9-5-9-5Zm0 5v11m6-8v4.2a2 2 0 0 1-1.1 1.8L12 20l-4.9-2A2 2 0 0 1 6 16.2V12"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Audit",
    description:
      "On analyse ensemble votre existant, vos objectifs et vos contraintes pour cibler les opportunités IA réellement rentables.",
  },
  {
    number: "02",
    title: "Solution",
    description:
      "Je conçois et déploie une solution pragmatique, intégrée à vos outils, mesurable dès les premières semaines.",
  },
  {
    number: "03",
    title: "Accompagnement dans la durée",
    description:
      "Formation, suivi et optimisation continue : je reste à vos côtés pour que l'IA crée de la valeur sur le long terme.",
  },
];

export default function Home() {
  return (
    <>
      <div className="bg-aurora" aria-hidden />
      <div className="bg-grid" aria-hidden />
      <Nav />

      <main id="top">
        {/* Hero */}
        <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-28 pb-20 text-center">
          <Parallax
            speed={0.2}
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          >
            <div className="h-[38rem] w-[38rem] rounded-full bg-gradient-to-tr from-accent-1/20 via-accent-2/10 to-accent-3/20 blur-3xl" />
          </Parallax>

          <Reveal>
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-3 shadow-[0_0_8px] shadow-accent-3" />
              Consultant IA indépendant · PME
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Jourdan Marc
              <span className="mt-2 block text-gradient">Consultant IA</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              L&apos;intelligence artificielle sans le jargon. J&apos;aide les
              dirigeants de PME à transformer l&apos;IA en{" "}
              <span className="text-foreground">avantage concurrentiel</span> —
              des gains de productivité concrets, mesurables, dès les premières
              semaines.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="#contact"
                className="btn-glow rounded-2xl bg-gradient-to-r from-accent-1 to-accent-2 px-7 py-3.5 text-base font-semibold text-white"
              >
                Prendre rendez-vous
              </a>
              <a
                href="#services"
                className="rounded-2xl border border-white/10 px-7 py-3.5 text-base font-medium text-foreground transition-colors hover:border-white/25 hover:bg-white/5"
              >
                Découvrir mes services
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted">
              <span>Audit sur mesure</span>
              <span className="hidden h-4 w-px bg-white/15 sm:block" />
              <span>Solutions pragmatiques</span>
              <span className="hidden h-4 w-px bg-white/15 sm:block" />
              <span>Accompagnement humain</span>
            </div>
          </Reveal>
        </section>

        {/* Services */}
        <section id="services" className="mx-auto max-w-6xl px-6 py-24 scroll-mt-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-2">
              Services
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Trois leviers pour passer à l&apos;IA
            </h2>
            <p className="mt-4 text-muted">
              Un accompagnement complet, du diagnostic à l&apos;adoption, pensé
              pour la réalité des PME.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 100} as="article">
                <div className="glass card-hover group h-full rounded-3xl p-7">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-1/20 to-accent-2/20 text-accent-2 ring-1 ring-white/10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-6 w-6"
                      aria-hidden
                    >
                      {service.icon}
                    </svg>
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-xl font-semibold">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Méthode */}
        <section id="methode" className="mx-auto max-w-6xl px-6 py-24 scroll-mt-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-2">
              Méthode
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Une démarche claire, en trois temps
            </h2>
            <p className="mt-4 text-muted">
              Pas de projet interminable ni de promesses floues : une
              progression structurée, du diagnostic aux résultats durables.
            </p>
          </Reveal>

          <div className="relative mt-16">
            <div
              className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block"
              aria-hidden
            />
            <ol className="grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <Reveal key={step.number} delay={i * 120} as="li">
                  <div className="relative">
                    <div className="glass mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl text-lg font-bold text-gradient font-[family-name:var(--font-display)]">
                      {step.number}
                    </div>
                    <h3 className="mt-6 text-center font-[family-name:var(--font-display)] text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-center text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* À propos */}
        <section id="a-propos" className="mx-auto max-w-6xl px-6 py-24 scroll-mt-20">
          <div className="glass overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16">
            <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal className="order-1 lg:order-none">
                <div className="group relative mx-auto max-w-sm">
                  <div
                    className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent-1/30 via-accent-2/20 to-accent-3/30 opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <div className="overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-black/40">
                    <Image
                      src={portrait}
                      alt="Portrait de Jourdan Marc, consultant IA pour PME"
                      placeholder="blur"
                      priority={false}
                      sizes="(max-width: 1024px) 24rem, 24rem"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120} className="order-2 lg:order-none">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-2">
                  À propos
                </p>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                  Un partenaire, pas un prestataire
                </h2>
                <div className="mt-6 space-y-4 text-muted leading-relaxed">
                  <p>
                    Je suis Jourdan Marc, consultant en intelligence
                    artificielle indépendant. J&apos;accompagne les PME qui
                    veulent tirer parti de l&apos;IA sans se perdre dans la
                    complexité technique ni les effets de mode.
                  </p>
                  <p>
                    Mon approche est simple : comprendre votre métier avant de
                    parler technologie, puis livrer des solutions concrètes qui
                    servent vos objectifs. Pas de dette technique inutile, pas
                    de dépendance : des résultats que vos équipes
                    s&apos;approprient.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { k: "100%", v: "Sur mesure" },
                    { k: "PME", v: "Ma spécialité" },
                    { k: "Concret", v: "Pas de jargon" },
                    { k: "Durable", v: "Suivi continu" },
                  ].map((stat) => (
                    <div
                      key={stat.v}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <div className="text-gradient font-[family-name:var(--font-display)] text-xl font-bold">
                        {stat.k}
                      </div>
                      <div className="mt-1 text-xs text-muted">{stat.v}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-6 py-24 scroll-mt-20">
          <Reveal>
            <div className="glass relative overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-12">
              <div
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-accent-1/15 via-transparent to-accent-3/15"
                aria-hidden
              />
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-5xl">
                Parlons de votre projet
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-muted">
                Un premier échange gratuit pour identifier vos opportunités IA.
                Sans engagement, sans jargon — juste des pistes concrètes.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Projet%20IA%20pour%20ma%20PME`}
                  className="btn-glow rounded-2xl bg-gradient-to-r from-accent-1 to-accent-2 px-8 py-4 text-base font-semibold text-white"
                >
                  Prendre rendez-vous
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-base font-medium text-muted transition-colors hover:text-foreground"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="border-t border-white/5 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted sm:flex-row">
            <p>
              © {new Date().getFullYear()} Jourdan Marc — Consultant IA pour PME
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="transition-colors hover:text-foreground"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
