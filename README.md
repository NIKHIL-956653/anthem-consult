# Anthem Consult — Resonance Field

A cinematic, multi-page 3D rebuild of [anthemconsult.com](https://www.anthemconsult.com).
One persistent field of 3,168 instanced columns (72 × 44) rearranges itself into a new
formation for every section of every page while the camera glides between viewpoints.

| Stack | |
| --- | --- |
| Framework | Next.js 14 (App Router), TypeScript strict, Tailwind CSS |
| 3D | three.js, @react-three/fiber 8, @react-three/drei 9 |
| Motion | GSAP + ScrollTrigger + @gsap/react, Lenis smooth scroll |

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build (also lints and type-checks)
npm run start      # serve the production build
```

Node 18.17 or newer is required.

## Where things live

| Path | What it is |
| --- | --- |
| `lib/siteConfig.ts` | **Every word on the site.** Edit copy, services, industries, figures, contact details and metadata here. |
| `lib/stations.ts` | Camera stations per page: formation, position, look-at, field of view and horizontal frame shift (`sx`). |
| `lib/formations.ts` | The nine formation functions (`wave`, `pillars`, `steps`, `grid`, `ring`, `timeline`, `chart`, `pin`, `calm`). |
| `lib/sceneStore.ts` | Small mutable store shared by the DOM and the scene: route, stations, scroll progress, active index, reduced motion, telemetry. |
| `lib/useStations.ts` | Turns every `[data-station]` section into a camera station and drives the scrubbed progress value. |
| `lib/enquiry.ts` | Enquiry form model and validation, shared by the client form and the API route. |
| `components/scene/` | The WebGL scene: `Field` (one instanced draw call with a patched emissive material), `Dust`, `GroundGrid`, `CameraRig`, `SceneCanvas`. |
| `components/chrome/` | Header, status bar, footer, skip link, route-transition provider and `TransitionLink`. |
| `components/ui/` | `Section` (a station), `Reveal`, `Eyebrow`, `ClosingCta`, hover hook. |
| `app/` | Pages: `/`, `/about`, `/services`, `/industries`, `/contact`, plus `api/enquiry`. |

### Adding or changing a section

1. Add a `{ id, label, formation, pos, look, fov, sx }` entry to the page's list in `lib/stations.ts`.
2. Render a `<Section station="id">` (or `<WideSection>`) in the page, in scroll order.
   Sections are read in DOM order, so the page may use any subset of the catalogue.
3. Optional: `active` lights one index by default; `lit` keeps a set of indices lit; hovering any
   element bound with `useHoverIndex().bind(i)` lights index `i`.

The browser exposes `window.__anthemScene` (the store) for debugging camera and station state.

## Connecting email for the enquiry form

The form posts JSON to `app/api/enquiry/route.ts`. The route validates the payload with the same
rules as the client, logs it, and returns a reference code such as `AC-251104-7K3Q`.

To deliver enquiries by email, edit the `deliverEnquiry` function at the top of
`app/api/enquiry/route.ts`. It is the one place an enquiry leaves the server. Call your provider
there (Resend, Postmark, SendGrid, or SMTP through nodemailer) using credentials from environment
variables. For example, with Resend:

```bash
npm install resend
```

```ts
import { Resend } from 'resend';

async function deliverEnquiry(enquiry: EnquiryInput, reference: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'enquiries@anthemconsult.com',
    to: site.contact.email,
    replyTo: enquiry.email,
    subject: `[${reference}] Enquiry from ${enquiry.name}`,
    text: formatEnquiry(enquiry, reference),
  });
}
```

Put the key in `.env.local` (never commit it):

```bash
RESEND_API_KEY=re_xxxxxxxxx
```

If delivery throws, the route answers 502 and the form shows a `mailto:` link with the message
pre-filled, so the visitor can still reach you.

## Accessibility and motion

- `prefers-reduced-motion: reduce` turns off Lenis, the morph animation (columns jump to their
  targets), text reveals and route fades, and renders the scene on demand as a static frame.
- Real headings and landmarks, a skip link, visible focus, `aria-pressed` on the service chips,
  `aria-current` on the active nav link, and AA colour contrast on the ink palette.
- On phones the field sits behind the copy, the horizontal frame shift is off and the camera lens
  widens by 14°.

## Performance notes

- Device pixel ratio is capped at 2 and drops to 1 if `PerformanceMonitor` sees sustained slowdown.
- The field is a single `InstancedMesh` (one draw call); heights and glow are written straight into
  the instance matrix and an `aGlow` attribute each frame.
- three.js and the scene are loaded lazily on the client (`next/dynamic`, `ssr: false`), so they never
  block first paint or enter the server bundle.
- Dust particle count halves on small screens.

## Content that was deliberately left out

Theme sample content from the current site is not carried over: sample team members, testimonials,
placeholder counters, "Image Title" galleries, "Brand One…Five" logos, lorem ipsum, the repeated award
sentence, the second phone number, the demo-domain quote link and the three generic blog posts.
