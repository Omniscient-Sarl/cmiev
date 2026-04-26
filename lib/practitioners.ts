export type LocaleMap<T> = { fr: T; en: T; es: T; it: T };

export interface Practitioner {
  slug: string;
  name: string;
  title: LocaleMap<string>;
  phone: string;
  email?: string;
  bio: LocaleMap<string[]>;
  specialties: LocaleMap<string[]>;
  conditions: LocaleMap<string[]>;
  image?: string;
  seoKeywords: LocaleMap<string[]>;
  spokenLanguages?: string[];
}

export const practitioners: Practitioner[] = [
  {
    slug: "karen-aguiar",
    name: "Karen Aguiar",
    title: {
      fr: "Physiothérapeute",
      en: "Physiotherapist",
      es: "Physiothérapeute",
      it: "Physiothérapeute",
    },
    phone: "+41 22 700 53 33",
    email: "karenluana.aguiar@gmail.com",
    image: "/images/praticiens/karen-aguiar.webp",
    bio: {
      fr: [
        "Karen Aguiar est physiothérapeute formée au Brésil et en activité à Genève depuis 2017. Son objectif est d\u2019accompagner ses patients vers une meilleure santé physique et un bien-être optimal.",
        "Spécialisée dans la prévention, le traitement et la rééducation périnéale et posturale, la Méthode Pilates et le drainage lymphatique, elle propose des soins personnalisés et adaptés aux besoins spécifiques de chaque patient.",
        "Que vous soyez en phase de récupération après une blessure, en traitement pour une douleur chronique, ou simplement en quête d\u2019une meilleure mobilité, Karen vous guide tout au long de votre parcours de rééducation. Son approche combine expertise, écoute et respect de vos objectifs.",
      ],
      en: [
        "Karen Aguiar is a physiotherapist trained in Brazil, practising in Geneva since 2017. Her goal is to guide her patients towards better physical health and optimal well-being.",
        "Specialising in prevention, treatment and perineal and postural rehabilitation, the Pilates Method and lymphatic drainage, she offers personalised care tailored to each patient\u2019s specific needs.",
        "Whether you are recovering from an injury, undergoing treatment for chronic pain, or simply seeking better mobility, Karen guides you throughout your rehabilitation journey. Her approach combines expertise, listening and respect for your goals.",
      ],
      es: [
        "Karen Aguiar est physiothérapeute formée au Brésil et en activité à Genève depuis 2017. Son objectif est d\u2019accompagner ses patients vers une meilleure santé physique et un bien-être optimal.",
        "Spécialisée dans la prévention, le traitement et la rééducation périnéale et posturale, la Méthode Pilates et le drainage lymphatique, elle propose des soins personnalisés et adaptés aux besoins spécifiques de chaque patient.",
        "Que vous soyez en phase de récupération après une blessure, en traitement pour une douleur chronique, ou simplement en quête d\u2019une meilleure mobilité, Karen vous guide tout au long de votre parcours de rééducation. Son approche combine expertise, écoute et respect de vos objectifs.",
      ],
      it: [
        "Karen Aguiar est physiothérapeute formée au Brésil et en activité à Genève depuis 2017. Son objectif est d\u2019accompagner ses patients vers une meilleure santé physique et un bien-être optimal.",
        "Spécialisée dans la prévention, le traitement et la rééducation périnéale et posturale, la Méthode Pilates et le drainage lymphatique, elle propose des soins personnalisés et adaptés aux besoins spécifiques de chaque patient.",
        "Que vous soyez en phase de récupération après une blessure, en traitement pour une douleur chronique, ou simplement en quête d\u2019une meilleure mobilité, Karen vous guide tout au long de votre parcours de rééducation. Son approche combine expertise, écoute et respect de vos objectifs.",
      ],
    },
    specialties: {
      fr: [
        "Physiothérapie",
        "Rééducation périnéale et posturale",
        "Méthode Pilates",
        "Drainage lymphatique",
      ],
      en: [
        "Physiotherapy",
        "Perineal and postural rehabilitation",
        "Pilates Method",
        "Lymphatic drainage",
      ],
      es: [
        "Physiothérapie",
        "Rééducation périnéale et posturale",
        "Méthode Pilates",
        "Drainage lymphatique",
      ],
      it: [
        "Physiothérapie",
        "Rééducation périnéale et posturale",
        "Méthode Pilates",
        "Drainage lymphatique",
      ],
    },
    conditions: {
      fr: [
        "Douleurs chroniques",
        "Récupération post-blessure",
        "Troubles posturaux",
        "Troubles périnéaux",
      ],
      en: [
        "Chronic pain",
        "Post-injury recovery",
        "Postural disorders",
        "Perineal disorders",
      ],
      es: [
        "Douleurs chroniques",
        "Récupération post-blessure",
        "Troubles posturaux",
        "Troubles périnéaux",
      ],
      it: [
        "Douleurs chroniques",
        "Récupération post-blessure",
        "Troubles posturaux",
        "Troubles périnéaux",
      ],
    },
    seoKeywords: {
      fr: ["Physiothérapeute Genève", "Physiothérapie Eaux-Vives", "Karen Aguiar Genève"],
      en: ["Physiotherapist Geneva", "Physiotherapy Eaux-Vives", "Karen Aguiar Geneva"],
      es: ["Physiothérapeute Genève", "Physiothérapie Eaux-Vives", "Karen Aguiar Genève"],
      it: ["Physiothérapeute Genève", "Physiothérapie Eaux-Vives", "Karen Aguiar Genève"],
    },
  },
  {
    slug: "elio-bosani",
    name: "Elio Bosani",
    title: {
      fr: "Ostéopathe",
      en: "Osteopath",
      es: "Ostéopathe",
      it: "Ostéopathe",
    },
    phone: "+41 22 700 63 22",
    image: "/images/praticiens/elio-bosani.webp",
    bio: {
      fr: [
        "Elio Bosani est ostéopathe au CMIEV à Genève. Il propose des traitements ostéopathiques pour rétablir l\u2019équilibre structurel et fonctionnel du corps.",
      ],
      en: [
        "Elio Bosani is an osteopath at CMIEV in Geneva. He offers osteopathic treatments to restore the structural and functional balance of the body.",
      ],
      es: [
        "Elio Bosani est ostéopathe au CMIEV à Genève. Il propose des traitements ostéopathiques pour rétablir l\u2019équilibre structurel et fonctionnel du corps.",
      ],
      it: [
        "Elio Bosani est ostéopathe au CMIEV à Genève. Il propose des traitements ostéopathiques pour rétablir l\u2019équilibre structurel et fonctionnel du corps.",
      ],
    },
    specialties: {
      fr: ["Ostéopathie"],
      en: ["Osteopathy"],
      es: ["Ostéopathie"],
      it: ["Ostéopathie"],
    },
    conditions: {
      fr: ["Douleurs musculo-squelettiques", "Troubles fonctionnels", "Tensions corporelles"],
      en: ["Musculoskeletal pain", "Functional disorders", "Body tension"],
      es: ["Douleurs musculo-squelettiques", "Troubles fonctionnels", "Tensions corporelles"],
      it: ["Douleurs musculo-squelettiques", "Troubles fonctionnels", "Tensions corporelles"],
    },
    seoKeywords: {
      fr: ["Ostéopathe Genève", "Ostéopathie Eaux-Vives", "Elio Bosani Genève"],
      en: ["Osteopath Geneva", "Osteopathy Eaux-Vives", "Elio Bosani Geneva"],
      es: ["Ostéopathe Genève", "Ostéopathie Eaux-Vives", "Elio Bosani Genève"],
      it: ["Ostéopathe Genève", "Ostéopathie Eaux-Vives", "Elio Bosani Genève"],
    },
  },
  {
    slug: "corinne-dauve",
    name: "Dr Corinne Dauve",
    title: {
      fr: "Psychiatre",
      en: "Psychiatrist",
      es: "Psychiatre",
      it: "Psychiatre",
    },
    phone: "+41 76 223 80 16",
    image: "/images/praticiens/corinne-dauve.webp",
    bio: {
      fr: [
        "Ancienne cheffe de clinique des Hôpitaux Universitaires de Genève dans l\u2019Unité de Psychiatrie du Développement Mental, le Docteur Corinne Dauve est spécialisée dans la prise en charge des patients atteints de déficience des facultés intellectuelles.",
        "Par ailleurs très intéressée par le domaine de la psychiatrie métabolique, le Docteur Corinne Dauve propose un accompagnement des troubles anxieux, dépressifs et troubles de l\u2019adaptation par une approche nutritionnelle globale.",
      ],
      en: [
        "Former head of clinic at the Geneva University Hospitals in the Mental Development Psychiatry Unit, Dr Corinne Dauve specialises in the care of patients with intellectual disabilities.",
        "Also deeply interested in metabolic psychiatry, Dr Corinne Dauve offers support for anxiety, depressive and adjustment disorders through a comprehensive nutritional approach.",
      ],
      es: [
        "Ancienne cheffe de clinique des Hôpitaux Universitaires de Genève dans l\u2019Unité de Psychiatrie du Développement Mental, le Docteur Corinne Dauve est spécialisée dans la prise en charge des patients atteints de déficience des facultés intellectuelles.",
        "Par ailleurs très intéressée par le domaine de la psychiatrie métabolique, le Docteur Corinne Dauve propose un accompagnement des troubles anxieux, dépressifs et troubles de l\u2019adaptation par une approche nutritionnelle globale.",
      ],
      it: [
        "Ancienne cheffe de clinique des Hôpitaux Universitaires de Genève dans l\u2019Unité de Psychiatrie du Développement Mental, le Docteur Corinne Dauve est spécialisée dans la prise en charge des patients atteints de déficience des facultés intellectuelles.",
        "Par ailleurs très intéressée par le domaine de la psychiatrie métabolique, le Docteur Corinne Dauve propose un accompagnement des troubles anxieux, dépressifs et troubles de l\u2019adaptation par une approche nutritionnelle globale.",
      ],
    },
    specialties: {
      fr: ["Psychiatrie", "Psychiatrie métabolique", "Approche nutritionnelle"],
      en: ["Psychiatry", "Metabolic psychiatry", "Nutritional approach"],
      es: ["Psychiatrie", "Psychiatrie métabolique", "Approche nutritionnelle"],
      it: ["Psychiatrie", "Psychiatrie métabolique", "Approche nutritionnelle"],
    },
    conditions: {
      fr: [
        "Troubles anxieux",
        "Troubles dépressifs",
        "Troubles de l\u2019adaptation",
        "Déficience intellectuelle",
      ],
      en: [
        "Anxiety disorders",
        "Depressive disorders",
        "Adjustment disorders",
        "Intellectual disability",
      ],
      es: [
        "Troubles anxieux",
        "Troubles dépressifs",
        "Troubles de l\u2019adaptation",
        "Déficience intellectuelle",
      ],
      it: [
        "Troubles anxieux",
        "Troubles dépressifs",
        "Troubles de l\u2019adaptation",
        "Déficience intellectuelle",
      ],
    },
    seoKeywords: {
      fr: ["Psychiatre Genève", "Psychiatrie Eaux-Vives", "Dr Corinne Dauve Genève"],
      en: ["Psychiatrist Geneva", "Psychiatry Eaux-Vives", "Dr Corinne Dauve Geneva"],
      es: ["Psychiatre Genève", "Psychiatrie Eaux-Vives", "Dr Corinne Dauve Genève"],
      it: ["Psychiatre Genève", "Psychiatrie Eaux-Vives", "Dr Corinne Dauve Genève"],
    },
  },
  {
    slug: "isaline-henry",
    name: "Isaline Henry",
    title: {
      fr: "Physiothérapeute",
      en: "Physiotherapist",
      es: "Physiothérapeute",
      it: "Physiothérapeute",
    },
    phone: "+41 22 700 53 33",
    email: "isalinehenry@gmail.com",
    image: "/images/praticiens/isaline-henry.webp",
    bio: {
      fr: [
        "Isaline Henry travaille comme physiothérapeute depuis 2014. Elle accompagne les personnes concernées par des lésions traumatiques (entorse, fracture) mais aussi par des douleurs chroniques (lombalgie, cervicalgie, capsulite, arthrose de hanche et de genou).",
        "Elle prend en charge les personnes âgées touchées par des problèmes d\u2019équilibre et de déconditionnement musculaire (possibilité de traitement à domicile) ainsi que toute personne présentant des douleurs liées à la posture (scoliose, cyphose excessive, désaccordage musculaire, douleurs chroniques) avec le concept d\u2019accordage de chaînes musculaires et articulaires GDS.",
        "Elle enseigne le Pilates à des petits groupes et dispense le programme GLAD.",
      ],
      en: [
        "Isaline Henry has been working as a physiotherapist since 2014. She supports patients with traumatic injuries (sprains, fractures) as well as chronic pain (lower back pain, neck pain, capsulitis, hip and knee osteoarthritis).",
        "She cares for elderly patients with balance problems and muscular deconditioning (home treatment possible) as well as anyone with posture-related pain (scoliosis, excessive kyphosis, muscular imbalance, chronic pain) using the GDS muscular and joint chain tuning concept.",
        "She teaches Pilates to small groups and delivers the GLAD programme.",
      ],
      es: [
        "Isaline Henry travaille comme physiothérapeute depuis 2014. Elle accompagne les personnes concernées par des lésions traumatiques (entorse, fracture) mais aussi par des douleurs chroniques (lombalgie, cervicalgie, capsulite, arthrose de hanche et de genou).",
        "Elle prend en charge les personnes âgées touchées par des problèmes d\u2019équilibre et de déconditionnement musculaire (possibilité de traitement à domicile) ainsi que toute personne présentant des douleurs liées à la posture (scoliose, cyphose excessive, désaccordage musculaire, douleurs chroniques) avec le concept d\u2019accordage de chaînes musculaires et articulaires GDS.",
        "Elle enseigne le Pilates à des petits groupes et dispense le programme GLAD.",
      ],
      it: [
        "Isaline Henry travaille comme physiothérapeute depuis 2014. Elle accompagne les personnes concernées par des lésions traumatiques (entorse, fracture) mais aussi par des douleurs chroniques (lombalgie, cervicalgie, capsulite, arthrose de hanche et de genou).",
        "Elle prend en charge les personnes âgées touchées par des problèmes d\u2019équilibre et de déconditionnement musculaire (possibilité de traitement à domicile) ainsi que toute personne présentant des douleurs liées à la posture (scoliose, cyphose excessive, désaccordage musculaire, douleurs chroniques) avec le concept d\u2019accordage de chaînes musculaires et articulaires GDS.",
        "Elle enseigne le Pilates à des petits groupes et dispense le programme GLAD.",
      ],
    },
    specialties: {
      fr: [
        "Physiothérapie",
        "Pilates en groupe",
        "Programme GLAD",
        "Chaînes musculaires GDS",
      ],
      en: [
        "Physiotherapy",
        "Group Pilates",
        "GLAD Programme",
        "GDS muscular chains",
      ],
      es: [
        "Physiothérapie",
        "Pilates en groupe",
        "Programme GLAD",
        "Chaînes musculaires GDS",
      ],
      it: [
        "Physiothérapie",
        "Pilates en groupe",
        "Programme GLAD",
        "Chaînes musculaires GDS",
      ],
    },
    conditions: {
      fr: [
        "Lésions traumatiques",
        "Douleurs chroniques",
        "Problèmes d\u2019équilibre",
        "Troubles posturaux",
        "Arthrose",
      ],
      en: [
        "Traumatic injuries",
        "Chronic pain",
        "Balance problems",
        "Postural disorders",
        "Osteoarthritis",
      ],
      es: [
        "Lésions traumatiques",
        "Douleurs chroniques",
        "Problèmes d\u2019équilibre",
        "Troubles posturaux",
        "Arthrose",
      ],
      it: [
        "Lésions traumatiques",
        "Douleurs chroniques",
        "Problèmes d\u2019équilibre",
        "Troubles posturaux",
        "Arthrose",
      ],
    },
    seoKeywords: {
      fr: ["Physiothérapeute Genève", "Physiothérapie Eaux-Vives", "Isaline Henry Genève"],
      en: ["Physiotherapist Geneva", "Physiotherapy Eaux-Vives", "Isaline Henry Geneva"],
      es: ["Physiothérapeute Genève", "Physiothérapie Eaux-Vives", "Isaline Henry Genève"],
      it: ["Physiothérapeute Genève", "Physiothérapie Eaux-Vives", "Isaline Henry Genève"],
    },
  },
  {
    slug: "beatrice-milbert",
    name: "Béatrice Milbert",
    title: {
      fr: "Homéopathe",
      en: "Homeopath",
      es: "Homéopathe",
      it: "Homéopathe",
    },
    phone: "+41 22 566 01 50",
    image: "/images/praticiens/beatrice-limbert.webp",
    bio: {
      fr: [
        "Diplômée d\u2019homéopathie de l\u2019Institut homéopathique scientifique, Béatrice Milbert est enseignante à l\u2019IHS et à l\u2019Académie libre de médecine intégrative à Genève (Acalmi.ch).",
        "Elle mène des recherches en homéopathie et en médecine intégrative.",
      ],
      en: [
        "A graduate in homeopathy from the Scientific Homeopathic Institute, Béatrice Milbert teaches at the IHS and the Free Academy of Integrative Medicine in Geneva (Acalmi.ch).",
        "She conducts research in homeopathy and integrative medicine.",
      ],
      es: [
        "Diplômée d\u2019homéopathie de l\u2019Institut homéopathique scientifique, Béatrice Milbert est enseignante à l\u2019IHS et à l\u2019Académie libre de médecine intégrative à Genève (Acalmi.ch).",
        "Elle mène des recherches en homéopathie et en médecine intégrative.",
      ],
      it: [
        "Diplômée d\u2019homéopathie de l\u2019Institut homéopathique scientifique, Béatrice Milbert est enseignante à l\u2019IHS et à l\u2019Académie libre de médecine intégrative à Genève (Acalmi.ch).",
        "Elle mène des recherches en homéopathie et en médecine intégrative.",
      ],
    },
    specialties: {
      fr: ["Homéopathie", "Médecine intégrative", "Recherche en homéopathie"],
      en: ["Homeopathy", "Integrative medicine", "Homeopathy research"],
      es: ["Homéopathie", "Médecine intégrative", "Recherche en homéopathie"],
      it: ["Homéopathie", "Médecine intégrative", "Recherche en homéopathie"],
    },
    conditions: {
      fr: ["Troubles chroniques", "Troubles fonctionnels", "Maladies inflammatoires"],
      en: ["Chronic disorders", "Functional disorders", "Inflammatory diseases"],
      es: ["Troubles chroniques", "Troubles fonctionnels", "Maladies inflammatoires"],
      it: ["Troubles chroniques", "Troubles fonctionnels", "Maladies inflammatoires"],
    },
    seoKeywords: {
      fr: ["Homéopathe Genève", "Homéopathie Eaux-Vives", "Béatrice Milbert Genève"],
      en: ["Homeopath Geneva", "Homeopathy Eaux-Vives", "Béatrice Milbert Geneva"],
      es: ["Homéopathe Genève", "Homéopathie Eaux-Vives", "Béatrice Milbert Genève"],
      it: ["Homéopathe Genève", "Homéopathie Eaux-Vives", "Béatrice Milbert Genève"],
    },
  },
  {
    slug: "shima-sazegari",
    name: "Shima Sazegari",
    title: {
      fr: "Pharmacienne — Consultante en médecine intégrative",
      en: "Pharmacist — Integrative Medicine Consultant",
      es: "Pharmacienne — Consultante en médecine intégrative",
      it: "Pharmacienne — Consultante en médecine intégrative",
    },
    phone: "+41 78 663 78 87",
    image: "/images/praticiens/shima-sazegari.webp",
    bio: {
      fr: [
        "Diplômée de la faculté de pharmacie de l\u2019Université de Genève, Shima Sazegari travaille comme pharmacienne et consultante en médecine intégrative depuis plus de 25 ans à Genève. Pendant toutes ces années, elle s\u2019est intéressée et engagée pour le développement de la médecine naturelle en Suisse et en Europe.",
        "Ses domaines d\u2019expertise proviennent de ses années de pratique et de formation continue auprès d\u2019experts reconnus internationalement dans des domaines tels que la médecine fonctionnelle, l\u2019homéopathie uniciste basée sur la méthode de sensation vitale, la phytothérapie dans son application pharmaceutique élargie en particulier les élixirs d\u2019orchidée LTOE et l\u2019application de la Thérapie Énergétique en Kinésiologie (TEK).",
        "Bénéficiant de sa vaste expérience, elle propose aujourd\u2019hui dans son cabinet thérapeutique, des solutions individualisées et adaptées à ses patients.",
      ],
      en: [
        "A graduate of the Faculty of Pharmacy at the University of Geneva, Shima Sazegari has been working as a pharmacist and integrative medicine consultant for over 25 years in Geneva. Throughout these years, she has been dedicated to the development of natural medicine in Switzerland and Europe.",
        "Her areas of expertise stem from years of practice and continuing education with internationally recognised experts in fields such as functional medicine, unicist homeopathy based on the vital sensation method, expanded pharmaceutical phytotherapy — particularly LTOE orchid elixirs — and the application of Energy Therapy in Kinesiology (TEK).",
        "Drawing on her extensive experience, she now offers individualised and tailored solutions to her patients in her therapeutic practice.",
      ],
      es: [
        "Diplômée de la faculté de pharmacie de l\u2019Université de Genève, Shima Sazegari travaille comme pharmacienne et consultante en médecine intégrative depuis plus de 25 ans à Genève. Pendant toutes ces années, elle s\u2019est intéressée et engagée pour le développement de la médecine naturelle en Suisse et en Europe.",
        "Ses domaines d\u2019expertise proviennent de ses années de pratique et de formation continue auprès d\u2019experts reconnus internationalement dans des domaines tels que la médecine fonctionnelle, l\u2019homéopathie uniciste basée sur la méthode de sensation vitale, la phytothérapie dans son application pharmaceutique élargie en particulier les élixirs d\u2019orchidée LTOE et l\u2019application de la Thérapie Énergétique en Kinésiologie (TEK).",
        "Bénéficiant de sa vaste expérience, elle propose aujourd\u2019hui dans son cabinet thérapeutique, des solutions individualisées et adaptées à ses patients.",
      ],
      it: [
        "Diplômée de la faculté de pharmacie de l\u2019Université de Genève, Shima Sazegari travaille comme pharmacienne et consultante en médecine intégrative depuis plus de 25 ans à Genève. Pendant toutes ces années, elle s\u2019est intéressée et engagée pour le développement de la médecine naturelle en Suisse et en Europe.",
        "Ses domaines d\u2019expertise proviennent de ses années de pratique et de formation continue auprès d\u2019experts reconnus internationalement dans des domaines tels que la médecine fonctionnelle, l\u2019homéopathie uniciste basée sur la méthode de sensation vitale, la phytothérapie dans son application pharmaceutique élargie en particulier les élixirs d\u2019orchidée LTOE et l\u2019application de la Thérapie Énergétique en Kinésiologie (TEK).",
        "Bénéficiant de sa vaste expérience, elle propose aujourd\u2019hui dans son cabinet thérapeutique, des solutions individualisées et adaptées à ses patients.",
      ],
    },
    specialties: {
      fr: [
        "Médecine fonctionnelle",
        "Homéopathie uniciste",
        "Phytothérapie",
        "Kinésiologie (TEK)",
      ],
      en: [
        "Functional medicine",
        "Unicist homeopathy",
        "Phytotherapy",
        "Kinesiology (TEK)",
      ],
      es: [
        "Médecine fonctionnelle",
        "Homéopathie uniciste",
        "Phytothérapie",
        "Kinésiologie (TEK)",
      ],
      it: [
        "Médecine fonctionnelle",
        "Homéopathie uniciste",
        "Phytothérapie",
        "Kinésiologie (TEK)",
      ],
    },
    conditions: {
      fr: [
        "Déséquilibres fonctionnels",
        "Troubles métaboliques",
        "Troubles énergétiques",
      ],
      en: [
        "Functional imbalances",
        "Metabolic disorders",
        "Energetic disorders",
      ],
      es: [
        "Déséquilibres fonctionnels",
        "Troubles métaboliques",
        "Troubles énergétiques",
      ],
      it: [
        "Déséquilibres fonctionnels",
        "Troubles métaboliques",
        "Troubles énergétiques",
      ],
    },
    seoKeywords: {
      fr: [
        "Médecine intégrative Genève",
        "Pharmacienne Eaux-Vives",
        "Shima Sazegari Genève",
      ],
      en: [
        "Integrative medicine Geneva",
        "Pharmacist Eaux-Vives",
        "Shima Sazegari Geneva",
      ],
      es: [
        "Médecine intégrative Genève",
        "Pharmacienne Eaux-Vives",
        "Shima Sazegari Genève",
      ],
      it: [
        "Médecine intégrative Genève",
        "Pharmacienne Eaux-Vives",
        "Shima Sazegari Genève",
      ],
    },
  },
  {
    slug: "severine-schwab",
    name: "Séverine Schwab",
    title: {
      fr: "Fasciathérapeute",
      en: "Fascia Therapist",
      es: "Fasciathérapeute",
      it: "Fasciathérapeute",
    },
    phone: "+41 78 402 48 62",
    image: "/images/praticiens/severine-schwab.webp",
    bio: {
      fr: [
        "Séverine Schwab est fasciathérapeute au CMIEV à Genève. La fasciathérapie est une thérapie manuelle douce qui s\u2019adresse aux fascias, ces membranes de tissu conjonctif qui enveloppent et relient toutes les structures du corps.",
      ],
      en: [
        "Séverine Schwab is a fascia therapist at CMIEV in Geneva. Fascia therapy is a gentle manual therapy that addresses the fascia — connective tissue membranes that envelop and connect all structures of the body.",
      ],
      es: [
        "Séverine Schwab est fasciathérapeute au CMIEV à Genève. La fasciathérapie est une thérapie manuelle douce qui s\u2019adresse aux fascias, ces membranes de tissu conjonctif qui enveloppent et relient toutes les structures du corps.",
      ],
      it: [
        "Séverine Schwab est fasciathérapeute au CMIEV à Genève. La fasciathérapie est une thérapie manuelle douce qui s\u2019adresse aux fascias, ces membranes de tissu conjonctif qui enveloppent et relient toutes les structures du corps.",
      ],
    },
    specialties: {
      fr: ["Fasciathérapie"],
      en: ["Fascia therapy"],
      es: ["Fasciathérapie"],
      it: ["Fasciathérapie"],
    },
    conditions: {
      fr: ["Tensions fasciales", "Douleurs musculaires", "Troubles fonctionnels"],
      en: ["Fascial tension", "Muscle pain", "Functional disorders"],
      es: ["Tensions fasciales", "Douleurs musculaires", "Troubles fonctionnels"],
      it: ["Tensions fasciales", "Douleurs musculaires", "Troubles fonctionnels"],
    },
    seoKeywords: {
      fr: ["Fasciathérapeute Genève", "Fasciathérapie Eaux-Vives", "Séverine Schwab Genève"],
      en: ["Fascia therapist Geneva", "Fascia therapy Eaux-Vives", "Séverine Schwab Geneva"],
      es: ["Fasciathérapeute Genève", "Fasciathérapie Eaux-Vives", "Séverine Schwab Genève"],
      it: ["Fasciathérapeute Genève", "Fasciathérapie Eaux-Vives", "Séverine Schwab Genève"],
    },
  },
  {
    slug: "fiorenza-toffolon",
    name: "Fiorenza Toffolon",
    title: {
      fr: "Instructrice Pilates",
      en: "Pilates Instructor",
      es: "Instructrice Pilates",
      it: "Instructrice Pilates",
    },
    phone: "+41 76 698 42 25",
    email: "fiore.essential@gmail.com",
    image: "/images/praticiens/fiorenza-toffolon.webp",
    bio: {
      fr: [
        "Fiorenza Toffolon, instructrice certifiée de Pilates depuis 2017, a découvert cette pratique lors de son expatriation à Singapour, après une blessure au dos. Le Pilates l\u2019a aidée à retrouver sa forme et est devenu essentiel à son bien-être.",
        "Son parcours dans le sport a débuté il y a plus de 25 ans, avec une certification en fitness FISAF. En 2012, elle a choisi de se consacrer pleinement au bien-être physique en tant qu\u2019instructrice freelance de Zumba.",
        "En 2016, après avoir découvert les bienfaits du Pilates, elle s\u2019y est dédiée entièrement, obtenant des certifications en Pilates MAT, Reformer et divers équipements (Cadillac, Chair, Barrel), ainsi que des formations spécialisées en Pilates pré/postnatal, réhabilitation et Golden Pilates.",
        "Elle a enrichi son expertise au niveau international en travaillant à Singapour avec une clientèle variée. Aujourd\u2019hui, son objectif est de continuer à transmettre les bienfaits du Pilates et d\u2019améliorer la qualité de vie de chacun. C\u2019est dans cet esprit qu\u2019elle propose désormais son expertise à Genève, avec son studio Essential Pilates.",
      ],
      en: [
        "Fiorenza Toffolon, a certified Pilates instructor since 2017, discovered this practice during her time in Singapore, after a back injury. Pilates helped her regain her fitness and became essential to her well-being.",
        "Her journey in sport began over 25 years ago, with a FISAF fitness certification. In 2012, she chose to fully dedicate herself to physical well-being as a freelance Zumba instructor.",
        "In 2016, after discovering the benefits of Pilates, she dedicated herself entirely, obtaining certifications in Pilates MAT, Reformer and various equipment (Cadillac, Chair, Barrel), as well as specialised training in pre/postnatal Pilates, rehabilitation and Golden Pilates.",
        "She enriched her expertise internationally by working in Singapore with a diverse clientele. Today, her goal is to continue sharing the benefits of Pilates and improving everyone\u2019s quality of life. She now offers her expertise in Geneva, with her studio Essential Pilates.",
      ],
      es: [
        "Fiorenza Toffolon, instructrice certifiée de Pilates depuis 2017, a découvert cette pratique lors de son expatriation à Singapour, après une blessure au dos. Le Pilates l\u2019a aidée à retrouver sa forme et est devenu essentiel à son bien-être.",
        "Son parcours dans le sport a débuté il y a plus de 25 ans, avec une certification en fitness FISAF. En 2012, elle a choisi de se consacrer pleinement au bien-être physique en tant qu\u2019instructrice freelance de Zumba.",
        "En 2016, après avoir découvert les bienfaits du Pilates, elle s\u2019y est dédiée entièrement, obtenant des certifications en Pilates MAT, Reformer et divers équipements (Cadillac, Chair, Barrel), ainsi que des formations spécialisées en Pilates pré/postnatal, réhabilitation et Golden Pilates.",
        "Elle a enrichi son expertise au niveau international en travaillant à Singapour avec une clientèle variée. Aujourd\u2019hui, son objectif est de continuer à transmettre les bienfaits du Pilates et d\u2019améliorer la qualité de vie de chacun. C\u2019est dans cet esprit qu\u2019elle propose désormais son expertise à Genève, avec son studio Essential Pilates.",
      ],
      it: [
        "Fiorenza Toffolon, instructrice certifiée de Pilates depuis 2017, a découvert cette pratique lors de son expatriation à Singapour, après une blessure au dos. Le Pilates l\u2019a aidée à retrouver sa forme et est devenu essentiel à son bien-être.",
        "Son parcours dans le sport a débuté il y a plus de 25 ans, avec une certification en fitness FISAF. En 2012, elle a choisi de se consacrer pleinement au bien-être physique en tant qu\u2019instructrice freelance de Zumba.",
        "En 2016, après avoir découvert les bienfaits du Pilates, elle s\u2019y est dédiée entièrement, obtenant des certifications en Pilates MAT, Reformer et divers équipements (Cadillac, Chair, Barrel), ainsi que des formations spécialisées en Pilates pré/postnatal, réhabilitation et Golden Pilates.",
        "Elle a enrichi son expertise au niveau international en travaillant à Singapour avec une clientèle variée. Aujourd\u2019hui, son objectif est de continuer à transmettre les bienfaits du Pilates et d\u2019améliorer la qualité de vie de chacun. C\u2019est dans cet esprit qu\u2019elle propose désormais son expertise à Genève, avec son studio Essential Pilates.",
      ],
    },
    specialties: {
      fr: [
        "Pilates MAT",
        "Pilates Reformer",
        "Pilates pré/postnatal",
        "Réhabilitation",
        "Golden Pilates",
      ],
      en: [
        "MAT Pilates",
        "Reformer Pilates",
        "Pre/postnatal Pilates",
        "Rehabilitation",
        "Golden Pilates",
      ],
      es: [
        "Pilates MAT",
        "Pilates Reformer",
        "Pilates pré/postnatal",
        "Réhabilitation",
        "Golden Pilates",
      ],
      it: [
        "Pilates MAT",
        "Pilates Reformer",
        "Pilates pré/postnatal",
        "Réhabilitation",
        "Golden Pilates",
      ],
    },
    conditions: {
      fr: [
        "Blessures dorsales",
        "Récupération post-blessure",
        "Troubles posturaux",
        "Déconditionnement physique",
      ],
      en: [
        "Back injuries",
        "Post-injury recovery",
        "Postural disorders",
        "Physical deconditioning",
      ],
      es: [
        "Blessures dorsales",
        "Récupération post-blessure",
        "Troubles posturaux",
        "Déconditionnement physique",
      ],
      it: [
        "Blessures dorsales",
        "Récupération post-blessure",
        "Troubles posturaux",
        "Déconditionnement physique",
      ],
    },
    seoKeywords: {
      fr: ["Pilates Genève", "Instructrice Pilates Eaux-Vives", "Fiorenza Toffolon Genève"],
      en: ["Pilates Geneva", "Pilates instructor Eaux-Vives", "Fiorenza Toffolon Geneva"],
      es: ["Pilates Genève", "Instructrice Pilates Eaux-Vives", "Fiorenza Toffolon Genève"],
      it: ["Pilates Genève", "Instructrice Pilates Eaux-Vives", "Fiorenza Toffolon Genève"],
    },
  },
];

export function getPractitionerBySlug(slug: string): Practitioner | undefined {
  return practitioners.find((p) => p.slug === slug);
}

export function getAllPractitionerSlugs(): string[] {
  return practitioners.map((p) => p.slug);
}
