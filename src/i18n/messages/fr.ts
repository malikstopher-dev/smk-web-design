import type { Dict } from "@/i18n/types"

export const fr: Dict = {
  nav: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    work: "Réalisations",
    pricing: "Tarifs",
    blog: "Blog",
    contact: "Contact",
    letsTalk: "Discutons",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    menuLabel: "Navigation du site",
  },
  langSwitcher: { label: "Langue", aria: "Langue" },
  hero: {
    eyebrowRole: "Créateur de sites web & Développeur",
    eyebrowLocation: "Johannesburg, Afrique du Sud",
    tagline: "Des sites web qui génèrent des appels.",
    bio: "J'aide les entreprises en Afrique du Sud, en République Démocratique du Congo, au Mozambique, au Canada et ailleurs avec des sites performants qui se classent sur Google et transforment les visiteurs en clients payants.",
    quoteCta: "Demander un devis gratuit",
    workCta: "Voir mes réalisations",
    scroll: "Défiler",
  },
  home: {
    featuredEyebrow: "Travaux sélectionnés",
    featuredTitle: "Des sites qui rapportent des clients",
    allProjects: "Tous les projets",
    servicesEyebrow: "Services",
    servicesTitle: "Tout ce dont votre site a besoin pour gagner",
    bannerText: "SMK Web Design",
    ctaTitle: "Un projet en tête ?",
    ctaBody: "Parlez-moi de votre entreprise. Je reviens vers vous avec un plan et une première maquette sous 48 heures.",
  },
  viewLiveSite: "Voir le site",
  viewProject: "Voir le projet",
  aboutPage: {
    metaTitle: "À propos",
    metaDesc: "Stopher Malik est un créateur de sites web et développeur full-stack à Sandton, Johannesburg, et le fondateur de SMK Web Design. Il conçoit des sites à forte conversion en Afrique du Sud, en RDC, au Mozambique et au Canada.",
    title: "Un design qui génère des demandes.",
    lede: "Web designer et développeur. Sandton, Johannesburg.",
    intro: "Je suis Stopher Malik, créateur de sites web et développeur full-stack, fondateur de SMK Web Design, basé à Paulshof, Sandton.",
    body: "J'aide les entreprises en Afrique du Sud, en République Démocratique du Congo, au Mozambique, au Canada et ailleurs avec des sites performants qui se classent sur Google et transforment les visiteurs en clients payants. Je conçois des systèmes qui attirent, engagent et convertissent.",
    factLineLead: "Basé à Sandton, je travaille avec des clients à Johannesburg, Kinshasa, Maputo et Montréal.",
    factLineRest: "Vingt-deux sites en ligne, le dernier lancé ce trimestre.",
    portraitAlt: "Stopher Malik, créateur de sites web à Johannesburg",
    locationCaption: "",
    processHeading: "Comment se déroule un projet",
    process: [
      {
        title: "Appel de découverte",
        body: "30 min, WhatsApp ou téléphone. On clarifie vos objectifs et ce que « réussir » veut dire.",
      },
      {
        title: "Première maquette en 48 h",
        body: "Mise en page réelle, texte réel. Pas une planche d'inspiration.",
      },
      {
        title: "Construction et ajustements",
        body: "Vous testez sur votre téléphone. On ajuste jusqu'à ce que ça convertisse.",
      },
      {
        title: "Lancement et référencement",
        body: "Mis en ligne en edge. SEO, analytique et fiche Google Business actifs dès le jour 1.",
      },
    ],
    testimonialsHeading: "Ce que disent les clients",
    testimonials: [
      {
        quote: "Stopher a livré notre site en un temps record et le résultat est vraiment super. On reçoit des demandes depuis le lancement. Je recommande vivement à tout entrepreneur.",
        name: "Salem Home Innovation",
        role: "Services à domicile, Johannesburg",
      },
      {
        quote: "Stopher criou um site profissional, limpo e fácil de entender para o nosso negócio. O trabalho ficou bem organizado, moderno e ajudou a apresentar melhor os nossos serviços aos clientes.",
        name: "JMOTO Electrical",
        role: "Serviços Elétricos, Gauteng",
      },
      {
        quote: "Professionnel, rapide et a compris exactement ce dont on avait besoin. Notre site de restaurant a rendu les réservations beaucoup plus faciles. Très satisfait du résultat.",
        name: "101 On Fraser",
        role: "Restaurant, Johannesburg",
      },
      {
        quote: "De zéro présence en ligne à des prospects qualifiés chaque jour. Le travail de SEO seul en valait chaque rand. Je recommande SMK.",
        name: "John K.",
        role: "Directeur, entreprise solaire",
      },
    ],
  },
  servicesPage: {
    metaTitle: "Services",
    metaDesc: "Création de sites web, développement full-stack, SEO et performance, déploiement cloud, UI/UX et branding : des services web pour les entreprises de Johannesburg et d'ailleurs.",
    title: "Six disciplines, un seul résultat : un site qui vous rapporte des clients.",
    lede: "Chaque build arrive avec les fondamentaux déjà gérés : vitesse, structure, référencement. Choisissez ce dont vous avez besoin ; la plupart des projets combinent trois ou quatre éléments.",
    items: [
      {
        title: "Création de sites web",
        short: "Sites mobile-first. Score Lighthouse mobile moyen : 97.",
        description:
          "Sites sur mesure pour les entreprises sud-africaines. Mobile-first, rapides sur 3G, faciles à éditer, pensés pour l'appel que vous voulez recevoir.",
        points: ["Design sur mesure, sans templates", "CTA clair sur chaque page", "Build responsive mobile-first", "Une structure de texte qui vend"],
      },
      {
        title: "Développement full-stack",
        short: "Apps Next.js, API Node, PostgreSQL. Livré en 14 jours.",
        description:
          "Applications Next.js et services Node.js avec une couche de données propre. Réservations, tableaux de bord, backends e-commerce — du code en production, pas un prototype.",
        points: ["Applications Next.js & React", "API Node.js et intégrations", "Couches de données PostgreSQL / MongoDB", "TypeScript de bout en bout"],
      },
      {
        title: "SEO et performance",
        short: "SEO local pour le Gauteng. Fiche Google Business sur chaque projet.",
        description:
          "Référencement local et Core Web Vitals, configurés correctement dès le premier jour. Schema, sitemap, Search Console et une vraie fiche Google Business — pas juste une mention.",
        points: ["SEO local pour les recherches au Gauteng", "Données structurées / schema", "Optimisation des Core Web Vitals", "Analytics et Search Console"],
      },
      {
        title: "Déploiement cloud",
        short: "Hébergement edge. TTFB sous 200 ms à Joburg et Kinshasa.",
        description:
          "Cloudflare Pages, Vercel et AWS, avec domaines, DNS, SSL et monitoring de disponibilité câblés. CI à chaque push, pas de déploiement manuel.",
        points: ["Cloudflare Pages & Workers", "Déploiements Vercel", "Domaines, DNS et SSL", "Supervision de disponibilité"],
      },
      {
        title: "Design UI/UX",
        short: "Wireframes, parcours, tokens. Figma, prêt à intégrer.",
        description:
          "Wireframes Figma, librairies de composants et parcours utilisateurs vraiment constructibles. Esprit accessibilité, mobile-first, testé sur la façon dont vos clients décident.",
        points: ["Parcours et wireframes", "Design systems et tokens", "Accessibilité (esprit WCAG)", "Validation par prototypes"],
      },
      {
        title: "Branding et identité visuelle",
        short: "Logos, couleurs, typographies. Tous les fichiers qu'il vous faut.",
        description:
          "Logo principal, deux variantes, système de couleurs, paire de typographies, cartes de visite et kit social. Livrés en SVG, PNG et PDF.",
        points: ["Logo + variantes", "Systèmes de couleurs et de typographie", "Design de cartes de visite", "Kit réseaux sociaux"],
      },
    ],
    discuss: "Discuter de ce service",
  },
  workPage: {
    metaTitle: "Réalisations",
    metaDesc: "Portfolio de sites de Stopher Malik chez SMK Web Design. Restaurants, services à domicile, e-commerce et applications web pour des clients en Afrique du Sud et en RDC.",
    title: "Vingt projets. De vraies entreprises, de vrais résultats.",
    lede: "Des restaurants de Johannesburg aux lounges de Kinshasa. Chaque site ci-dessous est en ligne, rapide et conçu pour convertir.",
    filters: {
      all: "Tous",
      restaurant: "Restaurants",
      business: "Services à domicile",
      construction: "Construction",
      ecommerce: "E-Commerce",
      travel: "Voyage",
      webapp: "Applications web",
    },
    
    projectsCount: { one: "{n} projet", other: "{n} projets" },
    cardAlt: "Site web {name}",
    filterAria: "Filtrer les projets par catégorie",
    ctaTitle: "Votre projet pourrait être le prochain",
    ctaBody: "Chaque site de cette grille a commencé par une conversation WhatsApp gratuite. Envoyez la vôtre.",
    
    descs: {
      "salem": "Une identité de marque complète et un site générateur de contacts pour une entreprise de services à domicile en croissance à Johannesburg : 40 % d'appels en plus en deux mois.",
      "boma": "Un site Next.js riche en images qui capture l'atmosphère de ce restaurant intimiste ; les réservations en ligne ont augmenté de 60 % après le lancement.",
      "selrahc": "Un portfolio bilingue qui présente la vision architecturale à travers des images immersives et des mises en page éditoriales épurées, pour un public international.",
      "jmoto": "Un site pensé pour la conversion avec un SEO local ciblé sur les recherches de services électriques au Gauteng, qui génère chaque semaine des contacts qualifiés.",
      "jkj": "Un site professionnel pour des solutions solaires et de sécurité, conçu pour inspirer confiance et générer des demandes de service auprès des propriétaires.",
      "cleanisa": "Un site de génération de contacts épuré et rassurant pour des services de nettoyage, qui transforme les visiteurs en consultations réservées.",
      "bemhlanga": "Un site de services pensé pour la clarté et le contact rapide, qui transforme les visites en travaux réservés.",
      "tomy-global": "Un site de services aux entreprises déployé sur Cloudflare, optimisé pour la vitesse et l'accessibilité mondiale.",
      "fiestas": "Un site rapide et mobile-first pour un restaurant de restauration rapide, pensé pour donner faim et rendre la commande immédiate.",
      "electrolight": "Un site générateur de contacts fiable pour une entreprise de services électriques, conçu pour bien se classer localement et convertir sur mobile comme sur ordinateur.",
      "uzapa": "Un portfolio de construction propulsé par React qui met en avant des projets majeurs, conçu pour décrocher des contrats par la crédibilité.",
      "le-centre": "Le site d'un lounge et restaurant sophistiqué qui capture l'atmosphère premium du lieu et génère des réservations.",
      "chez-gaby": "Le site d'un restaurant français haut de gamme au cœur de Kinshasa : réservations, menu et commande en ligne dans une élégante expérience or sur fond sombre.",
      "fraser": "Un site de restaurant avec système de réservation intégré, qui aide ce lieu à remplir ses tables sans friction.",
      "cooks": "Un site de gastronomie qui traduit l'excellence culinaire en une expérience numérique élégante, avec un SEO local.",
      "limoncello": "Le site d'un restaurant italien avec backend Node.js sur mesure, pensé pour évoquer la chaleur de la cuisine italienne authentique.",
      "levante": "Le site d'un restaurant libanais au branding fort, qui porte en ligne la richesse des saveurs et de l'atmosphère levantines.",
      "dolcevita": "Le site d'une pizzeria qui capture la joie de la vraie pizza italienne, conçu pour générer ventes à emporter et livraisons.",
      "penzura": "Une application web complète en React, pensée pour la productivité et des interactions propres.",
      "babooshka": "Un site traiteur riche en saveurs, avec une présentation appétissante des plats qui génère des demandes de réservation d'événements.",
      "buxaba": "Le portfolio d'un chef qui marie art culinaire et design premium pour attirer une clientèle traiteur haut de gamme.",
      "marche": "Un site e-commerce bilingue qui connecte les clients aux produits en RDC, pensé pour la vitesse et l'achat mobile.",
    },
    tagLabels: {
      "Home Services": "Services à domicile",
      "Restaurant": "Restaurant",
      "Architecture": "Architecture",
      "Bilingual": "Bilingue",
      "Electrical": "Électricité",
      "Solar / CCTV": "Solaire / Vidéosurveillance",
      "Security": "Sécurité",
      "Cleaning": "Nettoyage",
      "Lead Gen": "Génération de contacts",
      "Maintenance": "Maintenance",
      "Business": "Entreprises",
      "Fast Food": "Restauration rapide",
      "Hospitality": "Hôtellerie-restauration",
      "Construction": "Construction",
      "Lounge / Restaurant": "Lounge / Restaurant",
      "Fine Dining": "Gastronomie",
      "Bookings": "Réservations",
      "Italian": "Italien",
      "Lebanese": "Libanais",
      "Branding": "Branding",
      "Pizza": "Pizza",
      "Web App": "Application web",
      "Catering": "Traiteur",
      "Chef / Catering": "Chef / Traiteur",
      "E-Commerce": "E-Commerce",
    },
  },
  pricingPage: {
    metaTitle: "Tarifs",
    metaDesc: "Tarifs transparents de SMK Web Design : packs Démarrage dès R1 500, sites Croissance R4 000–8 000, marques Premium dès R9 000. Paiement unique.",
    title: "Des tarifs directs. Aucun abonnement inutile.",
    lede: "Paiement unique en ZAR. EFT, SnapScan et carte acceptés. Sélectionnez une formule pour voir comment nous démarrerions.",
    groupLabel: "Formules tarifaires",
    popular: "Le plus populaire",
    bestForPrefix: "Idéal pour :",
    notSurePrefix: "Vous hésitez ? Écrivez-moi sur WhatsApp",
    notSureSuffix: ". Je vous oriente vers la bonne formule en un message.",
    summaryPrefix: "",
    waMessage: "Bonjour Stopher, je m'intéresse à la formule {package} ({cta}).",
    tiers: [
      {
        eyebrow: "Pack Démarrage",
        terms: "Paiement unique · commence immédiatement",
        features: [
          "Conception de logo (principal + 2 variantes)",
          "Rédaction de profil d'entreprise",
          "Design de cartes de visite",
          "Configuration Google Business",
          "Conseils en réseaux sociaux",
        ],
        bestFor: "nouvelles entreprises qui débutent en ligne",
        cta: "Commencer",
      },
      {
        eyebrow: "Croissance entreprise",
        terms: "Paiement unique · livraison sous 7–14 jours",
        features: [
          "Logo professionnel + kit de marque",
          "Site web 1–3 pages",
          "Design responsive mobile",
          "Configuration SEO de base",
          "Intégration formulaire de contact",
          "Configuration Google Business",
          "Design de cartes de visite",
        ],
        bestFor: "entreprises prêtes à se développer et à attirer des clients en ligne",
        cta: "Développer",
      },
      {
        eyebrow: "Marque Premium",
        terms: "Sur devis · calendrier personnalisé",
        features: [
          "Logo premium + kit de marque complet",
          "Site web complet (5+ pages)",
          "Optimisation SEO avancée",
          "Configuration Analytics & Tracking",
          "Kit de branding réseaux sociaux",
          "Google Business + SEO local",
          "Support continu (60 jours)",
        ],
        bestFor: "entreprises établies souhaitant une présence numérique dominante",
        cta: "Passer au Premium",
      },
    ],
  },
  contactPage: {
    metaTitle: "Contact",
    metaDesc: "Demandez un devis gratuit à SMK Web Design. WhatsApp +27 72 999 8863, email info@stopher-malik.co.za, ou formulaire de projet. Réponse sous 24 heures.",
    title: "Parlons de votre projet.",
    lede: "Envoyez le formulaire ci-dessous, ou passez directement par WhatsApp, c'est là que je réponds le plus vite.",
    whatsappCard: "WhatsApp · réponse la plus rapide",
    studio: "Studio",
    payments: "EFT · SnapScan · Carte acceptés (ZAR)",
    payment: {
      heading: "Options de paiement",
      body: "Choisissez le mode de paiement adapté à votre projet. Les tarifs sont en rands sud-africains.",
      eftTitle: "Virement bancaire (EFT)",
      eftBody: "Le travail commence sous 24 heures après réception du paiement.",
      bankLabel: "Banque",
      bank: "GoTyme Bank",
      accountNameLabel: "Titulaire",
      accountName: "SMK Web Design",
      accountNumberLabel: "Numéro de compte",
      accountNumber: "5300 2514 056",
      branchLabel: "Code agence",
      branch: "678910",
      referenceLabel: "Référence",
      reference: "Votre nom + service",
      proof: "Envoyez la preuve de paiement à info@stopher-malik.co.za ou sur WhatsApp.",
      alternativesHeading: "Autres moyens de paiement",
      alternatives: [
        {
          title: "Carte / PayFast",
          body: "Payez par carte bancaire via PayFast. Une confirmation est envoyée après le paiement.",
        },
        {
          title: "SnapScan",
          body: "Payez avec SnapScan ou votre application bancaire mobile. La confirmation est instantanée.",
        },
        {
          title: "PayPal",
          body: "Payez avec votre compte PayPal ou une carte bancaire.",
        },
      ],
    },
    form: {
      name: "Nom",
      namePlaceholder: "Votre nom",
      email: "Email",
      emailPlaceholder: "vous@entreprise.co.za",
      phone: "Téléphone / WhatsApp",
      phoneOptional: "(facultatif)",
      phonePlaceholder: "+27 ...",
      service: "De quoi avez-vous besoin ?",
      servicePlaceholder: "Demande générale",
      message: "Détails du projet",
      messagePlaceholder: "Parlez-moi de votre entreprise et de ce que le site doit faire pour vous...",
      submit: "Envoyer le message",
      sending: "Envoi…",
      successTitle: "Message envoyé",
      successBody: "Merci pour votre message. Je reviens vers vous sous 24 heures. Plus rapide ? WhatsApp.",
      whatsappCta: "M'écrire sur WhatsApp",
      legalNotice: {
        prefix: "En envoyant ce formulaire, vous acceptez les ",
        terms: "Conditions générales",
        middle: " et reconnaissez avoir lu la ",
        privacy: "Politique de confidentialité",
        suffix: ".",
      },
      errors: {
        name: "Veuillez saisir votre nom.",
        email: "Veuillez saisir une adresse email valide.",
        message: "Dites-m'en un peu plus sur votre projet.",
        send: "Échec de l'envoi. Essayez WhatsApp.",
        network: "Erreur réseau. Essayez WhatsApp.",
      },
    },
  },
  blogPage: {
    metaTitle: "Blog",
    metaDesc: "Guides web design et SEO pour les entreprises sud-africaines : conversion, SEO local, tarifs et stratégie de site par SMK Web Design, Johannesburg.",
    title: "Des guides qui aident votre site à vendre.",
    lede: "Des écrits pratiques sur le web design et le SEO pour les entrepreneurs sud-africains. Sans blabla, juste ce qui fait bouger classements et demandes.",
    enNotice: "Les articles sont actuellement publiés en anglais.",
    comingSoonTitle: "Articles en français bientôt disponibles",
    comingSoonBody: "Le blog est d'abord publié en anglais. Les traductions arriveront ici au cours du prochain trimestre.",
    readCta: "Lire l'article",
    ctaTitle: "Lire est la première étape.",
    ctaBody: "La deuxième, c'est un site qui vend vraiment. Ça, c'est moi qui le construis.",
    ctaButton: "Démarrer un projet",
  },
  blogPost: {
    backLabel: "Tous les articles",
    relatedLabel: "Poursuivre la lecture",
  },
  legal: {
    label: "Informations juridiques",
    effectiveLabel: "Date d'entrée en vigueur",
    effectiveDate: "15 septembre 2026",
    documents: {
      terms: {
        metaTitle: "Conditions générales",
        metaDesc: "Conditions applicables aux services web ponctuels et récurrents fournis par SMK Web Design en Afrique du Sud.",
        title: "Conditions générales",
        lede: "Ces conditions régissent les projets et services récurrents fournis par SMK Web Design.",
        sections: [
          {
            heading: "1. Champ d'application",
            paragraphs: [
              "SMK Web Design est exploité par Stopher Malik à Johannesburg, Gauteng, Afrique du Sud. Ces conditions s'appliquent lorsque vous demandez, approuvez ou payez nos services de web design, développement, identité visuelle, SEO, maintenance ou support.",
              "Votre devis, proposition, facture ou contrat de service accepté fait partie de ces conditions. En cas de contradiction, l'accord écrit propre au service concerné prévaut.",
            ],
          },
          {
            heading: "2. Étendue des services et modifications",
            paragraphs: [
              "L'étendue convenue précise les livrables, les étapes, les révisions incluses, le prix et le calendrier prévu. Tout travail supplémentaire doit être approuvé par écrit et peut faire l'objet d'un devis distinct.",
              "Nous pouvons recommander des modifications techniques nécessaires à la sécurité, l'accessibilité, la performance ou la compatibilité. Toute modification importante reste soumise à votre accord.",
            ],
          },
          {
            heading: "3. Prix et paiement",
            paragraphs: [
              "Les prix, acomptes, étapes et échéances figurent sur le devis ou la facture. Sauf indication contraire, les montants sont en rands sud-africains. Le travail peut commencer uniquement après réception du paiement ou de l'acompte convenu.",
              "Les paiements peuvent être effectués par EFT, SnapScan, PayPal ou un prestataire de carte tel que PayFast lorsqu'il est proposé. Chaque prestataire applique ses propres conditions. SMK Web Design ne reçoit ni ne conserve les données complètes de votre carte.",
              "Nous pouvons suspendre le travail ou retenir les livrables non publiés tant qu'une facture est en retard. Les travaux approuvés déjà réalisés et les coûts engagés pour votre projet restent dus.",
            ],
          },
          {
            heading: "4. Vos responsabilités",
            paragraphs: [
              "Vous devez fournir des instructions exactes, du contenu licite, les accès, les retours et les validations nécessaires. Vous confirmez avoir le droit d'utiliser chaque logo, image, marque et texte que vous fournissez.",
              "Un retard de contenu, de retour, d'accès ou de validation peut reporter la livraison. Nous ne répondons pas des retards causés par des éléments client manquants ou un service tiers indisponible.",
            ],
          },
          {
            heading: "5. Vérification, révisions et acceptation",
            paragraphs: [
              "Vous devez vérifier chaque étape remise et signaler rapidement les erreurs ou changements demandés. Les révisions sont limitées à celles prévues dans l'étendue convenue. Une nouvelle direction ou une demande après validation peut nécessiter un nouveau devis.",
              "Un livrable est accepté lorsque vous le validez par écrit, le publiez ou l'utilisez, ou réglez la facture finale sans signaler de défaut important.",
            ],
          },
          {
            heading: "6. Propriété et présentation du travail",
            paragraphs: [
              "Jusqu'au paiement intégral des factures concernées, les fichiers de travail et livrables non publiés restent la propriété de SMK Web Design. Après paiement complet, vous recevez les droits prévus dans la proposition sur les livrables personnalisés finaux.",
              "Les polices, images de stock, logiciels, thèmes, extensions et plateformes tiers restent soumis à leurs licences. Sauf confidentialité convenue par écrit, nous pouvons vous identifier comme client et présenter le travail terminé dans notre portfolio et notre communication.",
            ],
          },
          {
            heading: "7. Domaines, hébergement et services tiers",
            paragraphs: [
              "Les domaines, l'hébergement, l'email, les passerelles de paiement, les extensions et plateformes externes dépendent des conditions, tarifs et disponibilités de leurs fournisseurs. Vous êtes responsable des comptes et renouvellements enregistrés à votre nom, sauf accord contraire.",
              "Nous ne répondons pas d'une panne, modification de politique, suspension ou faille de sécurité d'un tiers hors de notre contrôle raisonnable. Nous vous assisterons dans la limite du support acheté.",
            ],
          },
          {
            heading: "8. Services ponctuels et récurrents",
            paragraphs: [
              "Un site ou un projet de design est ponctuel sauf si la proposition ou le contrat accepté prévoit expressément une facturation récurrente. La maintenance, l'hébergement, le support, le SEO ou un forfait récurrent sont facturés uniquement à la fréquence et au prix convenus par écrit.",
              "Vous pouvez résilier un service récurrent par écrit selon le préavis prévu dans son contrat. Sans préavis indiqué, la résiliation arrête le service futur après la période déjà payée. Le travail réalisé, la période en cours et les montants échus restent dus.",
            ],
          },
          {
            heading: "9. Résiliation et remboursements",
            paragraphs: [
              "Chaque partie peut mettre fin au service si l'autre commet un manquement important et ne le corrige pas après un délai écrit raisonnable. Nous pouvons suspendre ou arrêter immédiatement le travail en cas d'instruction illégale, d'abus, de risque de sécurité ou de non-paiement.",
              "Les annulations et demandes de remboursement du client suivent notre Politique de remboursement. Le travail terminé, le temps de production réservé et les frais tiers non remboursables restent dus.",
            ],
          },
          {
            heading: "10. Résultats, garanties et responsabilité",
            paragraphs: [
              "Nous fournissons nos services avec un soin et une compétence raisonnables. Les classements de recherche, demandes, ventes, validations de plateformes et la disponibilité continue de services tiers dépendent de facteurs hors de notre contrôle et ne sont pas garantis.",
              "Dans les limites permises par le droit sud-africain, aucune partie ne répond des pertes indirectes ou consécutives. Notre responsabilité totale est limitée au montant payé pour le service concerné. Rien dans ces conditions n'exclut un droit ou une responsabilité que la loi interdit d'exclure.",
            ],
          },
          {
            heading: "11. Droit sud-africain et contact",
            paragraphs: [
              "Ces conditions sont régies par le droit sud-africain. Avant toute procédure, les deux parties doivent tenter de bonne foi de résoudre le différend par écrit. Les tribunaux sud-africains sont compétents si aucun accord n'est trouvé.",
              "Nous pouvons modifier ces conditions pour les services futurs. La version acceptée avec un projet existant continue de s'appliquer, sauf modification convenue par écrit. Utilisez les coordonnées ci-dessous pour toute question ou notification.",
            ],
          },
        ],
      },
      privacy: {
        metaTitle: "Politique de confidentialité",
        metaDesc: "Traitement, utilisation, conservation et partage des données personnelles par SMK Web Design selon le droit sud-africain.",
        title: "Politique de confidentialité",
        lede: "Cette politique décrit les données personnelles que nous traitons et leur utilisation.",
        sections: [
          {
            heading: "1. Responsable du traitement",
            paragraphs: [
              "SMK Web Design, exploité par Stopher Malik à Johannesburg, Gauteng, Afrique du Sud, est responsable des données personnelles décrites ici. Nous traitons les données conformément au Protection of Personal Information Act, 2013 (POPIA) et aux autres lois applicables.",
            ],
          },
          {
            heading: "2. Données collectées",
            paragraphs: ["Nous recueillons les informations que vous fournissez et les données techniques limitées nécessaires au fonctionnement et à la sécurité du site."],
            items: [
              "Nom, adresse email, numéro de téléphone ou WhatsApp, service choisi et détails du projet envoyés par le formulaire de contact.",
              "Messages, propositions, validations, contrats, factures et échanges de support.",
              "Statut, montant, référence et données de transaction du prestataire de paiement, sans le numéro complet ni le code de sécurité de votre carte.",
              "Adresse IP, navigateur et données de requête que les fournisseurs d'hébergement ou de sécurité peuvent traiter dans leurs journaux.",
            ],
          },
          {
            heading: "3. Utilisation des données",
            paragraphs: ["Nous utilisons les données personnelles uniquement pour :"],
            items: [
              "Répondre aux demandes et préparer des devis.",
              "Fournir, gérer et soutenir les services convenus.",
              "Émettre les factures, confirmer les paiements et conserver les documents commerciaux requis.",
              "Protéger le site, prévenir les abus et résoudre les problèmes techniques.",
              "Respecter nos obligations légales et établir ou défendre des droits.",
            ],
          },
          {
            heading: "4. Formulaire de contact et paiements",
            paragraphs: [
              "Les demandes du formulaire passent par Web3Forms afin que nous puissions les recevoir. Si vous choisissez un moyen de paiement externe, son fournisseur, notamment PayFast, SnapScan, PayPal ou votre banque, traite les données selon sa propre politique de confidentialité.",
              "SMK Web Design ne recueille ni ne conserve les données complètes de carte. Les confirmations de paiement sont gardées uniquement le temps nécessaire à la comptabilité, au support et aux obligations légales.",
            ],
          },
          {
            heading: "5. Partage et prestataires",
            paragraphs: [
              "Nous ne vendons pas les données personnelles. Nous partageons uniquement les informations nécessaires avec les prestataires de formulaire, hébergement, sécurité, email, comptabilité et paiement, ou avec une autorité lorsque la loi l'exige.",
              "Ces prestataires agissent selon leurs conditions ou nos instructions et peuvent traiter les données hors d'Afrique du Sud. Nous prenons des mesures raisonnables pour choisir des prestataires qui protègent correctement les données.",
            ],
          },
          {
            heading: "6. Cookies et suivi",
            paragraphs: [
              "Ce site utilise le cookie fonctionnel smk-lang pour mémoriser votre langue pendant un an maximum. À la date d'entrée en vigueur ci-dessus, ce site n'utilise aucun cookie publicitaire, cookie d'analyse ni pixel de suivi comportemental.",
              "Les sites externes et prestataires de paiement peuvent déposer leurs propres cookies après que vous suivez un lien. Leurs notices s'appliquent à ces cookies.",
            ],
          },
          {
            heading: "7. Conservation et sécurité",
            paragraphs: [
              "Nous conservons les données uniquement pendant la durée nécessaire à leur objectif, à la relation client, aux obligations fiscales et comptables, au traitement d'un litige ou à une autre exigence légale. Elles sont ensuite supprimées, anonymisées ou archivées de manière appropriée.",
              "Nous appliquons des protections administratives et techniques raisonnables. Aucune transmission ni conservation sur internet n'est totalement sûre; une sécurité absolue ne peut donc pas être garantie.",
            ],
          },
          {
            heading: "8. Vos droits",
            paragraphs: [
              "Sous réserve de POPIA, vous pouvez demander si nous détenons vos données et en demander l'accès, la correction ou la suppression. Vous pouvez vous opposer à certains traitements, retirer votre consentement lorsque celui-ci sert de base, ou saisir l'Information Regulator d'Afrique du Sud.",
              "Envoyez votre demande aux coordonnées ci-dessous. Nous pouvons devoir vérifier votre identité et conserver certaines données lorsque la loi l'impose.",
            ],
          },
          {
            heading: "9. Enfants, liens et modifications",
            paragraphs: [
              "Nos services sont destinés aux clients professionnels et ne ciblent pas les enfants. Ce site peut renvoyer vers des sites externes qui gèrent leurs propres pratiques de confidentialité.",
              "Nous pouvons mettre à jour cette politique si nos services, prestataires ou obligations changent. La date d'entrée en vigueur identifie la dernière version publiée. Contactez-nous ci-dessous pour toute question ou demande liée à la confidentialité.",
            ],
          },
        ],
      },
      "refund-policy": {
        metaTitle: "Politique de remboursement",
        metaDesc: "Règles d'annulation et de remboursement des projets ponctuels et services récurrents de SMK Web Design.",
        title: "Politique de remboursement",
        lede: "Cette politique explique comment nous évaluons les annulations et remboursements.",
        sections: [
          {
            heading: "1. Champ d'application",
            paragraphs: [
              "Cette politique s'applique aux paiements effectués directement à SMK Web Design pour un projet ponctuel ou un service récurrent expressément convenu. Votre devis ou contrat accepté peut prévoir des conditions propres au service; elles prévalent lorsqu'elles sont licites.",
            ],
          },
          {
            heading: "2. Annulation avant le début du travail",
            paragraphs: [
              "Si vous annulez avant le début du travail, faites la demande par écrit. Nous remboursons le montant payé après déduction des frais non remboursables du prestataire de paiement et des achats tiers déjà engagés avec votre accord.",
              "Le travail commence dès le début de la recherche, planification, création, programmation, rédaction, configuration ou de toute autre tâche de production convenue, et non uniquement lors de la présentation d'une maquette.",
            ],
          },
          {
            heading: "3. Annulation après le début du travail",
            paragraphs: [
              "Si vous annulez après le début, nous calculons la valeur du travail réalisé, du temps de production réservé et des engagements tiers approuvés. Le solde prépayé restant est remboursé. Si le travail réalisé dépasse le paiement reçu, la différence reste due.",
              "Un acompte n'est pas automatiquement perdu, mais il est affecté en priorité au travail réalisé et aux coûts engagés. Le remboursement dépend du solde inutilisé après ce calcul.",
            ],
          },
          {
            heading: "4. Travail validé ou livré",
            paragraphs: [
              "Les paiements pour des étapes validées, des services terminés et des fichiers numériques livrés ne sont généralement pas remboursables une fois fournis comme convenu. Nous corrigerons d'abord tout défaut vérifié compris dans l'étendue convenue.",
              "Un changement de préférence, d'orientation commerciale ou de plateforme après validation ne rend pas le travail défectueux. Cela ne limite pas les droits accordés par le droit sud-africain de la consommation.",
            ],
          },
          {
            heading: "5. Services récurrents",
            paragraphs: [
              "La maintenance, l'hébergement, le support, le SEO ou les forfaits sont récurrents uniquement si cela a été convenu par écrit. La résiliation arrête les prochaines facturations selon le préavis contractuel, ou après la période payée en cours si aucun préavis n'est indiqué.",
              "La période en cours n'est pas remboursable lorsque le travail ou la disponibilité réservée a commencé. Si nous vous facturons après la prise d'effet d'une résiliation, nous remboursons le débit incorrect.",
            ],
          },
          {
            heading: "6. Frais tiers et frais de paiement",
            paragraphs: [
              "Les domaines, hébergements, licences, images de stock, extensions et autres achats tiers sont remboursables uniquement si leur fournisseur nous rembourse. Les frais de transaction ou de change conservés par PayFast, PayPal, une banque ou un autre prestataire peuvent être déduits lorsque la loi le permet.",
            ],
          },
          {
            heading: "7. Demander un remboursement",
            paragraphs: [
              "Envoyez votre demande par email avec votre nom, le numéro de facture, le service et le motif. Nous l'accusons réception sous deux jours ouvrables et rendons normalement une décision écrite sous sept jours ouvrables après réception des informations nécessaires.",
              "Un remboursement approuvé est envoyé, si possible, au moyen de paiement d'origine dans les dix jours ouvrables suivant l'accord. La banque ou le prestataire peut prendre plus de temps pour afficher les fonds. Nous confirmons l'envoi du remboursement.",
            ],
          },
          {
            heading: "8. Paiement en double ou incorrect",
            paragraphs: [
              "Prévenez-nous rapidement si vous avez payé deux fois, versé un montant incorrect ou ne reconnaissez pas un débit. Un paiement en double ou incorrect confirmé est remboursé intégralement, sous réserve d'une correction imposée par la loi ou le prestataire.",
            ],
          },
          {
            heading: "9. Litiges et droits légaux",
            paragraphs: [
              "Contactez-nous d'abord afin que nous examinions le dossier du projet et du paiement. Cette démarche ne supprime pas votre droit de contacter votre prestataire de paiement ou d'exercer un recours prévu par le droit sud-africain.",
              "Utilisez les coordonnées ci-dessous pour une annulation, une demande de remboursement ou une question sur cette politique.",
            ],
          },
        ],
      },
    },
  },
  footer: {
    blurb: "Des sites performants pour des entreprises en Afrique du Sud et ailleurs.",
    pages: "Pages",
    servicesCol: "Services",
    contactCol: "Contact",
    fastestReply: "Réponse la plus rapide",
    followUs: "Suivez-moi",
    builtWith: "Construit avec Next.js · Déployé sur Cloudflare",
    legal: "Mentions légales",
    terms: "Conditions",
    privacy: "Confidentialité",
    refunds: "Remboursements",
  },
  ctaBand: {
    title: "Un projet en tête ?",
    body: "Parlez-moi de votre entreprise. Je reviens vers vous avec un plan et une première maquette sous 48 heures.",
    secondaryLabel: "Voir mes réalisations",
  },
  globe: {
    captionIdle: "Touchez un repère : la géographie réelle des clients, sur quatre pays.",
    figAria: "Géographie des clients",
    markers: {
      "south-africa": {
        country: "Afrique du Sud",
        work: "Base : studio à Sandton. Design, développement et SEO pour les entreprises locales.",
      },
      "dr-congo": {
        country: "RD Congo",
        work: "Sites de restaurants et d'hôtellerie : Le Centre, Levante, Marché LT.",
      },
      "mozambique": {
        country: "Mozambique",
        work: "Sites d'hôtellerie et de tourisme pour des clients transfrontaliers.",
      },
      "canada": {
        country: "Canada",
        work: "E-commerce pour la diaspora africaine.",
      },
    },
  },
  notFound: {
    code: "404",
    title: "Cette page a pris un mauvais virage",
    body: "La page que vous cherchez n'existe pas, mais le retour est rapide.",
    home: "Retour à l'accueil",
    whatsapp: "M'écrire sur WhatsApp",
  },
  meta: {
    homeTitle: "SMK Web Design | Agence de Web Design à Johannesburg",
    homeDesc: "Créateur de sites web professionnel à Johannesburg. SMK Web Design conçoit des sites rapides, prêts pour le SEO, qui attirent des clients et stimulent la croissance. Devis gratuit.",
    templateSuffix: "%s | Stopher Malik · SMK Web Design",
    ogImageAlt: "SMK Web Design. Création de sites web professionnelle à Johannesburg, en Afrique du Sud.",
  },
  jsonld: {
    personDesc: "Stopher Malik est un créateur de sites web et développeur full-stack professionnel basé à Johannesburg, en Afrique du Sud, fondateur de SMK Web Design.",
    businessDesc: "SMK Web Design conçoit des sites rapides et orientés conversion pour des entreprises en Afrique du Sud, en RDC, au Mozambique et au Canada.",
  },
}

export default fr
