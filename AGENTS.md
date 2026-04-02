# AGENTS.md

## Project Overview

This project is a tarot web application with a hybrid product direction:

- A: mystical and ritual-driven visual atmosphere
- B: modern healing and reflective interpretation style

The goal is to create an immersive but credible tarot experience that feels elegant, emotionally resonant, and easy to use.

This is a full-stack web project with separated frontend and backend:

- Frontend: Next.js
- Backend: NestJS
- Database: PostgreSQL
- ORM: Prisma

---

## Primary Product Direction

The product should feel:

- mysterious, but not cheap
- spiritual, but not superstitious
- reflective, not deterministic
- elegant, not overloaded
- emotionally warm, not frightening

Avoid turning the product into a "fortune-telling gimmick" site.
Avoid overly absolute predictions, fear-driven language, and low-quality occult aesthetics.

Preferred tone:

- introspective
- calm
- symbolic
- poetic but understandable
- psychologically supportive

---

## Core Product Goals

1. Let users ask a question and draw tarot cards in a ritual-like flow
2. Provide meaningful interpretations for single-card and spread readings
3. Build long-term extensibility for card library, reading history, and personalized experiences
4. Maintain a clean architecture suitable for future mobile API reuse

---

## Agent Roles

### 1. Product Agent
Responsibilities:
- refine product flows
- define user stories
- clarify feature scope
- maintain consistency between mystical atmosphere and healing tone
- improve copywriting and UX wording

Should focus on:
- homepage messaging
- question input flow
- spread selection logic
- reading result structure
- feature prioritization

Should not:
- invent implementation details without confirming alignment with the current architecture
- introduce unnecessary complexity into MVP

---

### 2. Design Agent
Responsibilities:
- design UI layout and component hierarchy
- define visual system
- ensure the product reflects the A+B hybrid style
- maintain consistency across homepage, draw flow, reading result pages, and card library

Design principles:
- dark but clean background
- restrained gold / violet accents
- generous spacing
- elegant typography
- ritual-like transitions
- mobile-first layout
- clear hierarchy in reading results

Should focus on:
- card component
- spread layout
- draw animation flow
- result page composition
- empty/loading/error states

Should not:
- overuse decorative occult graphics
- create cluttered screens
- sacrifice readability for style

---

### 3. Frontend Agent
Responsibilities:
- implement Next.js pages and reusable UI components
- connect frontend to backend APIs
- manage local and server state
- build responsive interactions for card draw and result display

Must follow:
- App Router structure
- modular component organization
- accessible interactions
- predictable error handling
- no hardcoded API hosts outside env usage

Should focus on:
- homepage
- single-card draw page
- three-card spread page
- reading result page
- card library page
- auth pages if enabled later

Should not:
- put backend business logic in frontend
- mix temporary mock structures with final feature code without labels

---

### 4. Backend Agent
Responsibilities:
- implement NestJS modules, controllers, services, guards
- define tarot-related entities and reading logic
- expose stable APIs for frontend and future mobile clients
- persist card metadata and reading history

Must follow:
- module-based NestJS structure
- DTO validation
- clean service separation
- Prisma-based persistence
- stable REST API contracts

Should focus on:
- auth module
- tarot cards module
- reading generation module
- reading history module
- user module

Should not:
- couple backend responses to a single frontend-only rendering need
- return inconsistent response shapes across endpoints

---

### 5. Test / Review Agent
Responsibilities:
- verify flow correctness
- validate API contracts
- review reading logic consistency
- test loading/error/edge cases
- check emotional tone of content

Must check:
- draw flow works from start to result
- single-card and three-card reading APIs return valid data
- no deterministic or harmful wording in interpretation
- API errors are handled cleanly on frontend
- database writes happen correctly for reading history

---

## Collaboration Rules

### General
- Prefer small, focused changes
- Keep UI and product language consistent with the hybrid vision
- Favor maintainability over flashy hacks
- Document assumptions in code or comments only when necessary

### Frontend / Backend Contract
- Frontend must consume stable REST endpoints
- Backend must define clear DTOs and response shapes
- Reading result JSON should be structured for rendering, not as a single raw text blob only

### UI Consistency
- Every screen must support:
  - loading
  - error
  - empty
  - success
- Card draw interactions must feel intentional and smooth
- Results must be readable on mobile

---

## MVP Scope

The MVP should include only:

1. Homepage
2. Single-card reading
3. Three-card reading (past / present / future)
4. Reading result page
5. Card library page

Optional later:
- login/register
- reading history
- daily draw
- saved readings
- shareable images
- advanced spreads

Do not expand beyond MVP unless explicitly requested.

---

## Tone and Content Rules

Interpretations must:
- encourage reflection
- offer perspective
- avoid absolute claims
- avoid fear-based prediction
- avoid manipulative emotional framing

Use language like:
- "This card suggests..."
- "You may be in a phase where..."
- "This spread invites you to reflect on..."
- "A useful next step may be..."

Avoid language like:
- "This will definitely happen"
- "Disaster is coming"
- "You must leave immediately"
- "Your fate is fixed"

---

## Technical Constraints

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- modular components
- API access through env-configured base URL

Backend:
- NestJS
- Prisma
- PostgreSQL
- DTO validation
- JWT auth if user system is enabled

Do not introduce:
- unnecessary microservices
- GraphQL unless explicitly requested
- complex state libraries without clear need
- excessive animation libraries unless justified

---

## File / Module Guidance

Suggested frontend areas:
- app/
- components/
- features/tarot/
- features/reading/
- features/cards/
- lib/api/

Suggested backend modules:
- auth
- users
- tarot-cards
- readings
- history

---

## Success Criteria

This project succeeds when:

- the homepage quickly communicates the product mood and value
- the draw flow feels ritual-like but smooth
- the result page feels emotionally meaningful and readable
- the system architecture stays clean for long-term expansion
- the experience feels premium, not gimmicky