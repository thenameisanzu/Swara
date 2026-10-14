# Swara Music Academy

Interactive web application for Swara Music Academy based in Kochi, Kerala. Built with Next.js, Tailwind CSS, Framer Motion, and the Web Audio API for real-time instrument tone synthesis.

## Features

- **Interactive Synthesizer Piano**: Real-time polyphonic keyboard using the Web Audio API (press keys A–K or touch/slide).
- **Interactive Instruments**: Audio previews and curriculum details for Piano, Guitar, Violin, Carnatic vocals, and Drums.
- **Trial Class Booking on WhatsApp**: One-tap customized WhatsApp booking prefilled with instrument and student age selections.
- **Official WhatsApp Vector Icon**: High-clarity official WhatsApp branding integrated across:
  - Header quick actions
  - Trial booking CTA (`#25D366`)
  - Floating 24/7 WhatsApp contact action button with pulsing indicator
  - Footer direct link
- **Instagram Integration**:
  - Live profile card with verified badge, follower count, and direct link (`@swaramusicacademy`)
  - Curated gallery of studio recitals, masterclasses, and student performances
  - Hover states displaying engagement stats (likes, comments, captions)
  - Quick access buttons in the header and footer

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

Edit academy contacts, WhatsApp number, Instagram handle, fees, and instruments at the top of [`components/Site.jsx`](components/Site.jsx):

```javascript
const CO = {
  whatsapp: '910000000000',
  instagram: 'swaramusicacademy',
  address: 'First floor, Building name, Kochi, Kerala',
  hours: 'Mon to Sat, 10 am to 8 pm'
}
```
