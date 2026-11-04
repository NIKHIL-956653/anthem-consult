# Anthem Consult — 3D rebuild prompt

Copy everything below the line into a new Claude session.

---

Act as a principal creative technologist and lead WebGL / Next.js developer. Rebuild the website of **Anthem Consult** (current site: https://www.anthemconsult.com) as a premium, cinematic, multi-page 3D experience. Keep all of the company's real content (given below, already extracted and cleaned), drop the template filler, and present it with a persistent Three.js scene, GSAP ScrollTrigger camera choreography and Lenis smooth scroll.

Build the complete, runnable project end to end: every page, every component, no placeholders, no `// TODO`. Then run `npm run build` and fix every error before you finish.

## 1. The concept: "Resonance Field"

"Anthem" is a song that many voices carry together. The whole site is **one field of about 3,000 slim columns** (a 72 × 44 grid, instanced) standing on a dark plane. The field never unmounts. Each section of each page makes the columns **rearrange into a new formation** that illustrates the idea on screen, while the camera glides to a new viewpoint:

| Formation | Shape | Used for |
| --- | --- | --- |
| `wave` | A rolling sound wave that rises left to right like a growth curve; gold light runs along the crest | Home hero ("profitable growth") |
| `pillars` | Six tall pillars rise in a row, a ripple spreads from the active one | The 6 services |
| `steps` | A 10-step staircase across the field; the current step glows, finished steps stay half-lit | The 10-step recruitment methodology |
| `grid` | 12 raised tiles in a 4 × 3 grid | The 12 business-services analyses |
| `ring` | 12 towers on a circle around a low core, joined by a lit ring path | The 12 industries |
| `timeline` | A ridge with peaks at each year | History (1993 → today) |
| `chart` | Four big bars | Key figures |
| `pin` | Everything settles flat; one bright spike in the centre with rings pulsing outward | Contact (the Guntur office) |
| `calm` | Low, slow ripple | Neutral sections |

How it works technically:
- One `InstancedMesh` of boxes (geometry translated so the base sits at y = 0). Every frame, compute each column's **target height and glow** from the active formation (a pure function of x, z, time and the active index), then ease each column toward its target (`current += (target - current) * (1 - exp(-3.5 * dt))`). Write the instance matrices directly (scale y = height). This makes every formation change an organic morph with no extra blending code.
- A per-instance `aGlow` float attribute; the material is a dark navy `MeshStandardMaterial` patched with `onBeforeCompile`: emissive gold = `glow × (top face ? 1.0 : 0.35)`, plus a soft fresnel rim. Fog: `FogExp2` in the background colour.
- Hovering a service card or an industry sets the active index, so the matching pillar or tower lights up.
- Add slow gold dust particles and a faint ground grid that fades with distance.

## 2. Brand & design system

- **Palette:** ink background `#070A12`, panels `#0D1220` with `1px rgba(227,182,90,0.14)` borders, gold `#E3B65A`, hot gold `#F5D38A`, ivory text `#F3EEE4`, muted text `#9AA3B5`.
- **Type:** headings in **Fraunces** (serif, 400–600, tight tracking), body in **Inter**, labels and figures in **JetBrains Mono** (uppercase, wide tracking, tabular numbers). Load from Google Fonts with a `<link>`.
- Logo: wordmark "ANTHEM CONSULT" with a small gold mark (no image file needed; the owner can swap in their logo later).
- Feel: a calm, expensive consulting firm, not a tech startup. Lots of space, gold used sparingly.

## 3. Stack & architecture

- Next.js 14.2.35+ (App Router), TypeScript strict, Tailwind CSS.
- three + @react-three/fiber 8 + @react-three/drei 9, gsap + ScrollTrigger + @gsap/react, `lenis`.
- The `<Canvas>` is mounted once in `app/layout.tsx` (client-only, `dynamic(..., { ssr: false })`) so it persists across routes.
- `lib/siteConfig.ts`: every word on the site (so the owner can edit content in one file).
- `lib/sceneStore.ts`: a small mutable store shared by the DOM and the scene (route, scroll progress, active index, reduced motion, telemetry).
- `lib/formations.ts`: the formation functions.
- `lib/stations.ts`: per page, the list of camera stations in scroll order, each `{ formation, pos, look, fov, sx }` (`sx` = horizontal frame shift so the field sits beside the copy on desktop).
- `lib/useStations.ts`: every `[data-station]` section on a page is one station. A station is reached when its section's top crosses 20 % of the viewport and held while the section still fills the screen. ScrollTrigger with `scrub: 1.2` drives a progress value; the camera follows a `CatmullRomCurve3` through the station positions. Re-measure on every ScrollTrigger refresh.
- On route change: fade the page out (opacity only, never transform, so pinned sections still work), navigate, reset scroll, fade in; the camera eases from its last pose to the new page's first station over ~1.6 s.
- Lenis driven by `gsap.ticker`, feeding `ScrollTrigger.update`.

## 4. Site chrome

- **Header (fixed):** logo left; nav centre: Home, About, Services, Industries, Contact (active link marked); right: "Get a consultation →" (gold button). On phones, logo + button in one row and the nav as a scrollable row beneath. Gradient backdrop so copy never collides with it.
- **Bottom status bar (fixed, subtle, mono):** current page and section breadcrumb on the left; on the right `GUNTUR · IN  16.29° N / 80.43° E` and a live IST clock (HH:MM:SS).
- **Footer:** short tagline, service links, contact details, social links (Facebook https://facebook.com/Anthemconsult, Twitter/X https://twitter.com/anthemconsult), "© 2026 Anthem Consult. All rights reserved."

## 5. Pages and content (use this text; you may tighten the wording but keep the meaning)

### `/` Home
1. **Hero** (`wave`): eyebrow "Business consulting · Outsourcing · Since 1993". Headline: "Strategies for profitable growth." Lead: "Anthem Consult helps organizations grow through business services, outsourcing, software and training, economically, on time and without compromising quality." CTAs: "Get a consultation" (→ /contact) and "Explore services" (→ /services).
2. **Services** (`pillars`): heading "Six ways we work with you". Six cards (hover lights the matching pillar), each linking to its section on /services: Software Development, Web Design & Development, Outsourcing, Business Services, Online Trainings, Corporate Training Services (one line each, from section 5 /services below).
3. **How we recruit** (`steps`): a teaser of the 10-step methodology (show the step names, link to /services#outsourcing).
4. **Industries** (`ring`): "Twelve industries, one standard". The 12 industries as a list; hover lights the matching tower.
5. **Figures** (`chart`): **25+ years** of consulting experience · **Since 1993** · **1,563+ global clients** (the company's own claim on its current site) · **12 industries served**.
6. **Closing CTA** (`pin`): "We do what is right, not what is most profitable for us." Button: "Get a consultation".

### `/about`
1. **Hero** (`timeline`): "Welcome to Anthem Consult". Anthem Consult looks for business opportunities across organizations, serving clients in business services and outsourcing with economical development benefits while keeping quality and timelines. Every organization and every candidate is unique; the work is matching them well.
2. **Vision** (`wave`): "To build one of the best-known outsourcing and business services firms."
3. **Mission** (`calm`): "To help our clients make distinctive, lasting and substantial improvements in their performance, and to build a firm that attracts, develops and retains exceptional people." Also: research and analytics so clients make decisions on the right information.
4. **Timeline** (`timeline`, the active peak follows scroll): 1993 "Where we started: a vision to empower organizations and individuals to reach their full potential." · 1995 "A team of 100+ people." · 2001 "A culture that nurtures and supports our people's ambitions."
5. **Principle** (`pin`): "Flexible, long-term support. We take pride in doing what is right rather than what is right for the profitability of our firm." CTA to /contact.

### `/services` (one long page, one section per service, each with an anchor id; the pillar for the current section is lit)
1. **Software Development** (`#software-development`): Started through a group company; delivers software that performs, is secure, high quality and good value. Expertise in Microsoft technologies, Java and mobile. End-to-end: web development, e-commerce, software and application design, application support and maintenance. Enterprise applications and custom e-commerce that streamline processes and integrate operations. "Your right technology partners" for process improvement and operational savings.
2. **Web Design & Development** (`#web-design-development`): End-to-end web development and e-commerce solutions, built around each client's needs, to create opportunities, streamline processes and cut operating costs.
3. **Outsourcing** (`#outsourcing`, formation `steps`, sticky visual; the active step follows scroll within the section): "Anthem Consult Recruitment Methodology", ten steps:
   1. Detailed discussion with the client to ascertain their personnel requirements.
   2. Jointly develop the job profiles and descriptions.
   3. Hold discussions with the peer group for the positions to be filled.
   4. Finalize sourcing with the client: advertising, headhunting, targeting specific organizations and other options.
   5. Search and identify suitable candidates.
   6. Preliminary screening and selection of candidates by Anthem Consult.
   7. Assist the client with technical, personality and soft-skills tests.
   8. Assist the client with initial and final interviews.
   9. Assist with negotiating and finalizing employment terms.
   10. Post-employment suitability feedback, followed by counselling if required.
   Sectors recruited for: Software Development; Pharmaceutical & Chemicals; Human Resource Management; Manufacturing / Engineering / Automotive / Construction; Insurance / Banking / Financial Services; BPO; Call Center; FMCG; Construction & Real Estate; Retail; Agriculture; Telecom; Medical; NGOs.
4. **Business Services** (`#business-services`, formation `grid`; hovering an item lights a tile): evaluating measurement data, combined with client and third-party data, applied to specific business problems; research customized to each client; view by industry, product category or geography; tailored survey design; cost-efficient results; strictly confidential analysis; interviewers trained for hard-to-reach groups and sensitive topics; understanding why campaigns succeed or fail (pricing, promotion, targeting, marketing mix). The 12 analyses: Market opportunity analysis · Demand assessment · Product portfolio analysis · Competition analysis · Monitoring industries and companies · Market entry strategies · Strategies for growth · Customer management · Operational efficiency · Performance improvement · Product potential survey · Analysis of customer segments, products, channels and technologies.
5. **Online Trainings** (`#online-trainings`): software and IT courses by certified professionals and working trainers, weekday and weekend batches, for students and working professionals. Faculty: qualified, certified IT professionals with real industry experience who teach at the learner's pace. Live interactive virtual classrooms. Online labs: practise on remote lab machines in real time, during or after sessions, with trainer support.
6. **Corporate Training Services** (`#corporate-training-services`): technical and non-technical training for companies, colleges, universities, schools, and government and private institutions across India, in-house or on-site; aligns skills with industry needs and emerging technologies. Methods: online assessments, on-the-job training, classroom sessions, experiential learning. Builds attitude and professional skills at every level.
End with the `pin` CTA.

### `/industries`
1. **Hero** (`ring`): "Find your industry solution". Consultants with hands-on experience across sectors help clients respond to competitive, regulatory and technology change.
2. **The 12 industries** (`ring`, hover lights a tower): Software / IT · Pharmaceutical & Chemicals · Lifesciences · Financial Services · BPO / Call Center · Management · Retail · Construction & Real Estate · FMCG · Telecom · Agri Business · Others.
3. **Three offerings** (`grid` or `pillars` with 3 lit):
   - **Business Intelligence Pro:** packaged research from company profiles to in-depth economic, industry and company analysis, covering global, regional and national markets; custom work available.
   - **Knowledge Services:** customized, outsourced research on economies, industries and companies (sector, demand-supply and product analysis), under strict confidentiality with NDAs available.
   - **Business Advisory Services:** growth strategy, market entry, demand assessment, market tracking, equity valuation, supply-chain and competitive analysis.
4. CTA (`pin`): "Please contact us for client rankings and success stories."

### `/contact` (`pin`)
- "Get in touch with us." Address: Flat No. 201, Block A, Rishi Valley Apartment, Srinivasarao Thota, Opp. Medical Club Road, Guntur 522004, Andhra Pradesh, India. Email: info@anthemconsult.com. Phone: +91 92468 31142. "Open in Google Maps" link to https://www.google.com/maps?q=16.291562733450778,80.42746247346936
- An enquiry form: name, organization, email, phone, service of interest (6 toggle chips), message. Shared validation on client and server; POST to `app/api/enquiry/route.ts`, which validates, logs, and returns a reference code (leave a clearly named spot to plug in an email provider). Success state shows the reference. A `mailto:` fallback if the request fails.

## 6. Do NOT include (template filler on the current site)
- Team members (Donald M. Jackson etc.): they are theme sample people.
- Testimonials (they mention a product called "Convis"): theme sample.
- Counters showing 0 or 1+, "Image Title" galleries, "Brand One…Five" logos, lorem ipsum, the repeated award sentence, the second phone number 235 (689) 7899, the demo-domain "Get A Quote" link.
- The 3 blog posts (generic theme articles). Leave the blog out.

## 7. Quality bar
- Responsive: desktop, tablet, phone (390 px). On phones the field sits behind the copy, the frame shift is off, and the camera widens its lens.
- `prefers-reduced-motion`: no Lenis, no morph animation (columns jump to targets), no text reveals, no route fades, a static frame.
- Accessibility: real headings, landmarks, labels, visible focus, `aria-pressed` on chips, skip link, colour contrast AA.
- Performance: DPR capped at 2, one draw call for the field, dust count reduced on small screens, three.js loaded lazily.
- SEO: per-page `metadata` (title + description), `themeColor`.
- Write a README: how to run, where content lives, how to connect email for the enquiry form.

Finish by running `npm run build`, fixing every error, and listing the files you created.
