# SPEC.md

## Product Name

Working title: Arcana Mirror  
Chinese working title: 镜中塔罗

---

## Product Positioning

Arcana Mirror is a tarot web application that combines:

- mystical visual atmosphere
- modern reflective interpretation
- ritual-like user flow
- structured and emotionally supportive readings

It is designed for users who want insight, reflection, emotional guidance, or a symbolic way to think through a current question.

This is not positioned as a fear-based fortune-telling product.
It is positioned as a symbolic reflection experience.

---

## Product Direction

### Chosen Direction
A + B hybrid:

- A: mystical and ritual-oriented visual design
- B: modern healing, self-reflective content style

### Experience Goal
Users should feel:

- calm
- curious
- emotionally seen
- guided into reflection
- visually immersed

---

## Target Users

### Primary Users
1. casual users curious about tarot
2. users looking for emotional reflection tools
3. users interested in symbolic/spiritual self-exploration

### Secondary Users
1. beginner tarot learners
2. users who like aesthetic ritual-based products
3. users who may later return for daily draws or reading history

---

## Core User Needs

Users want to:

- ask a meaningful question
- draw cards in a way that feels intentional
- receive a structured interpretation
- feel guided, not judged
- revisit the meaning later if needed

---

## MVP Scope

The MVP includes:

1. Homepage
2. Single-card reading flow
3. Three-card spread flow (past / present / future)
4. Reading result page
5. Card library page

The MVP excludes:
- advanced spreads
- social sharing system
- personalization engine
- multi-language support
- admin CMS
- payment system

---

## Information Architecture

### Pages

#### 1. `/`
Homepage

#### 2. `/draw/single`
Single-card draw flow

#### 3. `/draw/three`
Three-card spread flow

#### 4. `/reading/[id]`
Reading result page

#### 5. `/cards`
Card library index

#### 6. `/cards/[slug]`
Card detail page

#### 7. `/about`
About / guidance / disclaimer page

Optional future:
- `/login`
- `/register`
- `/history`
- `/daily`

---

## Homepage Specification

### Goal
Communicate product mood, explain value, and guide users into a reading.

### Sections

#### Hero
Content:
- headline
- subheadline
- primary CTA: Start Reading
- secondary CTA: Explore Cards

Suggested headline style:
- poetic
- calm
- slightly mystical

Example direction:
- "What is your heart trying to ask today?"
- "Draw a card. Look inward."

#### Spread Entry Section
Show entry points for:
- single-card reading
- three-card reading

Each option should include:
- title
- short description
- CTA

#### Daily Reflection Preview
A lightweight section presenting:
- one card of the day
- a short reflective message

#### Intro to Tarot
Explain:
- what tarot is in this product context
- what upright / reversed means
- how to use readings as reflection, not fixed destiny

#### Footer
Include:
- about
- privacy
- disclaimer

---

## Single-Card Reading Flow

### Goal
Offer a fast and emotionally meaningful reading for one focused question.

### Steps

#### Step 1: Ask a Question
User can:
- type a custom question
- choose from prompts

Suggested prompts:
- love
- work
- study
- relationships
- self-growth

#### Step 2: Shuffle
User taps a shuffle action.
Visual feedback should imply ritual and intention.

#### Step 3: Draw
User draws one card.

#### Step 4: Reveal
The card is flipped and interpreted.

### Result Includes
- card image
- card name
- upright or reversed
- keywords
- concise interpretation
- guidance / reflection prompt

---

## Three-Card Reading Flow

### Goal
Provide a richer reading around time progression or emotional progression.

### Spread Type
Past / Present / Future

### Steps
1. user asks a question
2. user shuffles
3. user draws three cards
4. cards are revealed in sequence
5. result page presents:
   - each card
   - position meaning
   - combined interpretation

### Result Includes
- card 1: past
- card 2: present
- card 3: future
- spread summary
- suggested reflection / action prompt

---

## Reading Result Page Specification

### Goal
Turn symbolic draw results into a readable and emotionally resonant interpretation.

### Structure

#### Header
- user question
- spread type
- reading timestamp

#### Card Section
For each card show:
- image
- name
- upright / reversed
- keywords
- short interpretation
- position meaning

#### Combined Reading Section
Explain:
- overall pattern
- emotional theme
- likely tension or transition
- reflection-oriented guidance

