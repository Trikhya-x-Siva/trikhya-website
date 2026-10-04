/** Privacy policy, cookie notice and terms of use. Plain-English, written for a static marketing site.
 *  Placeholders: registered address and the data-protection contact are confirmed by the founders. */

export type LegalSection = { id: string; title: string; paras?: string[]; items?: string[]; after?: string[] };
export type LegalDoc = { slug: string; title: string; lead: string; updated: string; sections: LegalSection[] };

export const PRIVACY_EMAIL = "privacy@trikhya.ai";
export const COMPANY = "Trikhya Intelligence Foundry";

export const PRIVACY: LegalDoc = {
  slug: "privacy",
  title: "Privacy policy",
  lead: "What we collect when you use this website or write to us, why we collect it, and the choices you have.",
  updated: "2026-10-04",
  sections: [
    {
      id: "who",
      title: "Who we are",
      paras: [
        `${COMPANY} (“Trikhya”, “we”, “us”) is an AI engineering company based in Chennai, India. We are the data controller for the personal data described on this page. You can reach the person responsible for data protection at ${PRIVACY_EMAIL}.`,
      ],
    },
    {
      id: "what",
      title: "What we collect",
      paras: ["We collect only what you give us and the minimum this website needs to work."],
      items: [
        "Contact form and email: your name, work email, company, and whatever you write in the message. We use it to answer your enquiry and, if you ask us to, to follow up about working together.",
        "Job applications: your name, contact details, CV and anything else you choose to send. We use it to assess your application for the role you applied to.",
        "Godseye assistant: the questions you type into the on-page assistant are answered in your browser from a fixed set of responses. They are not sent to us or to any third party and are not stored after you close the page.",
        "Usage measurement: we record, ourselves, which pages are viewed, how long they are read, and which links and buttons are clicked. Each visit is identified only by a random id that lasts for the browser tab. We do not use Google Analytics or any advertising tracker, and nothing is shared with third parties.",
        "Technical data: our hosting provider records standard server logs (IP address, browser type, pages requested, time) to serve the site and keep it secure.",
      ],
    },
    {
      id: "why",
      title: "Why we are allowed to use it",
      items: [
        "To respond to your enquiry or application, because you asked us to (performance of steps before a contract).",
        "To keep the website running and secure, because we have a legitimate interest in doing so.",
        "For anything beyond this, only with your consent, which you can withdraw at any time by writing to us.",
      ],
    },
    {
      id: "share",
      title: "Who we share it with",
      paras: ["We do not sell personal data and we do not share it for advertising. We share it only with the providers we need to operate:"],
      items: [
        "Website hosting (GitHub Pages) for serving the site and its logs.",
        "Email provider for receiving and replying to your messages.",
        "Professional advisers or authorities where the law requires it.",
      ],
      after: ["Some of these providers process data outside India. Where they do, we rely on their standard contractual safeguards."],
    },
    {
      id: "keep",
      title: "How long we keep it",
      items: [
        "Enquiries: for as long as the conversation is live and up to 24 months afterwards, so we can pick it up if you come back.",
        "Job applications: up to 12 months after the role closes, unless you ask us to delete them sooner or you join us.",
        "Server logs: rotated by the hosting provider on a short cycle, typically within 90 days.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and local storage",
      paras: [
        "This website sets no advertising cookies and loads no third-party analytics. Usage is measured by our own code and stored in our own database. The browser storage involved is:",
      ],
      items: [
        "trikhya-consent (local storage): records the choice you made in the cookie notice so we do not ask again. Kept for 12 months.",
        "trikhya-session (session storage): a random id for the current browser tab so that page views in one visit can be counted together. Gone when the tab closes.",
        "trikhya-visitor (local storage): set only if you chose “Accept”. A random id that lets us recognise a returning browser. Kept for 12 months and never linked to your name or email.",
        "trikhya-wipe (session storage): tells the next page that a page transition is in progress so the animation plays once. Cleared immediately on arrival.",
        "trikhya-motion (local storage): an optional setting that switches the site to reduced motion. Only present if you set it.",
      ],
      after: [
        "Choosing “Essential only” keeps every visit anonymous: pages and clicks are still counted, but nothing connects one visit to the next. Choosing “Accept” additionally sets the returning-visitor id described above.",
        "You can clear all of this at any time from your browser settings, or reopen the notice from the “Cookies” link in the footer.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paras: ["Depending on where you live, you may have the right to:"],
      items: [
        "Ask for a copy of the personal data we hold about you.",
        "Ask us to correct or delete it.",
        "Object to, or ask us to restrict, how we use it.",
        "Withdraw consent where we rely on it.",
        "Complain to your local data-protection authority.",
      ],
      after: [`Write to ${PRIVACY_EMAIL} and we will respond within 30 days. We may ask you to confirm your identity first.`],
    },
    {
      id: "security",
      title: "Security",
      paras: ["The site is served over HTTPS. Enquiries and applications are kept in access-controlled mailboxes and systems available only to the people who need them to reply to you."],
    },
    {
      id: "children",
      title: "Children",
      paras: ["This website is for businesses and job seekers. We do not knowingly collect personal data from anyone under 18."],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paras: ["When we change this page we update the date at the top. If a change affects how we use data you have already given us, we will tell you by email where we can."],
    },
  ],
};

export const TERMS: LegalDoc = {
  slug: "terms",
  title: "Terms of use",
  lead: "The ground rules for using this website. Work we do for clients is governed by a separate written agreement.",
  updated: "2026-10-04",
  sections: [
    {
      id: "scope",
      title: "What these terms cover",
      paras: [`These terms apply to your use of the ${COMPANY} website. By using the site you agree to them. They do not cover any services we provide to clients, which are set out in a separate agreement with that client.`],
    },
    {
      id: "content",
      title: "Our content",
      paras: [
        "Everything on this site, including text, design, diagrams, logos and the Godseye assistant, belongs to Trikhya or is used with permission. You may read it, link to it and quote short extracts with attribution. You may not copy, republish or sell it without our written consent.",
        "Case studies and figures describe specific engagements at a specific time. They are not a promise of what any other system will achieve.",
      ],
    },
    {
      id: "use",
      title: "Acceptable use",
      items: [
        "Do not attempt to interfere with the site, probe it for vulnerabilities, or use automated tools to scrape it beyond what search engines ordinarily do.",
        "Do not submit content through the contact form that is unlawful, abusive or that you do not have the right to share.",
        "Do not misrepresent who you are when you write to us.",
      ],
    },
    {
      id: "godseye",
      title: "The Godseye assistant",
      paras: ["The on-page assistant gives general information about Trikhya from a fixed set of answers. It is not advice and it does not form a contract. For anything that matters, write to us and a person will reply."],
    },
    {
      id: "links",
      title: "Links to other sites",
      paras: ["We link to third-party sites such as LinkedIn. We do not control them and are not responsible for their content or their handling of your data."],
    },
    {
      id: "liability",
      title: "Liability",
      paras: [
        "The site is provided as is. We try to keep it accurate and available, but we do not guarantee that it will be error-free or uninterrupted. To the fullest extent the law allows, we are not liable for any loss arising from your use of, or reliance on, this website. Nothing here limits liability that cannot be limited by law.",
      ],
    },
    {
      id: "law",
      title: "Governing law",
      paras: ["These terms are governed by the laws of India. Any dispute will be dealt with by the courts of Chennai, Tamil Nadu."],
    },
    {
      id: "contact",
      title: "Contact",
      paras: [`Questions about these terms: ${PRIVACY_EMAIL}.`],
    },
  ],
};
