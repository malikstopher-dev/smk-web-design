import type { Dict } from "@/i18n/types"

export const en: Dict = {
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    work: "Work",
    pricing: "Pricing",
    blog: "Blog",
    contact: "Contact",
    letsTalk: "Let's Talk",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuLabel: "Site navigation",
  },
  langSwitcher: { label: "Language", aria: "Language" },
  hero: {
    eyebrowRole: "Web Designer & Developer",
    eyebrowLocation: "Johannesburg, South Africa",
    tagline: "Website Design. Built to Win Clients.",
    bio: "I help businesses in South Africa, Democratic Republic of the Congo, Mozambique, Canada, and beyond with high-performing websites that rank on Google and turn visitors into paying customers.",
    quoteCta: "Get a Free Quote",
    workCta: "View My Work",
    scroll: "Scroll",
  },
  home: {
    featuredEyebrow: "Selected work",
    featuredTitle: "Sites that pull their weight",
    allProjects: "All projects",
    servicesEyebrow: "Services",
    servicesTitle: "Everything your site needs to win",
    bannerText: "SMK Web Design",
    ctaTitle: "Have a project in mind?",
    ctaBody: "Tell me about your business. I'll come back with a plan and a first draft within 48 hours.",
  },
  viewLiveSite: "View live site",
  viewProject: "View project",
  aboutPage: {
    metaTitle: "About",
    metaDesc: "Stopher Malik is a web designer and full-stack developer in Sandton, Johannesburg, and the founder of SMK Web Design. He builds high-converting websites across South Africa, DRC, Mozambique and Canada.",
    title: "Design that answers one question: will this win clients?",
    lede: "Web designer and developer. Sandton, Johannesburg.",
    intro: "I'm Stopher Malik, a web designer and full-stack developer, founder of SMK Web Design, working out of Paulshof, Sandton.",
    body: "I help businesses in South Africa, Democratic Republic of the Congo, Mozambique, Canada, and beyond with high-performing websites that rank on Google and turn visitors into paying customers. I design systems that attract, engage, and convert.",
    factLineLead: "Based in Sandton, working with clients in Johannesburg, Kinshasa, Maputo and Montreal.",
    factLineRest: "Twenty-two live sites, last one launched this quarter.",
    portraitAlt: "Stopher Malik, web designer in Johannesburg",
    locationCaption: "location.on.street",
    processHeading: "How a project runs",
    process: [
      {
        title: "Discovery call",
        body: "30 min, WhatsApp or phone. We map your goals and what 'working' looks like.",
      },
      {
        title: "First draft in 48h",
        body: "Real layout, real copy. Not a mood board.",
      },
      {
        title: "Build & refine",
        body: "You review on your own phone. We adjust until it converts.",
      },
      {
        title: "Launch & rank",
        body: "Deployed to edge hosting. SEO, analytics and Google Business live on day one.",
      },
    ],
    testimonialsHeading: "What clients say",
    testimonials: [
      {
        quote: "Stopher delivered our website in record time and it looked absolutely amazing. We've been getting enquiries ever since we launched. Would highly recommend to any business owner.",
        name: "Salem Home Innovation",
        role: "Home Services, Johannesburg",
      },
      {
        quote: "Stopher criou um site profissional, limpo e fácil de entender para o nosso negócio. O trabalho ficou bem organizado, moderno e ajudou a apresentar melhor os nossos serviços aos clientes.",
        name: "JMOTO Electrical",
        role: "Serviços Elétricos, Gauteng",
      },
      {
        quote: "Professional, fast, and understood exactly what we needed. Our restaurant site has made bookings so much easier. Very pleased with the result and the whole experience.",
        name: "101 On Fraser",
        role: "Restaurant, Johannesburg",
      },
      {
        quote: "From zero online presence to qualified leads every day. The SEO work alone has been worth every rand. Highly recommend SMK.",
        name: "John K.",
        role: "Solar Company Director",
      },
    ],
  },
  servicesPage: {
    metaTitle: "Services",
    metaDesc: "Website design, full-stack development, SEO & performance, cloud deployment, UI/UX and branding: web design services for Johannesburg businesses and beyond.",
    title: "Six disciplines, one outcome: a website that wins clients.",
    lede: "Every build ships with the fundamentals handled: speed, structure, search. Pick what you need below; most projects combine three or four.",
    items: [
      {
        title: "Website Design",
        short: "Mobile-first sites. Average Lighthouse mobile score: 97.",
        description:
          "Hand-built sites for South African businesses. Mobile-first, fast to load on 3G, easy for you to edit, structured around the call you want to receive.",
        points: ["Custom design, no templates", "Conversion-focused layouts", "Mobile-first responsive build", "Copy structure that sells"],
      },
      {
        title: "Full-Stack Development",
        short: "Next.js apps, Node APIs, PostgreSQL. Ship in 14 days.",
        description:
          "Next.js apps and Node.js services with a clean data layer. Bookings, dashboards, e-commerce backends — production code, not prototypes.",
        points: ["Next.js & React apps", "Node.js APIs & integrations", "PostgreSQL / MongoDB data layers", "TypeScript end-to-end"],
      },
      {
        title: "SEO & Performance",
        short: "Local SEO for Gauteng. Google Business Profile on every build.",
        description:
          "Local search and Core Web Vitals, set up correctly from day one. Schema markup, sitemap, Search Console, and a real Google Business Profile — not just a mention.",
        points: ["Local SEO for Gauteng searches", "Structured data / schema", "Core Web Vitals optimisation", "Analytics & Search Console"],
      },
      {
        title: "Cloud Deployment",
        short: "Edge hosting. TTFB under 200ms in Joburg and Kinshasa.",
        description:
          "Cloudflare Pages, Vercel, and AWS setup, with domains, DNS, SSL and uptime monitoring wired in. CI on push, no manual deploys.",
        points: ["Cloudflare Pages & Workers", "Vercel deployments", "Domains, DNS & SSL", "Uptime monitoring"],
      },
      {
        title: "UI/UX Design",
        short: "Wireframes, flows, design tokens. Figma-ready, hand-off clean.",
        description:
          "Figma wireframes, component libraries, and user flows you can actually build from. Accessibility-minded; mobile-first; tested against how your customers decide.",
        points: ["User flows & wireframes", "Design systems & tokens", "Accessibility (WCAG-minded)", "Prototype validation"],
      },
      {
        title: "Branding & Identity",
        short: "Logos, colour, type. Files in every format you'll need.",
        description:
          "Primary logo, two variants, a colour system, a type pair, business card and social kit. Files delivered as SVG, PNG and PDF.",
        points: ["Logo + variants", "Colour & type systems", "Business card design", "Social media kit"],
      },
    ],
    discuss: "Discuss this service",
  },
  workPage: {
    metaTitle: "Work",
    metaDesc: "Portfolio of websites by Stopher Malik at SMK Web Design. Restaurants, home services, e-commerce and web apps for clients across South Africa and the DRC.",
    title: "Twenty projects. Real businesses, real results.",
    lede: "From Johannesburg restaurants to Kinshasa lounges. Every site below is live, fast, and built to convert.",
    filters: {
      all: "All",
      restaurant: "Restaurants",
      business: "Home Services",
      construction: "Construction",
      ecommerce: "E-Commerce",
      travel: "Travel",
      webapp: "Web Apps",
    },
    
    projectsCount: { one: "{n} project", other: "{n} projects" },
    cardAlt: "{name} website",
    filterAria: "Filter projects by category",
    ctaTitle: "Your project could be next",
    ctaBody: "Every site in this grid started with a free WhatsApp conversation. Send yours.",
    
    descs: {},
    tagLabels: {},
  },
  pricingPage: {
    metaTitle: "Pricing",
    metaDesc: "Transparent web design pricing from SMK Web Design: Starter packages from R1,500, Growth sites R4,000–8,000, Premium brands from R9,000. One-time payment.",
    title: "Straight pricing. No retainers you don't need.",
    lede: "One-time payments in ZAR. EFT, SnapScan and card accepted. Select a package to see how we'd start.",
    groupLabel: "Pricing packages",
    popular: "Most Popular",
    bestForPrefix: "Best for:",
    notSurePrefix: "Not sure which fits? WhatsApp",
    notSureSuffix: ". I'll point you to the right package in one message.",
    summaryPrefix: "",
    waMessage: "Hi Stopher, I'm interested in the {package} package ({cta}).",
    tiers: [
      {
        eyebrow: "Starter Package",
        terms: "One-time payment · starts immediately",
        features: [
          "Logo Design (primary + 2 variants)",
          "Business Profile Copywriting",
          "Business Card Design",
          "Google Business Setup",
          "Social Media Guidance",
        ],
        bestFor: "New businesses getting started online",
        cta: "Get Started",
      },
      {
        eyebrow: "Business Growth",
        terms: "One-time payment · delivery in 7–14 days",
        features: [
          "Professional Logo + Brand Kit",
          "1–3 Page Website",
          "Mobile-Responsive Design",
          "Basic SEO Setup",
          "Contact Form Integration",
          "Google Business Setup",
          "Business Card Design",
        ],
        bestFor: "Businesses ready to grow and attract clients online",
        cta: "Start Growing",
      },
      {
        eyebrow: "Premium Brand",
        terms: "Project-based · custom timeline",
        features: [
          "Premium Logo + Full Brand Kit",
          "Full Website (5+ pages)",
          "Advanced SEO Optimisation",
          "Analytics & Tracking Setup",
          "Social Media Branding Kit",
          "Google Business + Local SEO",
          "Ongoing Support (60 days)",
        ],
        bestFor: "Established businesses wanting a dominant digital presence",
        cta: "Go Premium",
      },
    ],
  },
  contactPage: {
    metaTitle: "Contact",
    metaDesc: "Get a free quote from SMK Web Design. WhatsApp +27 72 999 8863, email info@stopher-malik.com, or send the project form. Replies within 24 hours.",
    title: "Let's talk about your project.",
    lede: "Send the form below, or skip the queue on WhatsApp, that's where I reply fastest.",
    whatsappCard: "WhatsApp · fastest reply",
    studio: "Studio",
    payments: "EFT · SnapScan · Card accepted (ZAR)",
    payment: {
      heading: "Payment options",
      body: "Choose the payment method that suits your project. All prices are in South African rand.",
      eftTitle: "Bank transfer (EFT)",
      eftBody: "Work begins within 24 hours of payment reflecting.",
      bankLabel: "Bank",
      bank: "GoTyme Bank",
      accountNameLabel: "Account name",
      accountName: "SMK Web Design",
      accountNumberLabel: "Account number",
      accountNumber: "5300 2514 056",
      branchLabel: "Branch code",
      branch: "678910",
      referenceLabel: "Reference",
      reference: "Your name + service",
      proof: "Send proof of payment to info@stopher-malik.com or WhatsApp.",
      alternativesHeading: "Other ways to pay",
      alternatives: [
        {
          title: "Card / PayFast",
          body: "Pay by credit or debit card through PayFast. Confirmation is sent after payment.",
        },
        {
          title: "SnapScan",
          body: "Pay with SnapScan or your mobile banking app. Confirmation is instant.",
        },
        {
          title: "PayPal",
          body: "Pay through PayPal using your account or a credit or debit card.",
        },
      ],
    },
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@company.co.za",
      phone: "Phone / WhatsApp",
      phoneOptional: "(optional)",
      phonePlaceholder: "+27 ...",
      service: "What do you need?",
      servicePlaceholder: "General enquiry",
      message: "Project details",
      messagePlaceholder: "Tell me about your business and what you need the website to do...",
      submit: "Send message",
      sending: "Sending…",
      successTitle: "Message sent",
      successBody: "Thanks for reaching out. I'll get back to you within 24 hours. Need a faster answer? WhatsApp is best.",
      whatsappCta: "WhatsApp me",
      legalNotice: {
        prefix: "By sending this form, you agree to the ",
        terms: "Terms and Conditions",
        middle: " and acknowledge the ",
        privacy: "Privacy Policy",
        suffix: ".",
      },
      errors: {
        name: "Please enter your name.",
        email: "Please enter a valid email address.",
        message: "Please tell me a little more about your project.",
        send: "Message failed to send. Please try WhatsApp instead.",
        network: "Network error. Please try WhatsApp instead.",
      },
    },
  },
  blogPage: {
    metaTitle: "Blog",
    metaDesc: "Web design and SEO guides for South African businesses: conversion, local SEO, pricing, and website strategy from SMK Web Design, Johannesburg.",
    title: "Guides that help your website sell.",
    lede: "Practical web design and SEO writing for South African business owners. No fluff, just what moves rankings and enquiries.",
    enNotice: "Articles are currently published in English.",
    comingSoonTitle: "French & Portuguese articles coming soon",
    comingSoonBody: "The blog is published in English first. Translated articles land here over the next quarter.",
    readCta: "Read article",
    ctaTitle: "Reading about it is step one.",
    ctaBody: "Step two is a website that actually does the selling. That part I build for you.",
    ctaButton: "Start a project",
  },
  blogPost: {
    backLabel: "All articles",
    relatedLabel: "Keep reading",
  },
  legal: {
    label: "Legal information",
    effectiveLabel: "Effective date",
    effectiveDate: "15 September 2026",
    documents: {
      terms: {
        metaTitle: "Terms and Conditions",
        metaDesc: "Terms governing web design, development and recurring services supplied by SMK Web Design in South Africa.",
        title: "Terms and Conditions",
        lede: "These terms govern project work and recurring services supplied by SMK Web Design.",
        sections: [
          {
            heading: "1. Who these terms apply to",
            paragraphs: [
              "SMK Web Design is operated by Stopher Malik in Johannesburg, Gauteng, South Africa. These terms apply when you request, approve or pay for our web design, development, branding, SEO, maintenance or support services.",
              "Your accepted quote, proposal, invoice or written service agreement forms part of these terms. If they conflict, the specific written agreement takes priority for that service.",
            ],
          },
          {
            heading: "2. Scope and changes",
            paragraphs: [
              "The agreed scope states the deliverables, project stages, included revisions, price and expected timing. Work outside that scope requires written approval and may be quoted separately.",
              "We may recommend technical changes where they are needed for security, accessibility, performance or platform compatibility. Material changes still require your approval.",
            ],
          },
          {
            heading: "3. Prices and payment",
            paragraphs: [
              "Prices, deposits, milestones and due dates are stated in the relevant quote or invoice. Unless stated otherwise, amounts are in South African rand. Work may start only after an agreed deposit or payment has cleared.",
              "Payments may be accepted by EFT, SnapScan, PayPal or a card payment provider such as PayFast when offered. Payment providers apply their own terms. SMK Web Design does not receive or store your full card details.",
              "We may pause work or withhold unpublished deliverables while an invoice is overdue. You remain responsible for approved work already completed and costs committed for your project.",
            ],
          },
          {
            heading: "4. Your responsibilities",
            paragraphs: [
              "You must provide accurate instructions, lawful content, access credentials, feedback and approvals reasonably needed to complete the work. You confirm that you have permission to use every logo, image, trade mark and text you supply.",
              "Late content, feedback, access or approval may move the delivery date. We are not responsible for delays caused by missing client material or unavailable third-party services.",
            ],
          },
          {
            heading: "5. Review, revisions and acceptance",
            paragraphs: [
              "You must review each submitted stage and identify errors or requested changes promptly. Revisions are limited to those included in the agreed scope. New directions or work requested after approval may require a new quote.",
              "A deliverable is accepted when you approve it in writing, publish or use it, or pay the final invoice without reporting a material defect.",
            ],
          },
          {
            heading: "6. Ownership and portfolio use",
            paragraphs: [
              "Until all related invoices are paid, working files and unpublished deliverables remain the property of SMK Web Design. After full payment, you receive the rights stated in the proposal to the final custom deliverables.",
              "Third-party fonts, stock assets, software, themes, plugins and platforms remain subject to their own licences. Unless confidentiality was agreed in writing, we may identify you as a client and show completed work in our portfolio and marketing.",
            ],
          },
          {
            heading: "7. Domains, hosting and third-party services",
            paragraphs: [
              "Domains, hosting, email, payment gateways, plugins and external platforms are supplied under their providers' terms, prices and availability. You are responsible for accounts and renewal charges registered in your name unless our agreement says otherwise.",
              "We are not liable for a third-party outage, policy change, suspension or security incident outside our reasonable control, but we will assist within the support scope you purchased.",
            ],
          },
          {
            heading: "8. Once-off and recurring services",
            paragraphs: [
              "A website or design project is once-off unless the accepted proposal or service agreement expressly describes recurring billing. Maintenance, hosting, support, SEO or retainers may recur only at the frequency and price agreed in writing.",
              "You may cancel a recurring service in writing under the notice period in its agreement. If no notice period is stated, cancellation stops future service after the current paid period. Work completed, the current service period and amounts already due remain payable.",
            ],
          },
          {
            heading: "9. Cancellation and refunds",
            paragraphs: [
              "Either party may end a service if the other commits a material breach and does not correct it after reasonable written notice. We may suspend or end work immediately for unlawful instructions, abuse, security risk or non-payment.",
              "Client cancellations and refund requests are handled under our Refund Policy. Payment remains due for completed work, reserved production time and non-refundable third-party costs.",
            ],
          },
          {
            heading: "10. Results, warranties and liability",
            paragraphs: [
              "We provide services with reasonable care and skill. Search rankings, enquiries, sales, platform approval and uninterrupted third-party uptime depend on factors outside our control and are not guaranteed.",
              "To the extent permitted by South African law, neither party is liable for indirect or consequential loss. Our total liability for a claim is limited to the amount you paid for the affected service. Nothing in these terms excludes rights or liability that the law does not allow us to exclude.",
            ],
          },
          {
            heading: "11. South African law and contact",
            paragraphs: [
              "These terms are governed by South African law. Before starting formal proceedings, both parties must try in good faith to resolve a dispute in writing. South African courts have jurisdiction if the dispute remains unresolved.",
              "We may update these terms for future services. The version accepted with an existing project continues to govern that project unless a change is agreed in writing. Use the contact details below for questions or notices.",
            ],
          },
        ],
      },
      privacy: {
        metaTitle: "Privacy Policy",
        metaDesc: "How SMK Web Design collects, uses, stores and shares personal information under South African privacy law.",
        title: "Privacy Policy",
        lede: "This policy explains what personal information we handle and why we need it.",
        sections: [
          {
            heading: "1. Responsible party",
            paragraphs: [
              "SMK Web Design, operated by Stopher Malik in Johannesburg, Gauteng, South Africa, is responsible for the personal information described in this policy. We process information under the Protection of Personal Information Act, 2013 (POPIA) and other applicable law.",
            ],
          },
          {
            heading: "2. Information we collect",
            paragraphs: ["We collect information that you provide directly and limited technical information needed to deliver and secure the website."],
            items: [
              "Name, email address, phone or WhatsApp number, service selection and project details submitted through the contact form.",
              "Messages, proposals, approvals, contracts, invoices and support correspondence.",
              "Payment status, amount, reference and provider transaction details, but not your full card number or security code.",
              "IP address, browser and request data that hosting or security providers may process in server logs.",
            ],
          },
          {
            heading: "3. How we use information",
            paragraphs: ["We use personal information only where needed to:"],
            items: [
              "Respond to enquiries and prepare quotes.",
              "Deliver, manage and support agreed services.",
              "Issue invoices, confirm payments and keep required business records.",
              "Protect the website, prevent abuse and resolve technical problems.",
              "Meet legal obligations and establish or defend legal claims.",
            ],
          },
          {
            heading: "4. Contact forms and payment providers",
            paragraphs: [
              "Contact-form submissions are transmitted through Web3Forms so that we can receive your enquiry. When you choose an external payment method, the relevant provider, such as PayFast, SnapScan, PayPal or your bank, processes payment information under its own privacy policy.",
              "SMK Web Design does not collect or store full card credentials. Keep payment confirmation messages only as long as needed for accounting, support and legal records.",
            ],
          },
          {
            heading: "5. Sharing and service providers",
            paragraphs: [
              "We do not sell personal information. We may share only the information necessary with providers that support contact forms, hosting, security, email, accounting and payment processing, or with authorities where the law requires it.",
              "Providers act under their own terms or our instructions and may process information outside South Africa. We take reasonable steps to use providers that protect information appropriately.",
            ],
          },
          {
            heading: "6. Cookies and tracking",
            paragraphs: [
              "This website uses the functional smk-lang cookie to remember your language choice for up to one year. At the effective date above, we do not use advertising cookies, analytics cookies or behavioural tracking pixels on this website.",
              "External websites and payment providers may set their own cookies after you follow a link. Their notices govern those cookies.",
            ],
          },
          {
            heading: "7. Retention and security",
            paragraphs: [
              "We keep personal information only for as long as needed for the purpose collected, an active client relationship, tax and accounting duties, dispute handling or another legal requirement. We then delete, anonymise or securely archive it where appropriate.",
              "We use reasonable administrative and technical safeguards. No internet transmission or storage method is completely secure, so absolute security cannot be promised.",
            ],
          },
          {
            heading: "8. Your rights",
            paragraphs: [
              "Subject to POPIA, you may ask whether we hold your information and request access, correction or deletion. You may object to certain processing, withdraw consent where processing relies on consent, or complain to South Africa's Information Regulator.",
              "Send a request using the contact details below. We may need to verify your identity and may retain information where law requires it.",
            ],
          },
          {
            heading: "9. Children, links and policy changes",
            paragraphs: [
              "Our services are intended for business clients and are not directed at children. This website may link to external sites that control their own privacy practices.",
              "We may update this policy when our services, providers or legal duties change. The effective date shows the latest published version. Contact us below with privacy questions or requests.",
            ],
          },
        ],
      },
      "refund-policy": {
        metaTitle: "Refund Policy",
        metaDesc: "Cancellation and refund rules for once-off projects and recurring services supplied by SMK Web Design.",
        title: "Refund Policy",
        lede: "This policy explains how cancellations and refund requests are assessed.",
        sections: [
          {
            heading: "1. Scope",
            paragraphs: [
              "This policy applies to payments made directly to SMK Web Design for once-off projects and expressly agreed recurring services. Your accepted quote or service agreement may include service-specific cancellation terms; those terms take priority where they are lawful.",
            ],
          },
          {
            heading: "2. Cancellation before work starts",
            paragraphs: [
              "If you cancel before work starts, request the cancellation in writing. We will refund the amount paid after deducting non-refundable payment-provider charges and third-party costs already committed with your approval.",
              "Work starts when research, planning, design, development, content work, setup or another agreed production task begins, not only when a draft is shown.",
            ],
          },
          {
            heading: "3. Cancellation after work starts",
            paragraphs: [
              "If you cancel after work starts, we calculate the value of work completed, production time reserved and approved third-party commitments. Any remaining prepaid balance will be refunded. If completed work exceeds the amount paid, the balance remains due.",
              "Deposits are not automatically forfeited, but they are applied first to completed work and committed costs. A refund depends on the unused balance after that calculation.",
            ],
          },
          {
            heading: "4. Approved or delivered work",
            paragraphs: [
              "Payments for approved milestones, completed services and delivered digital files are generally not refundable once supplied as agreed. We will correct a verified defect that falls within the agreed scope before considering a refund.",
              "A change of preference, business direction or platform after approval does not make completed work defective. This does not limit rights that South African consumer law gives you.",
            ],
          },
          {
            heading: "5. Recurring services",
            paragraphs: [
              "Maintenance, hosting, support, SEO or retainers recur only where agreed in writing. Cancellation stops future billing under the notice period in that agreement, or after the current paid period if no notice period is stated.",
              "The current period is not refundable once its work or reserved availability has started. If we charge you after a cancellation became effective, we will refund the incorrect charge.",
            ],
          },
          {
            heading: "6. Third-party and payment fees",
            paragraphs: [
              "Domain registrations, hosting, licences, stock assets, plugins and other third-party purchases are refundable only if the supplier refunds us. Transaction or currency-conversion charges retained by PayFast, PayPal, a bank or another provider may be deducted where permitted by law.",
            ],
          },
          {
            heading: "7. How to request a refund",
            paragraphs: [
              "Email your request with your name, invoice number, service and reason. We will acknowledge it within two business days and normally give a written decision within seven business days after receiving the information needed to assess it.",
              "Approved refunds are submitted to the original payment method where practical within ten business days of approval. Banks and payment providers may take additional time to reflect the funds. We will provide confirmation when the refund is submitted.",
            ],
          },
          {
            heading: "8. Duplicate or incorrect payments",
            paragraphs: [
              "Tell us promptly if you paid twice, paid the wrong amount or do not recognise a charge. A verified duplicate or incorrect charge will be refunded in full, subject only to any correction required by law or the payment provider.",
            ],
          },
          {
            heading: "9. Disputes and statutory rights",
            paragraphs: [
              "Contact us first so that we can investigate the project record and payment. This request does not remove your right to contact your payment provider or exercise any remedy available under South African law.",
              "Use the details below for cancellations, refund requests or questions about this policy.",
            ],
          },
        ],
      },
    },
  },
  footer: {
    blurb: "High-performing websites for businesses across South Africa and beyond.",
    pages: "Pages",
    servicesCol: "Services",
    contactCol: "Contact",
    fastestReply: "Fastest reply",
    followUs: "Follow",
    builtWith: "Built with Next.js · Deployed on Cloudflare",
    legal: "Legal",
    terms: "Terms",
    privacy: "Privacy",
    refunds: "Refunds",
  },
  ctaBand: {
    title: "Have a project in mind?",
    body: "Tell me about your business. I'll come back with a plan and a first draft within 48 hours.",
    secondaryLabel: "See my work",
  },
  globe: {
    captionIdle: "Tap a marker: real client geography across four countries.",
    figAria: "Client geography",
    markers: {},
  },
  notFound: {
    code: "404",
    title: "This page took a wrong turn",
    body: "The page you're looking for doesn't exist, but the way back is quick.",
    home: "Back home",
    whatsapp: "WhatsApp me",
  },
  meta: {
    homeTitle: "SMK Web Design | Web Design Agency Johannesburg",
    homeDesc: "Professional web designer in Johannesburg. SMK Web Design builds fast, SEO-ready websites that attract clients and drive growth. Free quote.",
    templateSuffix: "%s | Stopher Malik · SMK Web Design",
    ogImageAlt: "SMK Web Design. Professional Website Design in Johannesburg, South Africa.",
  },
  jsonld: {
    personDesc: "Stopher Malik is a professional web designer and full-stack developer based in Johannesburg, South Africa, founder of SMK Web Design.",
    businessDesc: "SMK Web Design builds fast, conversion-focused websites for businesses in South Africa, DRC, Mozambique and Canada.",
  },
}

export default en
