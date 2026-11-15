# Rehearsal: boutique UI refinement

Scope: the functional Navodhai landing page. Stageshow informed the hierarchy, framing, material-led composition and deliberate phone layout. No fictional product screen or autoplay demonstration was added, so no kit example was copied and the `.ss-stage` film gate does not apply. `static-card` was reviewed for its focal/supporting hierarchy rather than its app content.

Direction: preserve the confirmed V4 colours, logo, Didot/Inter typography, business copy and direct contact routes. Give the textile artwork more presence, make the garment selection quieter than the enquiry action, and distinguish the services, ordering and contact sections through their composition.

Interaction: select Blouse, Dress or Customise; the pressed state, decorative seam and prepared WhatsApp destination follow the choice. Keep the footer enquiry independent. Existing finite tagline motion, pointer light and appearance transitions remain, with reduced-motion alternatives.

Browser review: desktop dark hero and services; tablet light hero, ordering and contact close; phone light hero and services/ordering. Checked normal and enlarged text, choice feedback and both appearance states. The first pass found a wrapping tagline at 320px/200% text, cramped service headings, wrapping phone choices and footer overlap with the back-to-top control. The follow-up fixes reduce minimum headline size and phone choice padding, adjust service title/artwork sizes, and reserve space below the contact rail.

Automated validation: `pnpm validate` covers formatting, lint, types, component behavior, build/deployment safety, prerendered contact routes and browser smoke/reflow checks. The reflow matrix includes 320, 390, 768, 980 and 1280px at 100% and 200% root text. A browser axe-core scan checks WCAG 2 A/AA and 2.1 AA in both appearances. Garment borders retain the original 50% foreground/canvas mix to distinguish the controls from decorative rules.

Not checked: physical phones, Safari/Firefox, real WhatsApp app handoff, or production deployment of these changes. No new imagery or business claims were introduced.
