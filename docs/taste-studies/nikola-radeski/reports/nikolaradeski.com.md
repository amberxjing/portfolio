# Design Map

## Spacing Scale
- `0px`: body padding and most heading margins.
- `5px`: fixed nav wrapper padding and social icon margin.
- `10px`: social icon radius and home nav icon padding.
- `13px`: vertical button padding.
- `15px`: horizontal button margin and fixed nav label size.
- `20px`: paragraph bottom margin.
- `24px`: portrait radius.
- `29px`: horizontal button padding.
- `30px`: page side padding and primary button radius.
- `40px`: primary button height and home nav control height.
- `42px`: secondary button height and contact nav control height.
- `45px`: about headline rendered height.
- `52px`: fixed bottom nav height.
- `64px`: portrait top y-position in the viewport.
- `90px`: long about paragraph height.
- `180px`: left edge of about content in the 1440px viewport.
- `232px`: horizontal pause between the 532px text column and 270px portrait.

## Font Hierarchy
- `230.4px / 276.48px / 400`: oversize section wordmark.
- `86.4px / 82.08px / 400`: home hero h1 above the hash-scrolled about view.
- `44.8px / 44.8px / 400 / -2px`: about headline.
- `36px / 36px / 400 / -2.5px`: skill card headings.
- `24px / 24px / 400 / -1.5px`: award row headings.
- `20px / 22px / 400 / -0.7px`: trust heading.
- `16px / 22.4px / 400 / -0.5px`: body, eyebrow, marquee.
- `15px / 21px / 400 / -0.5px`: fixed nav links.
- `13px / 14.3px / 400`: CTA labels.
- Families observed: `General Sans - Regular`, `General Sans - Medium`, `General Sans - Semibold`, `Gloria Hallelujah`, `Clash Display - Semibold`, `Clash Display - Medium`.

## Color Palette
- `#dbdbdb`: page background.
- `#efefef`: dominant pale surface.
- `#eaeaea`: secondary surface, secondary button fill, nav text.
- `#ffffff`: card surface.
- `#333333`: primary text and secondary button border.
- `#6d6d6d`: body text.
- `#a5a5a5`: tertiary list text.
- `#e27500`: primary accent and CTA fill.
- `#e28800`: alternate orange interactive state.
- `#000000`: fixed bottom nav shell.
- `#141617`: near-black interactive surface.

## Image Ratios
- About portrait: `270px x 380px`, rendered ratio about `0.71:1`.
- Portrait source: `1200px x 1600px`, ratio `0.75:1`.
- Portfolio feature: `416px x 312px`, ratio `1.33:1`.
- Portfolio wide feature: `416px x 235px` to `416px x 242px`, ratio about `1.72:1` to `1.77:1`.

## Component Tokens
- About text column: `532px` wide, x-position `180px`.
- Visible about band: about `1065px` wide inside a `1425px` page.
- Portrait card: `270px x 380px`, `24px` radius, `0px 6px 32px rgba(0, 0, 0, 0.15)`.
- Primary CTA: `168px x 40px`, `13px 29px` padding, `30px` radius, `#e27500` fill, `#eaeaea` text.
- Secondary CTA: `127px x 42px` and `141px x 42px`, `13px 29px` padding, `30px` radius, `1px solid #333333`, `#eaeaea` fill.
- Social icon: `39px x 39px`, `10.8438px` padding, `10px` radius, `1px solid #dbdbdb`.
- Fixed nav: `528px x 52px`, x-position `449px`, y-position `824px`, `5px` padding, `100px` radius, `#000000` fill.
- Fixed nav links: `15px / 21px`, `#eaeaea` text.
- Fixed nav controls: home `42px x 40px`, contact `118px x 42px`.
- Shadow set: `0px 6px 32px rgba(0, 0, 0, 0.15)` and `2px 2px 70px 33px #eaeaea`.
- Grid: no CSS grid detected; composition uses a wide content band, fixed column widths, and large horizontal pauses.
- Motion: `0.2s` color/background/border transitions, `0.3s` transform/filter transitions, `0.4s` opacity/transform transitions with `cubic-bezier(0.21, 0.6, 0.35, 1)`.
- Accessibility signals: `:focus-visible` detected; `prefers-reduced-motion` detected.

---

# Taste DNA

### Whitespace Does the Framing
- **Trigger**: When presenting the about section and personal proof on a long one-page portfolio.
- **Decision**: Chose a wide gray field with typography-led grouping over boxed modules, dividers, or dense cards.
- **Reason**: Because the reader should feel that the person can leave space around claims instead of filling every viewport with proof.
- **Evidence**: Page background `#dbdbdb` and major surface `#efefef`; about text column `532px`; visible band about `1065px`; about `232px` between text and portrait; no CSS grid detected.

### Accent as Punctuation
- **Trigger**: When the page needs personality and clear actions without turning the whole surface into a brand color field.
- **Decision**: Chose orange only for the word `Creative`, rating stars, and the primary call-to-action over broad orange backgrounds or multiple accent colors.
- **Reason**: Because one hot color is easier to trust when it behaves like an instruction mark instead of a decorative wash.
- **Evidence**: Accent `#e27500` on the `168px x 40px` primary CTA and the `Creative` word; most visible text uses `#333333` or `#6d6d6d`; secondary buttons use `#eaeaea` plus `1px solid #333333`.

### Small Control, Large Presence
- **Trigger**: When a long single-page portfolio still needs persistent navigation.
- **Decision**: Chose a `528px x 52px` fixed bottom capsule over a full header bar or a large side menu.
- **Reason**: Because navigation can stay constantly reachable while the first read remains about the content, not the site chrome.
- **Evidence**: Fixed nav at `x=449px`, `y=824px` in a `1440px` viewport; `#000000` shell; `100px` radius; `5px` padding; `15px / 21px` labels; `42px x 40px` home control; `118px x 42px` contact control.

### Human Proof Over Abstract Decoration
- **Trigger**: When establishing credibility for a designer-founder profile.
- **Decision**: Chose one real portrait plus client and review proof over abstract 3D objects, heavy textures, or ornamental illustrations.
- **Reason**: Because the reader needs to connect the work claims to a person and to external proof before exploring the portfolio.
- **Evidence**: First-viewport portrait `270px x 380px`; `24px` radius; `0px 6px 32px rgba(0, 0, 0, 0.15)` shadow; `Trusted by over 130+ clients` appears below the CTAs; five social icons repeat as `39px x 39px` boxes with `10px` radius.