#### Reflection Prompt Section
Examples:
- What are you avoiding naming directly?
- What deserves patience right now?
- What would clarity look like in this situation?

#### Actions
- draw again
- return home
- save reading (future)
- share summary (future)

---

## Card Library Specification

### Goal
Provide a browsable tarot reference library and long-term content asset.

### Card List Page
Each card item should show:
- card name
- arcana type
- short keyword line

Users can filter by:
- major arcana
- cups
- swords
- pentacles
- wands

### Card Detail Page
Each card should include:
- name
- arcana / suit / number
- image
- keywords
- upright meaning
- reversed meaning
- emotional meaning
- relationship meaning
- career meaning

---

## Visual Design Specification

### Design Direction
Mystical + modern healing

### Visual Principles
- dark atmosphere with clarity
- elegant restraint
- premium feeling
- readable layouts
- emotionally calm presentation

### Color Direction
Primary:
- deep midnight blue / black-blue
- warm off-white
- restrained gold accents
- violet support color

Example direction:
- background: deep navy
- card surfaces: layered dark panels
- accent: gold or muted mystical purple

### Typography
- heading: elegant serif or expressive display type
- body: modern sans-serif for readability

### Component Style
- cards should feel tall, special, symbolic
- buttons should be clean and intentional
- borders should be subtle but visible
- spacing should feel breathable

### Background Treatment
Allowed:
- subtle stars
- moon phase motifs
- faint linework
- very soft particle motion

Not allowed:
- excessive glow
- cluttered occult decoration
- low-quality fantasy styling

---

## Interaction Specification

### Key Principles
- deliberate
- smooth
- ritual-like
- not slow
- not flashy for its own sake

### Required Interaction Moments
1. question input
2. shuffle feedback
3. draw selection
4. card reveal
5. reading expansion

### Card Reveal
Must feel meaningful.
Recommended:
- flip transition
- fade-in card title
- slight stagger for three-card spread

### State Design
Every core screen must handle:
- loading
- error
- empty
- success

---

## Content Style Specification

### Tone
- reflective
- calm
- symbolic
- emotionally supportive
- non-deterministic

### Avoid
- fear-based language
- fixed destiny language
- manipulative prediction
- harsh judgment

### Preferred Expression Style
Use:
- "This card suggests..."
- "You may be moving through..."
- "This spread points toward..."
- "A helpful reflection may be..."

Avoid:
- "This will definitely happen"
- "You are doomed"
- "You must..."
- "This person is absolutely..."

---

## Data Model Overview

### `tarot_cards`
Fields:
- id
- slug
- name
- arcana
- suit
- number
- image_url
- keywords
- upright_meaning
- reversed_meaning
- love_meaning
- career_meaning
- description

### `readings`
Fields:
- id
- user_id (nullable for anonymous mode)
- question
- spread_type
- cards_json
- interpretation_json
- created_at

### `users`
Fields:
- id
- email
- password
- created_at
- updated_at

---

## API Overview

### Reading APIs
- `POST /readings/single`
- `POST /readings/three`
- `GET /readings/:id`

### Card APIs
- `GET /cards`
- `GET /cards/:slug`

### Auth APIs
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Future:
- `GET /history`
- `POST /history/save`

---

## MVP Success Metrics

The MVP is successful if:

1. users can complete a reading without confusion
2. the flow feels immersive but efficient
3. the interpretation is readable and emotionally meaningful
4. the product looks premium and coherent
5. the architecture supports future expansion

---

## Risks and Constraints

### Risks
- becoming visually cliché
- overloading the MVP
- using weak or deterministic copy
- building too many spread types too early

### Constraints
- single developer scope
- MVP must remain small
- frontend and backend remain separated
- API design should remain reusable for future mobile support

---

## Roadmap After MVP

### Phase 2
- login / register integration
- reading history
- daily card
- save reading

### Phase 3
- more spread types
- personalized prompts
- AI-enhanced interpretation
- shareable cards / results

### Phase 4
- multi-language
- mobile app reuse via same API
- admin content management

---

## Final Product Principle

Arcana Mirror should feel like:

- a symbolic mirror
- a private ritual
- a calm digital sanctuary
- a guided moment of reflection

It should not feel like:

- a noisy fortune gimmick
- a fear-based prediction tool
- a cheap occult template site