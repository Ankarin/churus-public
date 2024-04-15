import ContentLayout from "@/app/contentLayout";
import LandingActions from "@/components/landing/LandingActions";
import InfoSection from "@/components/landing/InfoSection";
import { Phone, Mail, Linkedin } from "lucide-react";
import { Fragment } from "react";
export default function Home() {
  const sections = [
    {
      title: "För Företag",
      points: [
        "Hitta kompetenta och pålitliga arbetskrafter för kort eller långsiktiga uppdrag.",
        "Annonsera dina lediga tjänster och få snabbt tillgång till en pool av motiverade arbetstagare.",
        "Effektivisera din rekryteringsprocess och spara tid och resurser.",
      ],
    },
    {
      title: "För Arbetstagare",
      points: [
        "Utforska ett brett utbud av jobbmöjligheter som passar din tid och expertis.",
        "Ansök tillgängliga uppdrag med bara några klick och börja arbeta när det passar dig.",
        "Få betalt för det arbete du utför direkt och njut av flexibiliteten att skapa din egen arbetsplan.",
      ],
    },
  ];
  return (
    <ContentLayout>
      <div className="pt-24 text-center">
        {/*<h2 className="inline-flex mb-2 text-3xl font-semibold bg-muted  px-3 py-1 rounded-lg tracking-tight ">*/}
        {/*  Chures*/}
        {/*</h2>*/}
        {/*<h2 className="pb-6 text-3xl font-semibold   px-3 py-1 ">Chures</h2>*/}
        <h1 className="text-xl  pb-6 font-extrabold text-blue-600 lg:text-5xl">
          Din Plattform för Flexibla Jobb!
        </h1>
        <span className="text-center text-lg text-muted-foreground sm:text-xl">
          Chures är ledande inom gig-ekonomin och erbjuder en innovativ
          plattform för företag att rekrytera för allt från en dags arbete till
          längre uppdrag.
        </span>
        <LandingActions></LandingActions>
        <div className="pt-24 grid md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <InfoSection
              key={index}
              title={section.title}
              points={section.points}
            />
          ))}
        </div>
        <p className="text-left   pt-24 text-lg text-muted-foreground sm:text-xl">
          Vi gör det enkelt för både företag och arbetstagare att hitta varandra
          och skapa meningsfulla arbetsrelationer. Oavsett om du är en
          företagsledare som letar efter flexibel arbetskraft eller en individ
          som vill ta kontroll över din arbetslivsbalans, så är Chures platsen
          för dig. Anslut dig idag och upplev fördelarna med en smidig och
          effektiv gig-ekonomi!
        </p>

        <footer className="pt-16">
          <div className="flex justify-between  flex-col md:flex-row gap-6">
            <a
              href="https://www.linkedin.com/company/chures/"
              className="cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin />
            </a>
            <a href="tel:+46702908568" className="ml-2 flex gap-3">
              <Phone />
              <span>+46 70 290 8568</span>
            </a>
            <a href="mailto:eliasholm@chures.net" className="ml-2 flex gap-3">
              <Mail />
              <span>eliasholm@chures.net</span>
            </a>
          </div>
        </footer>
      </div>
    </ContentLayout>
  );
}

// Chures
// Din Plattform för Flexibla Jobb!
//
// Letar ditt företag efter flexibla arbetskrafter för kort- eller långsiktig anställning? Är du en individ som söker möjligheter att arbeta när och var det passar dig?
//
//     Chures är ledande inom gig-ekonomin och erbjuder en innovativ plattform för företag att rekrytera för allt från en dags arbete till längre uppdrag. Vi gör det enkelt för både företag och arbetstagare att hitta varandra och skapa meningsfulla arbetsrelationer.
//
//     För Företag:
//     - Hitta kompetenta och pålitliga arbetskrafter för kort- eller långsiktiga uppdrag.
// - Annonsera dina lediga tjänster och få snabbt tillgång till en pool av motiverade arbetstagare.
// - Effektivisera din rekryteringsprocess och spara tid och resurser.
//
//     För Arbetstagare:
//     - Utforska ett brett utbud av jobbmöjligheter som passar din tid och expertis.
// - Ansök tillgängliga uppdrag med bara några klick och börja arbeta när det passar dig.
// - Få betalt för det arbete du utför direkt och njut av flexibiliteten att skapa din egen arbetsplan.
//
//     Oavsett om du är en företagsledare som letar efter flexibel arbetskraft eller en individ som vill ta kontroll över din arbetslivsbalans, så är Chures platsen för dig. Anslut dig idag och upplev fördelarna med en smidig och effektiv gig-ekonomi!
//
