import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

(async () => {
  console.log("Adding ES/IT columns...");

  // Add columns (IF NOT EXISTS via catching errors)
  const columns = [
    "ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS bio_es text",
    "ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS bio_it text",
    "ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS title_es text",
    "ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS title_it text",
    "ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS specialties_es text[]",
    "ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS specialties_it text[]",
    "ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS conditions_es text[]",
    "ALTER TABLE practitioners ADD COLUMN IF NOT EXISTS conditions_it text[]",
  ];

  for (const ddl of columns) {
    await sql.query(ddl);
  }
  console.log("Columns added.\n");

  // Populate with translations for all practitioners
  const practitioners = await sql`SELECT slug, title_fr, title_en, bio_fr, bio_en, specialties_fr, specialties_en, conditions_fr, conditions_en FROM practitioners ORDER BY display_order`;

  for (const p of practitioners) {
    console.log(`Translating: ${p.slug}`);

    // Title translations
    const titles: Record<string, { es: string; it: string }> = {
      "karen-aguiar": { es: "Fisioterapeuta", it: "Fisioterapista" },
      "elio-bosani": { es: "Osteópata", it: "Osteopata" },
      "corinne-dauve": { es: "Psiquiatra", it: "Psichiatra" },
      "isaline-henry": { es: "Fisioterapeuta", it: "Fisioterapista" },
      "beatrice-milbert": { es: "Homeópata", it: "Omeopata" },
      "shima-sazegari": { es: "Farmacéutica — Consultora en medicina integrativa", it: "Farmacista — Consulente in medicina integrativa" },
      "severine-schwab": { es: "Fasciaterapeuta", it: "Fasciaterapista" },
      "fiorenza-toffolon": { es: "Instructora de Pilates", it: "Istruttrice di Pilates" },
    };

    const t = titles[p.slug as string];
    if (!t) continue;

    await sql`UPDATE practitioners SET title_es = ${t.es}, title_it = ${t.it} WHERE slug = ${p.slug}`;
  }

  console.log("\nTitles done. Now translating bios, specialties, conditions...\n");

  // Karen Aguiar
  await sql`UPDATE practitioners SET
    bio_es = ${[
      "Karen Aguiar es fisioterapeuta formada en Brasil y ejerce en Ginebra desde 2017. Su objetivo es acompañar a sus pacientes hacia una mejor salud física y un bienestar óptimo.",
      "Especializada en prevención, tratamiento y reeducación perineal y postural, el Método Pilates y el drenaje linfático, ofrece cuidados personalizados y adaptados a las necesidades específicas de cada paciente.",
      "Ya sea en fase de recuperación tras una lesión, en tratamiento por dolor crónico o simplemente buscando una mejor movilidad, Karen le guía durante todo su proceso de rehabilitación. Su enfoque combina experiencia, escucha y respeto por sus objetivos.",
    ].join("\n\n")},
    bio_it = ${[
      "Karen Aguiar è fisioterapista formata in Brasile e attiva a Ginevra dal 2017. Il suo obiettivo è accompagnare i pazienti verso una migliore salute fisica e un benessere ottimale.",
      "Specializzata in prevenzione, trattamento e rieducazione perineale e posturale, Metodo Pilates e drenaggio linfatico, offre cure personalizzate e adattate alle esigenze specifiche di ogni paziente.",
      "Che siate in fase di recupero dopo un infortunio, in trattamento per un dolore cronico o semplicemente alla ricerca di una migliore mobilità, Karen vi guida durante tutto il percorso di riabilitazione. Il suo approccio combina competenza, ascolto e rispetto dei vostri obiettivi.",
    ].join("\n\n")},
    specialties_es = ${["Fisioterapia", "Reeducación perineal y postural", "Método Pilates", "Drenaje linfático"]},
    specialties_it = ${["Fisioterapia", "Rieducazione perineale e posturale", "Metodo Pilates", "Drenaggio linfatico"]},
    conditions_es = ${["Dolor crónico", "Recuperación post-lesión", "Trastornos posturales", "Trastornos perineales"]},
    conditions_it = ${["Dolore cronico", "Recupero post-infortunio", "Disturbi posturali", "Disturbi perineali"]}
  WHERE slug = 'karen-aguiar'`;

  // Elio Bosani — his bio is long, translate the key parts
  const elioBioFr = (await sql`SELECT bio_fr FROM practitioners WHERE slug = 'elio-bosani'`)[0].bio_fr as string;

  await sql`UPDATE practitioners SET
    bio_es = ${[
      "Nací en Argentina, donde realicé toda mi escolaridad y obtuve un diploma profesional como profesor de Educación Física. Desde muy temprano me interesé por el funcionamiento del cuerpo humano, el movimiento y los mecanismos de la salud.",
      "En 1982, vine a Europa y me instalé en Roma. Allí emprendí una formación de fisioterapeuta en la Universidad La Sapienza de Roma, al mismo tiempo que iniciaba mis estudios de osteopatía en una escuela francesa, la École Ostéopathique de Provence (EOP). Obtuve mi diploma de osteópata en 1996.",
      "Desde entonces, ejerzo esta profesión en Ginebra, donde he adquirido una experiencia clínica profunda en contacto con pacientes de todas las edades y situaciones variadas. Esta práctica continua de casi tres décadas constituye hoy una sólida base de experiencia clínica al servicio de los pacientes.",
      "Como osteópata, mis tratamientos se dirigen al conjunto de manifestaciones funcionales que pueden afectar al cuerpo humano, ya sean del ámbito esquelético, musculoesquelético, dolores crónicos o diferentes trastornos funcionales. La osteopatía busca acompañar a la persona en el restablecimiento de su equilibrio funcional, teniendo en cuenta su historia, su modo de vida y sus capacidades de adaptación.",
      "Este enfoque terapéutico se dirige a todas las etapas de la vida, desde el nacimiento hasta la tercera edad, con modalidades de intervención adaptadas a cada edad y situación. Mi práctica se basa en un enfoque clínico riguroso, atento y respetuoso, privilegiando la escucha del paciente, el análisis funcional y la adaptación individualizada del tratamiento.",
      "En el marco de mi práctica, trabajo en colaboración con el conjunto del cuerpo médico cuando la situación lo requiere o supera mi ámbito de competencia. Esta colaboración se inscribe en un enfoque de responsabilidad profesional y seguridad para el paciente, particularmente en relación con los médicos tratantes y, cuando está indicado, con los Hospitales Universitarios de Ginebra (HUG).",
      "En el seno del Centro de Medicinas Integrativas de Eaux-Vives (CMIEV), me inscribo en una dinámica de colaboración interdisciplinaria orientada a ofrecer una atención global, coherente y responsable de los pacientes.",
      "## Origen y concepto de la osteopatía",
      "La osteopatía nace en 1874, cuando Andrew Taylor Still (1828-1917), médico cirujano estadounidense, desarrolla y formula los principios fundamentales de esta disciplina tras largos años de estudio de la anatomía humana y de práctica clínica basada en técnicas manuales. Su enfoque innovador se basa en una comprensión global del cuerpo, en la relación entre estructura y función, así como en la capacidad de autorregulación del organismo.",
      "En 1892, funda la primera escuela de osteopatía, The American School of Osteopathy, en Kirksville, Missouri, marcando así el inicio de la enseñanza formal de esta medicina manual. Posteriormente, sus discípulos, en particular William Garner Sutherland y Harold Magoun, amplían el campo de la osteopatía al desarrollo de la osteopatía craneal, enriqueciendo y profundizando su marco conceptual y terapéutico.",
    ].join("\n\n")},
    bio_it = ${[
      "Sono nato in Argentina, dove ho completato tutta la mia scolarità e ottenuto un diploma professionale come professore di Educazione Fisica. Fin da giovane mi sono interessato al funzionamento del corpo umano, al movimento e ai meccanismi della salute.",
      "Nel 1982 sono venuto in Europa e mi sono stabilito a Roma. Ho intrapreso una formazione da fisioterapista presso l'Università La Sapienza di Roma, iniziando parallelamente gli studi di osteopatia presso una scuola francese, l'École Ostéopathique de Provence (EOP). Ho ottenuto il diploma di osteopata nel 1996.",
      "Da allora esercito questa professione a Ginevra, dove ho acquisito un'approfondita esperienza clinica a contatto con pazienti di tutte le età e in situazioni diverse. Questa pratica continua di quasi tre decenni costituisce oggi una solida base di esperienza clinica al servizio dei pazienti.",
      "Come osteopata, i miei trattamenti si rivolgono all'insieme delle manifestazioni funzionali che possono colpire il corpo umano, che riguardino la sfera scheletrica, muscoloscheletrica, i dolori cronici o diversi disturbi funzionali. L'osteopatia mira ad accompagnare la persona nel ristabilimento del suo equilibrio funzionale, tenendo conto della sua storia, del suo stile di vita e delle sue capacità di adattamento.",
      "Questo approccio terapeutico si rivolge a tutte le fasi della vita, dalla nascita alla terza età, con modalità di intervento adattate a ogni età e situazione. La mia pratica si basa su un approccio clinico rigoroso, attento e rispettoso, privilegiando l'ascolto del paziente, l'analisi funzionale e l'adattamento individualizzato del trattamento.",
      "Nell'ambito della mia pratica, lavoro in collaborazione con l'insieme del corpo medico quando la situazione lo richiede o supera il mio campo di competenza. Questa collaborazione si inscrive in un approccio di responsabilità professionale e sicurezza per il paziente, in particolare in collegamento con i medici curanti e, quando indicato, con gli Ospedali Universitari di Ginevra (HUG).",
      "All'interno del Centro di Medicine Integrative des Eaux-Vives (CMIEV), mi inserisco in una dinamica di collaborazione interdisciplinare volta a offrire una presa in carico globale, coerente e responsabile dei pazienti.",
      "## Origine e concetto dell'osteopatia",
      "L'osteopatia nasce nel 1874, quando Andrew Taylor Still (1828-1917), medico chirurgo americano, sviluppa e formula i principi fondamentali di questa disciplina dopo lunghi anni di studio dell'anatomia umana e di pratica clinica basata su tecniche manuali. Il suo approccio innovativo si basa su una comprensione globale del corpo, sulla relazione tra struttura e funzione, nonché sulla capacità di autoregolazione dell'organismo.",
      "Nel 1892 fonda la prima scuola di osteopatia, The American School of Osteopathy, a Kirksville, nel Missouri, segnando così l'inizio dell'insegnamento formale di questa medicina manuale. In seguito, i suoi discepoli, in particolare William Garner Sutherland e Harold Magoun, ampliano il campo dell'osteopatia allo sviluppo dell'osteopatia cranica, arricchendo e approfondendo il suo quadro concettuale e terapeutico.",
    ].join("\n\n")},
    specialties_es = ${["Osteopatía"]},
    specialties_it = ${["Osteopatia"]},
    conditions_es = ${["Dolores de espalda, cuello y articulaciones", "Tensiones musculares, trastornos posturales y limitaciones de movilidad", "Cefaleas, vértigos y trastornos relacionados con el estrés", "Trastornos digestivos funcionales", "Molestias respiratorias funcionales", "Molestias relacionadas con el embarazo o la menopausia", "Trastornos funcionales del lactante y del niño", "Rigidez y dolores relacionados con el envejecimiento"]},
    conditions_it = ${["Dolori alla schiena, al collo e alle articolazioni", "Tensioni muscolari, disturbi posturali e limitazioni della mobilità", "Cefalee, vertigini e disturbi legati allo stress", "Disturbi digestivi funzionali", "Fastidi respiratori funzionali", "Fastidi legati alla gravidanza o alla menopausa", "Disturbi funzionali del neonato e del bambino", "Rigidità e dolori legati all'invecchiamento"]}
  WHERE slug = 'elio-bosani'`;

  // Corinne Dauve
  await sql`UPDATE practitioners SET
    bio_es = ${[
      "Antigua jefa de clínica de los Hospitales Universitarios de Ginebra en la Unidad de Psiquiatría del Desarrollo Mental, la Doctora Corinne Dauve está especializada en la atención de pacientes con deficiencia de las facultades intelectuales.",
      "Muy interesada además por el campo de la psiquiatría metabólica, la Doctora Corinne Dauve propone un acompañamiento de los trastornos ansiosos, depresivos y trastornos de adaptación mediante un enfoque nutricional global.",
    ].join("\n\n")},
    bio_it = ${[
      "Ex capo clinica degli Ospedali Universitari di Ginevra nell'Unità di Psichiatria dello Sviluppo Mentale, la Dottoressa Corinne Dauve è specializzata nella presa in carico dei pazienti con deficit delle facoltà intellettive.",
      "Molto interessata anche al campo della psichiatria metabolica, la Dottoressa Corinne Dauve propone un accompagnamento dei disturbi ansiosi, depressivi e dei disturbi dell'adattamento attraverso un approccio nutrizionale globale.",
    ].join("\n\n")},
    specialties_es = ${["Psiquiatría", "Psiquiatría metabólica", "Enfoque nutricional"]},
    specialties_it = ${["Psichiatria", "Psichiatria metabolica", "Approccio nutrizionale"]},
    conditions_es = ${["Trastornos ansiosos", "Trastornos depresivos", "Trastornos de adaptación", "Discapacidad intelectual"]},
    conditions_it = ${["Disturbi ansiosi", "Disturbi depressivi", "Disturbi dell'adattamento", "Disabilità intellettiva"]}
  WHERE slug = 'corinne-dauve'`;

  // Isaline Henry
  await sql`UPDATE practitioners SET
    bio_es = ${[
      "Isaline Henry trabaja como fisioterapeuta desde 2014. Acompaña a personas afectadas por lesiones traumáticas (esguince, fractura) pero también por dolores crónicos (lumbalgia, cervicalgia, capsulitis, artrosis de cadera y rodilla).",
      "Atiende a personas mayores afectadas por problemas de equilibrio y descondicionamiento muscular (posibilidad de tratamiento a domicilio) así como a cualquier persona con dolores relacionados con la postura (escoliosis, cifosis excesiva, desajuste muscular, dolores crónicos) con el concepto de ajuste de cadenas musculares y articulares GDS.",
      "Enseña Pilates en pequeños grupos e imparte el programa GLAD.",
    ].join("\n\n")},
    bio_it = ${[
      "Isaline Henry lavora come fisioterapista dal 2014. Accompagna le persone con lesioni traumatiche (distorsione, frattura) ma anche con dolori cronici (lombalgia, cervicalgia, capsulite, artrosi dell'anca e del ginocchio).",
      "Si occupa di persone anziane con problemi di equilibrio e decondizionamento muscolare (possibilità di trattamento a domicilio) così come di qualsiasi persona con dolori legati alla postura (scoliosi, cifosi eccessiva, squilibrio muscolare, dolori cronici) con il concetto di accordatura delle catene muscolari e articolari GDS.",
      "Insegna Pilates in piccoli gruppi e tiene il programma GLAD.",
    ].join("\n\n")},
    specialties_es = ${["Fisioterapia", "Pilates en grupo", "Programa GLAD", "Cadenas musculares GDS"]},
    specialties_it = ${["Fisioterapia", "Pilates in gruppo", "Programma GLAD", "Catene muscolari GDS"]},
    conditions_es = ${["Lesiones traumáticas", "Dolores crónicos", "Problemas de equilibrio", "Trastornos posturales", "Artrosis"]},
    conditions_it = ${["Lesioni traumatiche", "Dolori cronici", "Problemi di equilibrio", "Disturbi posturali", "Artrosi"]}
  WHERE slug = 'isaline-henry'`;

  // Béatrice Milbert
  await sql`UPDATE practitioners SET
    bio_es = ${[
      "Diplomada en homeopatía del Instituto Homeopático Científico, Béatrice Milbert es profesora en el IHS y en la Academia Libre de Medicina Integrativa de Ginebra (Acalmi.ch).",
      "Realiza investigaciones en homeopatía y medicina integrativa.",
    ].join("\n\n")},
    bio_it = ${[
      "Diplomata in omeopatia presso l'Istituto Omeopatico Scientifico, Béatrice Milbert è insegnante all'IHS e all'Accademia Libera di Medicina Integrativa di Ginevra (Acalmi.ch).",
      "Conduce ricerche in omeopatia e medicina integrativa.",
    ].join("\n\n")},
    specialties_es = ${["Homeopatía", "Medicina integrativa", "Investigación en homeopatía"]},
    specialties_it = ${["Omeopatia", "Medicina integrativa", "Ricerca in omeopatia"]},
    conditions_es = ${["Trastornos crónicos", "Trastornos funcionales", "Enfermedades inflamatorias"]},
    conditions_it = ${["Disturbi cronici", "Disturbi funzionali", "Malattie infiammatorie"]}
  WHERE slug = 'beatrice-milbert'`;

  // Shima Sazegari
  const shimaBioFr = (await sql`SELECT bio_fr FROM practitioners WHERE slug = 'shima-sazegari'`)[0].bio_fr as string;

  await sql`UPDATE practitioners SET
    bio_es = ${[
      "Acreditada ASCA & RME",
      "Diplomada de la facultad de farmacia de la Universidad de Ginebra, Shima Sazegari trabaja como farmacéutica y consultora en medicina integrativa desde hace más de 30 años en Ginebra. Durante todos estos años, se ha comprometido activamente con el desarrollo y el reconocimiento de la medicina integrativa en Suiza y en Europa.",
      "Sus áreas de experiencia se apoyan en una sólida práctica clínica y una formación continua con expertos de renombre internacional, particularmente en medicina funcional, homeopatía unicista basada en el método de la sensación vital, micro-inmunoterapia según el enfoque del Instituto Francés de Micro-Inmunoterapia (IFMi), fitoterapia en su aplicación farmacéutica ampliada, en particular los elixires de orquídea LTOE, así como en Terapia Energética en Kinesiología (TEK).",
      "Con esta amplia experiencia, hoy propone en su consultorio terapéutico soluciones personalizadas y adaptadas a cada paciente. Paralelamente a su actividad clínica, ejerce como profesora y formadora, anima talleres y seminarios en medicina integrativa, desarrolla programas de formación y acompaña a los profesionales de la salud en la integración de enfoques naturales en su práctica.",
      "Para más información: www.swiss-altermed.ch | www.acalmi.ch",
    ].join("\n\n")},
    bio_it = ${[
      "Accreditata ASCA & RME",
      "Diplomata presso la facoltà di farmacia dell'Università di Ginevra, Shima Sazegari lavora come farmacista e consulente in medicina integrativa da oltre 30 anni a Ginevra. Durante tutti questi anni, si è impegnata attivamente nello sviluppo e nel riconoscimento della medicina integrativa in Svizzera e in Europa.",
      "Le sue aree di competenza si basano su una solida pratica clinica e una formazione continua presso esperti di fama internazionale, in particolare in medicina funzionale, omeopatia unicista basata sul metodo della sensazione vitale, micro-immunoterapia secondo l'approccio dell'Istituto Francese di Micro-Immunoterapia (IFMi), fitoterapia nella sua applicazione farmaceutica ampliata, in particolare gli elisir di orchidea LTOE, nonché in Terapia Energetica in Kinesiologia (TEK).",
      "Forte di questa vasta esperienza, oggi propone nel suo studio terapeutico soluzioni personalizzate e adattate a ogni paziente. Parallelamente alla sua attività clinica, esercita come insegnante e formatrice, anima workshop e seminari in medicina integrativa, sviluppa programmi di formazione e accompagna i professionisti della salute nell'integrazione degli approcci naturali nella loro pratica.",
      "Per maggiori informazioni: www.swiss-altermed.ch | www.acalmi.ch",
    ].join("\n\n")},
    specialties_es = ${["Homeopatía", "Medicina funcional", "Micro-inmunoterapia"]},
    specialties_it = ${["Omeopatia", "Medicina funzionale", "Micro-immunoterapia"]},
    conditions_es = ${["Desequilibrios funcionales", "Trastornos metabólicos", "Trastornos energéticos"]},
    conditions_it = ${["Squilibri funzionali", "Disturbi metabolici", "Disturbi energetici"]}
  WHERE slug = 'shima-sazegari'`;

  // Séverine Schwab
  const severineBioFr = (await sql`SELECT bio_fr FROM practitioners WHERE slug = 'severine-schwab'`)[0].bio_fr as string;
  const severineParagraphs = severineBioFr.split("\n\n");

  await sql`UPDATE practitioners SET
    bio_es = ${[
      "Cuando el cuerpo se vuelve doloroso o tenso, puede necesitar ser escuchado de otra manera para recuperar su capacidad natural de autorregulación y movimiento.",
      "Practico la fasciaterapia, un enfoque manual suave que se dirige a la persona en su globalidad.",
      "Le atiendo especialmente para:\n- dolores (espalda, cuello, hombros, articulaciones)\n- tensiones musculares o rigidez\n- estrés o fatiga\n- sensación de bloqueo o agotamiento",
      "La fasciaterapia se basa en un tacto lento, preciso y a la escucha, que permite liberar las tensiones y recuperar más movilidad y confort.",
      "Las fascias, tejidos que conectan todo el cuerpo, están en el centro de este trabajo. A través de ellas, acompaño una liberación y una puesta en movimiento mediante gestos suaves, precisos y profundos.",
      "Se presta especial atención al tono, es decir, a la manera en que el cuerpo se organiza y se adapta. Traduce la forma en que cada uno se ajusta a lo que vive. A través de mi tacto específico, el tono puede modularse, relajarse y reorganizarse, permitiendo un ajuste global.",
      "En un marco seguro y respetuoso, cada uno puede encontrar un apoyo más estable y una sensación de bienestar.",
      "Diplomada en fasciaterapia desde 2005, soy cofundadora de Fascia Formation Suisse, donde fui codirectora y donde intervengo hoy como consultora en fasciaterapia.",
    ].join("\n\n")},
    bio_it = ${[
      "Quando il corpo diventa doloroso o teso, può aver bisogno di essere ascoltato diversamente per ritrovare la sua capacità naturale di autoregolazione e movimento.",
      "Pratico la fasciaterapia, un approccio manuale dolce che si rivolge alla persona nella sua globalità.",
      "Vi accolgo in particolare per:\n- dolori (schiena, collo, spalle, articolazioni)\n- tensioni muscolari o rigidità\n- stress o affaticamento\n- sensazione di blocco o sovraccarico",
      "La fasciaterapia si basa su un tocco lento, preciso e all'ascolto, che permette di rilasciare le tensioni e ritrovare più mobilità e comfort.",
      "Le fasce, tessuti che collegano l'intero corpo, sono al centro di questo lavoro. Attraverso di esse, accompagno un rilascio e una rimessa in movimento con gesti dolci, precisi e profondi.",
      "Un'attenzione particolare è rivolta al tono, cioè al modo in cui il corpo si organizza e si adatta. Traduce il modo in cui ciascuno si adatta a ciò che vive. Attraverso il mio tocco specifico, il tono può modularsi, rilasciarsi e riorganizzarsi, permettendo un aggiustamento globale.",
      "In un contesto sicuro e rispettoso, ciascuno può ritrovare un appoggio più stabile e una sensazione di benessere.",
      "Diplomata in fasciaterapia dal 2005, sono cofondatrice di Fascia Formation Suisse, dove sono stata codirettrice e dove intervengo oggi come consulente in fasciaterapia.",
    ].join("\n\n")},
    specialties_es = ${["Fasciaterapia"]},
    specialties_it = ${["Fasciaterapia"]},
    conditions_es = ${["Tensiones fasciales", "Dolores musculares", "Trastornos funcionales"]},
    conditions_it = ${["Tensioni fasciali", "Dolori muscolari", "Disturbi funzionali"]}
  WHERE slug = 'severine-schwab'`;

  // Fiorenza Toffolon
  const fiorenzaBioFr = (await sql`SELECT bio_fr FROM practitioners WHERE slug = 'fiorenza-toffolon'`)[0].bio_fr as string;

  await sql`UPDATE practitioners SET
    bio_es = ${[
      "Certificada desde 2017, Fiorenza descubrió el Pilates en Singapur tras una lesión de espalda. Este método le permitió recuperar un cuerpo fuerte, equilibrado y sin dolor, y desde entonces está en el centro de su enfoque.",
      "Con más de 25 años de experiencia en el fitness, se ha especializado en un Pilates completo (Mat, Reformer, Cadillac, Chair), con formaciones en rehabilitación, pre/postnatal y personas mayores. Desarrolló su experiencia a nivel internacional, particularmente en un estudio de referencia en Singapur.",
      "Hoy, propone sesiones completamente personalizadas en Ginebra en su estudio Essential Pilates, integrado en un entorno médico. Su enfoque busca mejorar la postura, fortalecer el cuerpo en profundidad, prevenir lesiones y optimizar el rendimiento.",
    ].join("\n\n")},
    bio_it = ${[
      "Certificata dal 2017, Fiorenza ha scoperto il Pilates a Singapore in seguito a un infortunio alla schiena. Questo metodo le ha permesso di ritrovare un corpo forte, equilibrato e senza dolore, ed è da allora al centro del suo approccio.",
      "Forte di oltre 25 anni di esperienza nel fitness, si è specializzata in un Pilates completo (Mat, Reformer, Cadillac, Chair), con formazioni in riabilitazione, pre/postnatale e anziani. Ha sviluppato la sua esperienza a livello internazionale, in particolare presso uno studio di riferimento a Singapore.",
      "Oggi propone sedute interamente personalizzate a Ginevra nel suo studio Essential Pilates, integrato in un ambiente medico. Il suo approccio mira a migliorare la postura, rafforzare il corpo in profondità, prevenire gli infortuni e ottimizzare le prestazioni.",
    ].join("\n\n")},
    specialties_es = ${["Pilates para la fuerza, la movilidad y el rendimiento", "Mejora de la postura y la alineación", "Pilates para principiantes y personas activas", "Preparación física para tenis y pádel", "Pilates post-rehabilitación", "Pilates pre y postnatal"]},
    specialties_it = ${["Pilates per la forza, la mobilità e la performance", "Miglioramento della postura e dell'allineamento", "Pilates per principianti e persone attive", "Preparazione fisica per tennis e padel", "Pilates post-riabilitazione", "Pilates pre e postnatale"]},
    conditions_es = ${["Pilates Academy International — Certificación completa Nivel 1 y 2 (Mat, Reformer, Cadillac, Chair y Barrels nivel 1)", "Pilates pre/post-rehabilitación — Pilates Academy International", "Pilates pre y postnatal — Pilates Academy International", "Golden Pilates (mayores) — Pilates Academy International", "Método Franklin® — Fascia training para la zona lumbar"]},
    conditions_it = ${["Pilates Academy International — Certificazione completa Livello 1 e 2 (Mat, Reformer, Cadillac, Chair e Barrels livello 1)", "Pilates pre/post-riabilitazione — Pilates Academy International", "Pilates pre e postnatale — Pilates Academy International", "Golden Pilates (anziani) — Pilates Academy International", "Metodo Franklin® — Fascia training per la zona lombare"]}
  WHERE slug = 'fiorenza-toffolon'`;

  console.log("\nAll practitioners translated!");
})();
