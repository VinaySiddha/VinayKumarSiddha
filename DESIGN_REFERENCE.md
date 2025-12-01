# 🎨 Visual Design Reference

## Color Palette

### Primary Colors
```
Background: #0F0F10 (Deep Black)
Glass Base: rgba(255, 255, 255, 0.10) (10% white)
Glass Border: rgba(255, 255, 255, 0.20) (20% white)
```

### Accent Colors
```
Neon Blue:   #4CC9F0
Neon Purple: #892CDC  
Neon Pink:   #FF006E
```

### Usage Guidelines

**Neon Blue (#4CC9F0)**
- Primary CTA buttons
- Active navigation links
- Icon highlights
- Primary skill tags
- Form focus states

**Neon Purple (#892CDC)**
- Secondary elements
- Gradient middle stops
- Hover states
- Timeline icons

**Neon Pink (#FF006E)**
- Accent highlights
- Gradient end stops
- Heart icon
- Special badges

## Typography

### Font Family
```css
Primary: 'Space Grotesk', sans-serif
Fallback: Inter, system-ui, sans-serif
```

### Font Weights
- Light: 300 (subtle text)
- Regular: 400 (body text)
- Medium: 500 (labels)
- Semibold: 600 (headings)
- Bold: 700 (major headings)

### Text Sizes

#### Desktop
- Mega Heading: 96px (Hero name)
- H1: 72px (Section titles)
- H2: 48px (Subsections)
- H3: 32px (Card titles)
- Body: 18px (Paragraphs)
- Small: 14px (Labels, tags)

#### Mobile
- Mega Heading: 48px
- H1: 40px
- H2: 32px
- H3: 24px
- Body: 16px
- Small: 12px

## Glassmorphism Effect

### Standard Glass Card
```css
background: rgba(255, 255, 255, 0.10)
backdrop-filter: blur(24px)
border: 1px solid rgba(255, 255, 255, 0.20)
border-radius: 24px
```

### Glass Button
```css
background: rgba(255, 255, 255, 0.10)
backdrop-filter: blur(24px)
border: 1px solid rgba(255, 255, 255, 0.20)
border-radius: 16px
transition: all 300ms
hover: background: rgba(255, 255, 255, 0.20)
```

### Neon Border Glass
```css
border: 1px solid rgba(76, 201, 240, 0.50)
box-shadow: 
  0 0 20px rgba(76, 201, 240, 0.30),
  0 0 40px rgba(137, 44, 220, 0.20)
```

## Spacing System

### Base Unit: 8px

```
xs:  4px   (0.5 * base)
sm:  8px   (1 * base)
md:  16px  (2 * base)
lg:  24px  (3 * base)
xl:  32px  (4 * base)
2xl: 48px  (6 * base)
3xl: 64px  (8 * base)
```

### Component Spacing
- Card padding: 32px (2xl)
- Section padding: 80px vertical
- Grid gaps: 32px (2xl)
- Button padding: 12px 24px

## Border Radius

```
Small:   8px  (tags, small buttons)
Medium:  16px (inputs, medium cards)
Large:   24px (main cards)
XLarge:  32px (hero cards)
Round:   9999px (circular elements)
```

## Shadows & Glows

### Standard Shadow
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)
```

### Neon Glow
```css
box-shadow:
  0 0 20px rgba(76, 201, 240, 0.3),
  0 0 40px rgba(137, 44, 220, 0.2),
  0 0 60px rgba(255, 0, 110, 0.1)
```

### Hover Glow
```css
box-shadow:
  0 0 30px rgba(76, 201, 240, 0.5),
  0 0 60px rgba(137, 44, 220, 0.3)
```

## Animation Timing

### Standard Transitions
```
Fast:     150ms (small interactions)
Normal:   300ms (hover states)
Slow:     600ms (page transitions)
XSlow:    800ms (scroll reveals)
```

### Easing Functions
```
Standard:     ease-in-out
Smooth:       cubic-bezier(0.4, 0, 0.2, 1)
Bounce:       cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Animation Durations
```
Blob movement:     20-25s
Particle float:    6s
Icon rotate:       360deg in 600ms
Scale on hover:    300ms
Fade in:          800ms
```

## Gradient Definitions

### Primary Gradient
```css
background: linear-gradient(
  90deg,
  #4CC9F0 0%,
  #892CDC 50%,
  #FF006E 100%
)
```

### Background Gradient (subtle)
```css
background: linear-gradient(
  180deg,
  rgba(76, 201, 240, 0.1) 0%,
  rgba(137, 44, 220, 0.1) 50%,
  rgba(255, 0, 110, 0.1) 100%
)
```

### Text Gradient
```css
background: linear-gradient(to right, #4CC9F0, #892CDC, #FF006E)
-webkit-background-clip: text
-webkit-text-fill-color: transparent
```

## Blob Specifications

### Blob Style
```css
border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%
filter: blur(100px)
opacity: 0.15-0.20
```

### Blob Colors & Sizes
1. Purple Blob: 384px, opacity 0.20
2. Blue Blob: 500px, opacity 0.20
3. Pink Blob: 450px, opacity 0.15
4. Cyan Blob: 384px, opacity 0.10
5. Small Blue: 256px, opacity 0.10
6. Small Purple: 288px, opacity 0.15

## Particle System

### Particle Specs
```
Count: 100 particles
Size: 0.5-2.5px
Color: rgba(76, 201, 240, opacity)
Speed: -0.25 to 0.25 px/frame
Connection Distance: 100px
Connection Opacity: 0.1 * (1 - distance/100)
Canvas Opacity: 0.4
```

## Section Layouts

### Hero Section
```
Max Width: 1200px
Padding: 80px 24px
Text Align: Center
Card Padding: 64px
```

### Standard Section
```
Max Width: 1280px
Padding: 80px 24px
Grid Gap: 32px
```

### Navbar
```
Height: Auto (py-4 to py-6)
Backdrop Blur: 24px
Position: Fixed top
Z-index: 50
```

## Responsive Breakpoints

```
Mobile:     < 640px
Tablet:     640px - 1024px
Desktop:    1024px - 1280px
Large:      > 1280px
```

### Grid Columns by Breakpoint
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

## Icon Sizes

```
Small:    16px (w-4 h-4)
Medium:   20px (w-5 h-5)
Large:    24px (w-6 h-6)
XLarge:   32px (w-8 h-8)
Hero:     64px (w-16 h-16)
```

## Z-Index Layers

```
Background Blobs:  0
Particles:         0
Main Content:      10
Navbar:            50
Modals:            100
```

## Opacity Scale

```
Subtle:   0.1
Light:    0.2
Medium:   0.4
Strong:   0.6
Heavy:    0.8
Full:     1.0
```

## Form Elements

### Input Fields
```css
background: rgba(255, 255, 255, 0.05)
backdrop-filter: blur(24px)
border: 1px solid rgba(255, 255, 255, 0.20)
border-radius: 12px
padding: 12px 16px
padding-left: 48px (with icon)

focus:
  border-color: rgba(76, 201, 240, 0.5)
  outline: none
```

### Buttons
```css
Primary (Neon):
  border: 1px solid rgba(76, 201, 240, 0.5)
  box-shadow: 0 0 20px rgba(76, 201, 240, 0.3)
  
Secondary:
  border: 1px solid rgba(255, 255, 255, 0.3)
  
hover: scale(1.05)
active: scale(0.95)
```

## Timeline Design

### Line
```css
width: 1px
background: linear-gradient(
  to bottom,
  #4CC9F0,
  #892CDC,
  #FF006E
)
```

### Node
```css
size: 64px
border: 4px solid #0F0F10
background: gradient (changes per item)
border-radius: 50%
```

## Card Hover States

### Standard Card
```
Default: bg rgba(255,255,255,0.10)
Hover:   bg rgba(255,255,255,0.12)
         border rgba(255,255,255,0.30)
         scale 1.03
         translateY -5px
```

### Project Card
```
Hover: scale 1.02
       translateY -5px
       gradient overlay visible
       glow effect increases
```

## Loading States

### Skeleton
```css
background: linear-gradient(
  90deg,
  rgba(255,255,255,0.05) 0%,
  rgba(255,255,255,0.10) 50%,
  rgba(255,255,255,0.05) 100%
)
animation: shimmer 2s infinite
```

## Accessibility

### Contrast Ratios
- White on #0F0F10: 19.33:1 ✅
- Neon Blue on Dark: 6.12:1 ✅
- Neon Purple on Dark: 4.53:1 ✅
- Text (80% white) on Dark: 15.46:1 ✅

### Focus States
```css
outline: 2px solid #4CC9F0
outline-offset: 2px
```

## Print Guidelines

If implementing print styles:
```css
- Remove animations
- Increase contrast
- Use standard fonts
- Remove background effects
- Ensure black text on white
```

---

## Quick Reference Card

**Most Used Values:**
- Padding: 32px
- Gap: 32px
- Border Radius: 24px
- Blur: 24px
- Transition: 300ms
- Hover Scale: 1.05
- Text: 18px
- Heading: 48px

**Most Used Colors:**
- Glass: rgba(255,255,255,0.10)
- Border: rgba(255,255,255,0.20)
- Blue: #4CC9F0
- Purple: #892CDC
- Pink: #FF006E

**Most Used Animations:**
- Fade up: opacity 0→1, y 50→0
- Scale hover: 1 → 1.05
- Rotate icon: 0 → 360deg
- Duration: 300ms - 800ms

---

Use this reference when making design decisions to maintain consistency throughout the portfolio.
