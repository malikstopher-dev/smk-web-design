export interface ProjectCopy {
  desc: string
  tags: Record<string, string>
}

export interface Dict {
  nav: {
    home: string
    about: string
    services: string
    work: string
    pricing: string
    blog: string
    contact: string
    letsTalk: string
    openMenu: string
    closeMenu: string
    menuLabel: string
  }
  langSwitcher: { label: string; aria: string }
  hero: {
    eyebrowRole: string
    eyebrowLocation: string
    tagline: string
    bio: string
    quoteCta: string
    workCta: string
    scroll: string
  }
  home: {
    featuredEyebrow: string
    featuredTitle: string
    allProjects: string
    servicesEyebrow: string
    servicesTitle: string
    bannerText: string
    ctaTitle: string
    ctaBody: string
  }
  viewLiveSite: string
  aboutPage: {
    metaTitle: string
    metaDesc: string
    title: string
    lede: string
    intro: string
    body: string
    factLineLead: string
    factLineRest: string
    portraitAlt: string
    locationCaption: string
    processHeading: string
    process: { title: string; body: string }[]
    testimonialsHeading: string
    testimonials: { quote: string; name: string; role: string }[]
    ctaTitle?: string
  }
  servicesPage: {
    metaTitle: string
    metaDesc: string
    title: string
    lede: string
    items: { title: string; short: string; description: string; points: string[] }[]
    discuss: string
  }
  workPage: {
    metaTitle: string
    metaDesc: string
    title: string
    lede: string
    filters: Record<string, string>
    projectsCount: { one: string; other: string }
    filterAria: string
    ctaTitle: string
    ctaBody: string
    cardAlt: string
    descs: Record<string, string>
    tagLabels: Record<string, string>
  }
  pricingPage: {
    metaTitle: string
    metaDesc: string
    title: string
    lede: string
    groupLabel: string
    popular: string
    bestForPrefix: string
    notSurePrefix: string
    notSureSuffix: string
    summaryPrefix?: string
    waMessage: string
    tiers: { eyebrow: string; terms: string; features: string[]; bestFor: string; cta: string }[]
  }
  contactPage: {
    metaTitle: string
    metaDesc: string
    title: string
    lede: string
    whatsappCard: string
    studio: string
    payments: string
    payment: {
      heading: string
      body: string
      eftTitle: string
      eftBody: string
      bankLabel: string
      bank: string
      accountNameLabel: string
      accountName: string
      accountNumberLabel: string
      accountNumber: string
      branchLabel: string
      branch: string
      referenceLabel: string
      reference: string
      proof: string
      alternativesHeading: string
      alternatives: { title: string; body: string }[]
    }
    form: {
      name: string
      namePlaceholder: string
      email: string
      emailPlaceholder: string
      phone: string
      phoneOptional: string
      phonePlaceholder: string
      service: string
      servicePlaceholder: string
      message: string
      messagePlaceholder: string
      submit: string
      sending: string
      successTitle: string
      successBody: string
      whatsappCta: string
      errors: { name: string; email: string; message: string; send: string; network: string }
    }
  }
  blogPage: {
    metaTitle: string
    metaDesc: string
    title: string
    lede: string
    enNotice: string
    comingSoonTitle: string
    comingSoonBody: string
    readCta: string
    ctaTitle: string
    ctaBody: string
    ctaButton: string
  }
  blogPost: {
    backLabel: string
    relatedLabel: string
  }
  footer: {
    blurb: string
    pages: string
    servicesCol: string
    contactCol: string
    fastestReply: string
    followUs: string
    builtWith: string
  }
  ctaBand: {
    title: string
    body: string
    secondaryLabel: string
  }
  globe: {
    captionIdle: string
    markers: Record<string, { country: string; work: string }>
    figAria: string
  }
  notFound: {
    code: string
    title: string
    body: string
    home: string
    whatsapp: string
  }
  meta: {
    homeTitle: string
    homeDesc: string
    templateSuffix: string
    ogImageAlt: string
  }
  jsonld: {
    personDesc: string
    businessDesc: string
  }
}
