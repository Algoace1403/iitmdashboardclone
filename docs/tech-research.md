# IIT Madras Portal — Technical Research Findings

## App Portal (app.onlinedegree.iitm.ac.in)

### Stack
- **Backend**: Python Flask/Jinja2 (server-rendered, NOT a SPA)
- **Frontend Enhancement**: HTMX 2.0.4 + Alpine.js 3.14.9
- **CSS Framework**: Bootstrap 4.6.1 + Argon Design System v1.2.0 (Creative Tim)
- **Icons**: Font Awesome 5.0.6, Nucleo Icons
- **Auth**: Firebase Auth v7.14.2, FirebaseUI v3.5.2 (Google-only sign-in)
- **Firebase project**: online-degree-app.firebaseapp.com

### Colors (CSS Variables)
```
--primary: #A0332D          (main red/maroon)
--secondary: #D6A64F        (gold)
--light-primary: #8F0700
--gray: #6A6A6A
--gray-dark: #323232
--gray-badge: #A7A7A7
--light: #f5f5f5
--dark: #212529
Body text color: #525f7f
```

### Typography
- Font: "Open Sans", sans-serif (weights: 300, 400, 600, 700)
- Body: font-size 1rem, font-weight 400, line-height 1.5

### Navbar
- Background: #efefef
- Box-shadow: 0 1px 1px 1px lightgray

### Login Page
- Background gradient: linear-gradient(207deg, #A0322C 0%, #EBC133 100%)
- Login card: border-radius 1rem, white bg, max-height 600px, padding 1.5rem, margin 40px
- Two-panel layout: left = sign-in card, right = announcements
- Text: "Sign-in using the Google account you registered with"

### Logo
- SVG at /static/img/IITM-Logo-Degree-in-DS.svg
- Height: 58px in navbar
- Colors: #781e19 (outer circle), #d5a44f (gold inner), #fff (details)

### Footer
- bg-primary (#A0332D)

---

## SEEK Portal (seek.onlinedegree.iitm.ac.in)

### Stack
- **Framework**: Angular 18.2.x
- **UI**: Angular Material 18.x (MDC-based)
- **Title**: "Nptel Seekh" (not "Seek")
- **PWA**: Yes (Angular Service Worker)
- **Math**: KaTeX for math rendering
- **Icons**: Material Icons v145, Font Awesome 4.7.0

### Manifest
- name: "NPTEL SEEKH"
- theme_color: #1976d2 (Material Blue 700)
- background_color: #fafafa
- display: fullscreen

### Typography
- Font: Roboto (weights 300, 400, 500, 700)

### Key Colors
```
#f44336  — Material Red 500
#3f51b5  — Material Indigo 500 (primary)
#ff4081  — Material Pink A200 (accent)
#212121  — near-black text
#494f69  — dark blue-gray
#7d8698  — medium gray
#781f1a  — IIT Madras dark maroon
#bf8d30  — gold/amber
#039855  — success green
#e0e0e0  — Material gray 300
#fafafa  — near-white background
```

---

## Public Site (study.iitm.ac.in/ds/)

- Tailwind CSS v4 + jQuery
- Primary: #800020, Dark: #4A0012
- Gold: #FFD700, Dark Gold: #B8860B

---

## Complete Color Map

| Color | Hex | Where |
|-------|-----|-------|
| App Primary | #A0332D | app portal primary, footer, links |
| App Login Gradient Start | #A0322C | login background |
| App Login Gradient End | #EBC133 | login background gold |
| App Gold/Secondary | #D6A64F | secondary accents |
| Logo Maroon | #781e19 | SVG logo outer |
| Logo Gold | #d5a44f | SVG logo inner |
| App Navbar BG | #efefef | top navbar |
| App Body Text | #525f7f | paragraph text |
| App Light BG | #f5f5f5 | page background |
| SEEK Primary | #3f51b5 | Material Indigo |
| SEEK Theme | #1976d2 | Material Blue 700 |
| SEEK Accent | #ff4081 | Material Pink A200 |
| SEEK BG | #fafafa | background |
| Public Maroon | #800020 | study.iitm.ac.in |
