# Baseline Training Hub — Design Spec
**Date:** 2026-06-03  
**Project:** `baseline-training-hub`  
**Status:** Approved

---

## What We Are Building

A web app for onboarding new CS hires at Cloud9, a short-term rental company in Chicago. New hires work through 6 sections (5 with tests + 1 quick reference) and a final test. The app tracks their progress, scores their answers, and automatically sends results after every attempt. The entire thing runs without supervision — no one needs to be present.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS — no external UI libraries |
| Email | Resend |
| Scoring | Anthropic `claude-sonnet-4-20250514` — server-side only, never mentioned in UI |
| Deployment | Vercel |
| Persistence | localStorage |
| Font | Plus Jakarta Sans (Google Fonts) |

### Setup Commands
```bash
npx create-next-app@latest cloud9-training-hub --typescript --tailwind --app
cd cloud9-training-hub
npm install resend @anthropic-ai/sdk
```

### Environment Variables (`.env.local`)
```
ANTHROPIC_API_KEY=your_key_here
RESEND_API_KEY=your_key_here
SEND_TO_EMAIL=recipient_email_here
```

---

## Critical UI Rules

- Never mention Claude, AI, Anthropic, or any scoring technology anywhere in the UI
- Never name the recipient of results anywhere in the UI
- Never reference who built or powers this tool
- Results send silently in the background — no confirmation screen beyond "Results sent"
- Loading states say "Checking your answers…" — never "AI is scoring" or similar
- No marketing language, no credits, no "powered by"

---

## Visual Design System

| Token | Value |
|---|---|
| Page background | `#f5f4f0` (warm off-white) |
| Card background | `#faf9f6` |
| Card border | `#e8e4dc` |
| Primary text | `#1a1a1a` |
| Secondary text / meta | `#999` / `#bbb` |
| Accent (sage) | `#87a87e` |
| Accent background | `#eef3ec` |
| Border radius (cards) | `12px` |
| Border radius (frame) | `16px` |
| Border radius (pills/badges) | `99px` |

The sage accent is used in exactly two places: the progress bar fill and the "Passed" badge. Nowhere else.

---

## File Structure

```
/app
  page.tsx                        — home: name entry + section progress cards
  /section/[id]/page.tsx          — study content for a section
  /test/[id]/page.tsx             — test questions, scoring, results, restart logic
  /final-test/page.tsx            — final test combining all sections
/app/api
  /score/route.ts                 — calls Anthropic API, returns pass/fail + feedback
  /send-results/route.ts          — sends attempt results via Resend
/lib
  sections.ts                     — all section content, questions, and scoring criteria
  types.ts                        — TypeScript types
/components
  SectionCard.tsx                 — progress card on home page
  TestQuestion.tsx                — single question with optional context block + textarea
  ResultsView.tsx                 — results after an attempt (per-question + run status)
  StudyContent.tsx                — renders study content for a section
  GuestJourneyFlowchart.tsx       — CSS/HTML flowchart for the "When You're Not Sure" section
```

---

## Data Model (localStorage)

Stored under key `bth_state`. Structure:

```typescript
interface AppState {
  traineeName: string
  sections: Record<string, SectionProgress>
}

interface SectionProgress {
  status: 'not-started' | 'in-progress' | 'passed'
  attempts: Attempt[]           // full history, oldest first
  consecutiveCleanRuns: number  // resets to 0 on any failed run
}

interface Attempt {
  runNumber: number
  isCleanRun: boolean
  timestamp: string
  questions: QuestionResult[]
}

interface QuestionResult {
  questionText: string
  contextText?: string          // guest message or scenario shown with the question
  answer: string
  pass: boolean
  feedback: string
}
```

---

## Section Order and Gating

Sections are sequential. A section is locked until the previous section is passed. The trainee cannot skip ahead.

| # | Section ID | Title | Questions | Has Test |
|---|---|---|---|---|
| 1 | `before-you-reply` | Before You Reply | 4 | Yes |
| 2 | `reading-the-message` | Reading the Message | 4 | Yes |
| 3 | `writing-the-reply` | Writing the Reply | 4 | Yes |
| 4 | `when-youre-not-sure` | When You're Not Sure | 1 | Yes |
| 5 | `common-situations` | Common Situations | 4 | Yes |
| 6 | `quick-reference` | Quick Reference | — | No |
| — | `final-test` | Final Test | 6 | Yes |

After all 6 sections are complete, the Final Test unlocks. Passing the final test shows a completion summary page.

---

## Test Protocol Logic

- Each question is scored **pass or fail** based on whether the trainee covered all required criteria
- A **run** = one complete attempt through all questions in a test
- A **clean run** = every question passes
- **Two consecutive clean runs** = section is PASSED
- If **any question fails**: the current run fails — restart from Q1 immediately
- The consecutive clean run counter resets on any failed run
- Unlimited attempts are allowed
- Every attempt (pass or fail) is tracked and sent via email

---

## Home Page

- If no name is stored: show name entry form (single input + "Start" button). Name is saved to localStorage on submit.
- If name is stored: show welcome header with name and section cards.
- Section cards show: section number, title, status badge (Not Started / In Progress / Passed), attempt count.
- Progress bar at the top showing sections completed out of total.
- Locked sections are rendered at reduced opacity and are not clickable.
- Each card has two CTAs: "Study" (always shown, goes to study page) and "Take test" (shown once the section is unlocked, goes to test page). Quick Reference only shows "Study" — no test button. Passed sections additionally show a "Review" link. Attempt count is shown on cards for sections that have a test.

---

## Study Page (`/section/[id]`)

- Readable, well-spaced, scrollable content
- Screenshot placeholders rendered as a styled grey box with the label text (e.g. "Screenshot: Guesty side panel — payout, guest count, dates, unit"). Easy to swap for a real `<img>` later.
- The "When You're Not Sure" section includes the `GuestJourneyFlowchart` component rendered inline as a CSS/HTML diagram — no SVG, no third-party library.
- "When You're Not Sure" also includes the four holding-message examples rendered in a visually distinct block (subtle background, left border) — clearly formatted but not styled as blockquotes.
- Bottom of page: "Start test" button (or "Quick Reference" section gets a "Done — mark as complete" button instead).
- Marking Quick Reference as done sets its status to `passed` in localStorage and returns the trainee to the home page.

---

## Test Page (`/test/[id]`)

- Section heading with attempt count shown at the top
- All questions displayed on one page, in order
- Each question block:
  - Question number label (e.g. "Question 1") in sage accent colour
  - If the question includes a guest message or scenario context: shown in a distinct indented block (warm grey background, left border, italic text)
  - Question text in medium weight
  - Textarea for answer (expands with content, min-height ~72px, sage border on focus)
- Single "Submit answers" button at the bottom
- Loading state: "Checking your answers…" replaces the button while scoring is in progress
- On error from scoring API: show inline error with "Try submitting again" — do not silently pass or fail

---

## Results View (shown after submit)

- Run status banner at the top:
  - **Clean run:** sage-tinted banner — "Run complete — X of 2 consecutive clean runs achieved"
  - **Failed run:** soft red-tinted banner — "Run failed — restart from Question 1 to try again. Consecutive clean runs: 0 of 2."
  - **Passed:** sage banner — "Section passed — well done."
- Per-question breakdown:
  - Pass/Fail badge in sage (pass) or soft red (fail)
  - Question label
  - Feedback text (from Anthropic, written as an experienced CS lead)
- After a failed run: "Restart from Question 1" button (primary) + "Review study content" ghost button
- After a passed section: "Continue to next section" button
- Results are sent via `/api/send-results` in the background immediately after scoring completes. A small "Results sent" note appears (no full confirmation screen needed).

---

## Final Test (`/final-test`)

- Same UI as section tests
- No section labels — questions are not attributed to their source sections
- 6 questions total (two scenarios of 3 questions each)
- Passes on two consecutive clean runs, same as sections
- After passing: show completion summary page

---

## Completion Summary Page

Shown after the Final Test is passed. Displays:
- Trainee name
- Date completed
- Per-section: section name, total attempts, passed status
- Final test: total attempts
- A brief closing message

---

## API Routes

### `/api/score` — POST

**Input:**
```typescript
{
  sectionId: string
  questionText: string
  contextText?: string    // guest message or scenario shown with the question
  answer: string
  criteria: string
}
```

**System prompt sent to Anthropic:**
```
You are evaluating a CS trainee at Cloud9, a short-term rental hospitality company in Chicago. Your job is to determine whether their answer covers all the required criteria completely. Be specific and honest — if they missed any required element, it is a fail. Do not be lenient. Partial coverage is a fail. Reply ONLY with a valid JSON object in this exact format, no other text:
{"pass": true, "feedback": "specific feedback on what they covered well"}
or
{"pass": false, "feedback": "specific feedback explaining exactly what was covered and exactly what was missing"}
Your feedback must be specific and reference the actual content of their answer. Do not mention AI, Claude, or automated scoring in your feedback. Write feedback as if you are an experienced CS lead reviewing their work.
```

**Output:** `{ pass: boolean, feedback: string }`

**Error handling:** If the Anthropic call fails or returns malformed JSON, return a 500 with a message the UI can surface to the trainee ("Something went wrong — please try submitting again").

---

### `/api/send-results` — POST

**Input:**
```typescript
{
  traineeName: string
  sectionName: string
  attempts: Attempt[]
  passed: boolean
  consecutiveCleanRuns: number
}
```

**Process:** Format and send via Resend to `process.env.SEND_TO_EMAIL`.  
**From:** `training@yourdomain.com` (domain configured in Resend)  
**Subject:** `[Trainee name] — [Section name] — [Passed / In Progress]`

**Email format:**
```
Trainee: [name]
Section: [section name]
Date: [date and time]
Status: [Passed / In Progress — X of 2 consecutive clean runs achieved]
Total attempts: [n]

---

ATTEMPT [n] — [Clean run ✓ / Failed ✗]

Q1: [question text]
[Context: guest message or scenario text, if applicable]
Answer: [their answer]
Result: [Pass / Fail]
Feedback: [specific feedback]

[repeat for all questions in this attempt]

---

[repeat for all attempts, oldest first]
```

Every attempt is included, oldest first. The context block (guest message / scenario) is included for any question that had one — the email should contain everything needed to understand what the trainee was responding to.

---

## Section Content: Questions and Scoring Criteria

All section content, questions, and scoring criteria are stored in `lib/sections.ts`. The full content is reproduced below as the authoritative source.

---

### Section 1 — Before You Reply (`before-you-reply`)

**Study content title:** Before you reply

**Core principle:** Check before you type. Never answer a guest message from memory or instinct. Every reply starts with checking.

**Always check before any reply:**
1. Read the entire message — identify every single question being asked.
2. Check the dates — check-in and check-out dates of their reservation.
3. Check the guest count — how many guests vs the unit capacity.
4. Check the total payout — the value of the booking matters for context.
5. Read the full conversation thread — what have you already said? What did you promise to follow up on?

**Check based on message type:**
- Availability question → check the Guesty calendar for those dates
- Parking question → check the parking calendar in Guesty (unlisted section, search by building number)
- Pre-arrival or check-in related → check Guesty reservation statuses (T&S, Documentation, Deposit) + Breezeway cleaning status and maintenance flags

**Screenshot placeholder:** "Screenshot: Guesty side panel — payout, guest count, guest list, unit capacity, dates, and unit number — each field labelled"

**Goal:** Come back with a reply that answers everything so the guest does not have to follow up. Anticipate the next question and answer it before they ask it.

---

**Q1:** Walk me through everything you check before replying to any guest message, in the order you check it.

*Scoring criteria:* Must cover — (1) reading the entire message first and identifying every question in it, (2) checking the dates, (3) checking guest count against unit capacity, (4) checking the booking payout/value, (5) reading the prior conversation thread if there is one, (6) that what you check next depends on the message type — availability means checking the calendar, parking means checking the Guesty unlisted section, pre-arrival means checking Guesty statuses and Breezeway. Must convey the principle that you check before you reply, not as you go. Fail if any of these core elements are missing.

---

**Q2:** A guest sends you a message asking whether they can add a parking spot, and also mentions they're arriving next Friday. What do you check before you reply?

*Scoring criteria:* Must cover — (1) reading the full message to see if there are other questions beyond parking, (2) checking the reservation dates, (3) checking whether the guest has already completed verification (pre-verification: they can add parking at the end of the verification link; post-verification: must be handled manually), (4) going to the Guesty calendar unlisted section and searching by building number to check parking availability for their dates, (5) checking the parking price per night on the calendar — most buildings are $50/night but some are $100, always verify and never quote from memory, (6) noting that Friday is coming up soon which adds time pressure. Fail if: trainee does not check verification status, does not mention the Guesty unlisted section specifically, or does not mention verifying the price.

---

**Q3:** A guest who is currently staying messages to say water is dripping from the ceiling in their bathroom. What do you check before you reply, and what makes this different from a standard maintenance request?

*Scoring criteria:* Must identify — (1) this is an emergency — a leak is not a standard maintenance issue and must be treated with urgency, (2) check the unit and building details in Guesty to confirm exactly which unit and building, (3) check the Building Maintenance Document for that building's emergency contact — a leak requires a real-time call to the front desk, not a portal submission or email first, (4) assess severity from the message: is this a drip or active flooding — the response and urgency differ significantly, (5) check whether there are Cloud9 units or occupied units directly above them as this affects who else needs to be contacted, (6) log in ClickUp Tier 1 immediately even before replying to the guest. Fail if: trainee treats this as a standard non-urgent maintenance request, does not identify calling the building as the first action, or does not note that severity needs to be established.

---

**Q4:** A guest messages asking if they can check out at 2pm instead of 11am. You can see the next check-in for that unit is at 4pm today. What do you check before you reply?

*Scoring criteria:* Must cover — (1) confirming their checkout is indeed today in Guesty, (2) the next guest checks in at 4pm — this is already known, (3) checking how long the cleaning team needs for that unit — if cleaning takes 2 hours and the next guest arrives at 4pm, a 2pm checkout leaves no buffer and cannot be approved without checking this first, (4) checking whether a late checkout fee applies for that property, (5) checking whether the cleaner is already scheduled and at what time, (6) recognising this is time-sensitive and needs a quick answer. Fail if: trainee simply approves or denies without checking the cleaning window, does not factor next check-in time against cleaning requirements, or does not mention whether a late checkout fee applies.

---

### Section 2 — Reading the Message (`reading-the-message`)

**Study content title:** Reading the message

**How to read a message properly:**
1. Read the entire message — not just the first sentence.
2. Count the questions — if there are three questions, you are writing a reply that answers three questions.
3. Read the tone and emotional state — stressed, confused, excited, or upset? This changes how you open your reply.
4. Understand what they actually need vs what they literally asked — "just checking everything is fine" often means they are anxious and need reassurance.
5. Read the full conversation thread — what has already been said? What was promised?
6. Note what you need to check before you start typing.

---

**Q1 (with guest message context):**

*Context shown to trainee:*
> "Hi, I just wanted to double check — we're arriving Thursday evening around 7pm, there will be 4 of us including one baby. Is there a crib available? Also is parking possible? And one more thing — is the building easy to find? First time in Chicago so a bit nervous about navigating!"

*Question:* How many questions is this guest asking, what is their emotional state, and what do you need to check before you reply?

*Scoring criteria:* Must identify — (1) there are at least 4 things being asked: whether a crib/pack-n-play is available, parking availability, directions/how to find the building, and the 7pm arrival time implies they want to confirm they'll have access at that time, (2) the guest is a first-time visitor who is slightly anxious — the reply needs warmth and reassurance, not just information, (3) needs to check: whether a pack-n-play is available and how to arrange it for their dates, parking availability in the Guesty unlisted section for those dates, building access information/directions for their specific building, confirmation that the reservation has 4 guests on it and that 7pm is within normal check-in hours. Fail if: trainee misses any of the 4 questions, does not read the emotional tone, or does not identify what needs checking before replying.

---

**Q2 (with conversation thread context):**

*Context shown to trainee:*
> Message 1 (guest): "Hey, can we do an early check-in on Saturday? We're arriving at 10am."
> Reply 1 (agent): "Hi! I'll check if that's possible and get back to you."
> Message 2 (guest): "Also, we have a dog — is that okay?"

*Question:* This is the full conversation thread. The guest has sent a second message. What is still outstanding from the first exchange, and what does the second message require you to address?

*Scoring criteria:* Must identify — (1) the first message asked for early check-in and the agent said they would check and get back — this is still outstanding and unresolved, it cannot be ignored now that a second message has arrived and must be addressed in the same reply, (2) the second message asks about bringing a dog — this requires telling the guest that Cloud9 is not pet friendly. The trainee must NOT say to volunteer service animal information proactively in their reply to the guest, (3) both items must be addressed in the same reply. Fail if: trainee ignores the outstanding early check-in promise, or if they say the reply should proactively mention service animals.

---

**Q3 (with guest message context):**

*Context shown to trainee:*
> "Hi, just a quick question — is the heating supposed to make that noise? Also the shower pressure seemed a bit low this morning, and it would be great to know where the extra towels are? Thanks so much!"

*Question:* How many things is this guest raising, what is their emotional state, and what should you be reading between the lines here?

*Scoring criteria:* Must identify — (1) there are three things raised: a heating noise, low shower pressure, and a towels request — but the first two are potential maintenance issues dressed up as polite questions, (2) the guest is being deliberately polite and downplaying — words like "a bit low" and "that noise" soften what may be real complaints, (3) reading between the lines: the guest may be uncomfortable or frustrated but does not want to seem difficult — the reply needs to take these seriously even though they have been framed gently, (4) the practical request (towels) is easy to answer but should not distract from addressing the two potential maintenance issues, (5) needs to check: whether the heating noise is normal for that unit or a known issue, whether the shower pressure is a unit-specific problem or building-wide. Fail if: trainee treats the heating and shower pressure as minor polite comments rather than potential maintenance issues, or misses the guest's downplaying tone and what it actually signals.

---

**Q4 (with guest message context):**

*Context shown to trainee:*
> "I just wanted to let you know that the experience so far hasn't been what we expected. The unit smells musty, the dishwasher isn't working, and the TV remote doesn't work. I'll be leaving a review after my stay."

*Question:* How many issues is this guest raising, what does the mention of a review tell you, and what must you not do in your reply?

*Scoring criteria:* Must identify — (1) three specific issues: musty smell, broken dishwasher, TV remote not working — these are all real and need to be addressed, (2) the mention of a review is a signal that the guest is unhappy and considering how they will report this publicly — it must be taken seriously without panicking, (3) what must NOT be done: offer compensation before the guest checks out — this is a firm rule. Offering compensation during a stay risks complications if the guest has caused damage that only becomes visible at checkout, (4) the right approach: acknowledge all three issues with genuine empathy, take clear action on each one, give clear timelines, but make no promises about compensation, (5) tone: this guest is unhappy and signalling it — the reply needs real acknowledgement, not a scripted response. Fail if: trainee offers or mentions compensation, ignores the review mention entirely, or addresses only some of the three issues.

---

### Section 3 — Writing the Reply (`writing-the-reply`)

**Study content title:** Writing the reply

**Formula for any guest interaction:**
1. Acknowledge — before you give information, acknowledge what they said. For problems: empathy. For excitement or good news: match their energy. Never jump straight to the answer.
2. Answer every question — every single one.
3. State the next step clearly — "I will" not "I think" or "maybe".
4. If you need time to check — say so and give a timeframe.

**Tone:**
- Match the guest's energy.
- Always decisive. "I'll get this sorted for you now" not "I'll try to look into that."
- Never uncertain language: "I think", "maybe", "possibly", "I'm not sure but".

**Variation across a conversation:**
- If you have already replied to this guest, your next message cannot open the same way.
- Vary openings, sentence length, and level of warmth.

**Using templates or AI tools:**
- Fine for efficiency. You must read the full draft before sending. Every single time.
- Warning signs a message was not read before sending: "Certainly!", "Of course!", "I hope this message finds you well", bullet points for a simple answer, overly formal language when the guest was casual, same structure as your last reply.

**Common mistakes:**
- Solving before acknowledging
- Missing one of the questions
- Sending the same structure multiple times in a row
- Uncertain language
- Not confirming what happens next

---

**Q1 (with guest message context):**

*Context shown to trainee:*
> "Hi there — the hot water in the bathroom isn't working, we've been without it since this morning and it's been quite stressful. We have a baby with us. Can someone sort this as soon as possible?"

*Question:* Write a reply to this guest.

*Scoring criteria:* Must — (1) acknowledge the situation with empathy BEFORE giving information or next steps — the guest has a baby, this has been happening since morning, this is stressful and that needs to be acknowledged first, (2) be decisive — "I'm contacting maintenance now" not "I'll try to get someone", (3) give a clear next step and a timeframe, (4) sound like a human — warm, not robotic, not starting with "Certainly!" or a similarly canned opener, (5) use no uncertain language, (6) address the implicit question which is whether this will be fixed and when. Fail if: reply starts with information rather than empathy, uses uncertain language, sounds like it was copy-pasted from a template without editing, or does not give a clear next step with a timeframe.

---

**Q2 (with context block):**

*Context shown to trainee:*
> Context: This is your second message to this guest today. Your first reply started with: "Hi Sarah! Thanks so much for reaching out, I completely understand how frustrating this must be."
> Guest's second message: "Any update on the hot water? It's been 2 hours."

*Question:* Write a reply to this guest's second message.

*Scoring criteria:* Must — (1) NOT open with "Hi Sarah! Thanks so much" or any opener with the same structure and energy as the first reply, (2) be appropriately shorter and more direct since context is already established, (3) give a concrete update or a concrete new timeframe — not a vague "I'm still working on it", (4) acknowledge that 2 hours is a significant amount of time without making excuses, (5) vary in tone and structure from the first reply. Fail if: reply has the same structure or opener as the first, fails to give a concrete update, or uses vague language about ongoing efforts without a clear next milestone.

---

**Q3 (with guest message context):**

*Context shown to trainee:*
> "The street noise has been going since 6am. We booked this for a quiet stay and this is really not what we expected. We're very disappointed."

*Question:* Write a reply to this guest.

*Scoring criteria:* Must — (1) open with genuine empathy — being woken at 6am is a real problem and the guest's disappointment is valid, (2) be honest that street noise is outside Cloud9's control — do not make promises you cannot keep, (3) offer what actually can be done: remind them there are earplugs in the bedside tables of all bedrooms, (4) not be defensive or dismissive, (5) not offer compensation — per Cloud9 policy, compensation is never offered before checkout, (6) close with warmth and a genuine offer to help with anything else, (7) sound like a human being who understands the frustration. Fail if: trainee offers compensation or hints at it, is dismissive of the guest's disappointment, does not mention the earplugs, or sounds robotic and detached.

---

**Q4 (with guest message context):**

*Context shown to trainee:*
> "What's the WiFi password?"

*Question:* Write a reply to this guest.

*Scoring criteria:* Must — (1) give a short, direct reply — this is a simple question and does not warrant a long response, (2) include the actual password or a clear instruction on where to find it (e.g. on the card on the kitchen counter / on the router in the hallway), (3) not over-explain, not add unnecessary sentences, not open with "Certainly!" or "Of course!", (4) sound warm and human in one or two lines, (5) optionally add one helpful line if relevant (e.g. network name if there are multiple). Fail if: the reply is more than 3–4 lines for such a simple question, uses a robotic opener, or turns a one-word answer into a formal paragraph.

---

### Section 4 — When You're Not Sure (`when-youre-not-sure`)

**Study content title:** When you're not sure

**Step 1 — Reply immediately. Even without an answer.**

Before doing anything else, send the guest a holding message. It acknowledges what they said, reassures them something is happening, and thanks them for their patience.

Example holding messages (show in a distinct styled block — not to be copied verbatim):

*When something has gone wrong:*
> "Thank you so much for letting us know — I can completely understand how frustrating this must be. I'm looking into this right now and checking in with the team to make sure we handle it properly. I'll keep you updated and won't leave you without an answer. Really appreciate your patience while we get this sorted."

*When you don't know the answer:*
> "Hi [name], thanks so much for reaching out. I want to make sure I give you the right answer on this, so I'm just going to check in with the team quickly. I'll get back to you shortly with a full update — thank you so much for your patience!"

*When you need to escalate:*
> "Hi! Thanks for flagging this — I'm escalating it to the right person right now to make sure it gets handled correctly. I'll follow up as soon as I have an update and keep you in the loop throughout. Really appreciate your patience."

*When it's a building or maintenance issue:*
> "Thanks so much for letting us know about this. I'm checking with the building right now to get you the right information and make sure this is dealt with properly. I'll keep you updated — won't be long. Thank you for your patience!"

**Step 2 — Think before you ask anyone.**
- What category does it fall into: maintenance, money/claims, building access, operations?
- Maintenance → Building Maintenance Document first, then call the building. Building unresponsive → contact Althea.
- Money/charge/refund/claim → Luisa.
- Building access or operations → Althea.
- Have you seen this before in training, a colleague's situation, or the SOPs? Think back.

**Step 3 — Ask properly if you still don't know.**
- Don't say: "I don't know what to do."
- Do say: "Guest in unit 215.2702 is asking about X. I've checked Y and Z. Not sure whether to contact the building or Althea on this one — what do you think?"
- Give the situation, say what you've already checked, say specifically what you need.

**Step 4 — Update the guest.**
As soon as you have something — even "still working on this, expect an update in 30 minutes" — message the guest again. Don't wait until everything is fully resolved.

**The balance:** Every decision has two sides — making things as easy as possible for the guest, and protecting the company. Think about what a reasonable, experienced person would do. Calm down, go back to basics, communicate.

**Guest journey flowchart** (rendered as a CSS/HTML diagram using `GuestJourneyFlowchart` component):

```
Guest sends an inquiry (30–35% of bookings) → CS responds → Guest books
OR
Guest books directly (60–65% of bookings)
↓ Reservation confirmed
↓ Automated verification sent (Lighthouse — identity check + deposit)
↓ CS pre-arrival checks (Guesty statuses, Breezeway, parking, ECI, special requests)
↓ Check-in (access code sent, unit ready, building access confirmed)
↓ During stay (maintenance, requests, complaints — CS responds)
↓ Checkout (guest leaves, keys/parking pass left, cleaning assigned in Breezeway)
↓ Post-stay (review monitoring, claims if applicable)
```

---

**Q1:** You receive a message from a guest about a situation you have genuinely never seen before. It's your shift, it's quiet, and there's nobody immediately available to ask. Walk me through exactly what you do from the moment you read the message.

*Scoring criteria:* Must include — (1) reply to the guest immediately with a holding message before doing anything else — do not leave them without a response while you figure things out, (2) think through what category the situation falls into: maintenance, money/claims, building access, operations — before asking anyone, (3) check relevant resources first: Building Maintenance Document, SOPs, anything they've been shown in training, (4) if they still need help: ask specifically — give the situation, what they've checked, what they need — not a vague "I don't know what to do", (5) update the guest again once they have something to say, even if it's just a progress update. Fail if: trainee does not mention replying to the guest first, asks for help without any prior thinking or checking, or does not update the guest after getting an answer.

---

### Section 5 — Common Situations (`common-situations`)

**Study content:** Displayed as individual expandable/separated cards, one per situation.

Cards: Parking requests · Pet requests · Luggage storage · Noise complaints · Maintenance issues and emergencies · Claims and damage · VIP guests · Orphan nights (Betsy)

*(Full card content for all 8 cards — Parking requests, Pet requests, Luggage storage, Noise complaints, Maintenance issues and emergencies, Claims and damage, VIP guests, Orphan nights — must be implemented verbatim in `lib/sections.ts`. Use the original training spec provided by Elise as the authoritative source for this content.)*

---

**Q1:** A guest messages asking if they can bring their dog for their 5-night stay. Walk through exactly how you handle this.

*Scoring criteria:* Must — (1) tell the guest Cloud9 is not pet friendly, (2) NOT proactively mention service animals in the response to the guest at this point, (3) if the answer goes on to describe how to handle it if the guest then says it is a service animal: collect proof of registration, breed, weight, photo, immunisation records, and what service the animal provides — then discuss with Althea before any other action — then email building management with all documentation — then follow up with a call. Fail if: the trainee proactively mentions service animals before the guest brings it up, or fails to involve Althea before contacting the building, or says the answer to a pet request is anything other than no.

---

**Q2:** It is 10pm and a guest messages to say there is no hot water in their unit. Walk through your full process.

*Scoring criteria:* Must cover — (1) recognise this is urgent, (2) first action is to call the building immediately — not submit a portal request or send an email first, (3) get the name of the person spoken to when calling, (4) after calling, submit through the building's maintenance channel (Livly or resident portal), (5) send a follow-up email to the building, (6) log the issue in ClickUp Tier 1, (7) stay on top of it — call again if no update, (8) if the building is unresponsive: contact Althea on the WhatsApp group chat. Fail if: trainee starts with an email or portal submission instead of calling, does not mention logging in ClickUp, does not mention following up if no response, or does not mention contacting Althea if the building is unresponsive.

---

**Q3:** A guest who completed verification last week messages asking to add a parking spot for their 4-night stay next week. Walk through how you handle this.

*Scoring criteria:* Must cover — (1) this is Scenario B — guest has already completed verification, so it must be handled manually, (2) go to Guesty calendar unlisted section, search by building number, check if a spot is available for their dates, (3) check the price per night on the calendar — verify it, do not assume it is $50, (4) give the guest the price and total and get their explicit confirmation they are happy to be charged on the card on file BEFORE charging anything, (5) once confirmed: add a manual block on the parking calendar for those dates with the guest's name, (6) create a ClickUp task in the Claims channel formatted as "Please charge [guest name] ([reservation number]) [$amount] for parking ([X] nights)" and assign to Luisa. Fail if: trainee charges the card without getting guest confirmation first, skips verifying the price on the calendar, or does not create the ClickUp task for Luisa.

---

**Q4:** Althea has just posted photos in the WhatsApp group showing a damaged bathroom mirror and a stained mattress in a unit where the guest checked out this morning. You are the first person to respond in the group. Walk through your complete process.

*Scoring criteria:* Must cover — (1) responding first means you are now the DRI — directly responsible for this claim, (2) immediately add an internal note in Guesty on that reservation: "Claim underway - [your name] handling", (3) toggle automations OFF in Guesty immediately — kill switch, no automated messages to this guest, (4) create a task in ClickUp on the Claims & Additional Fees board — include guest name, unit, reservation number, and specify the damages, assign to Luisa for standard claim or Marcus if high-value or disputed, (5) compile evidence: Althea's photos plus "before" photos from the most recent inspection report plus a brief internal summary, (6) send the guest a neutral, professional message notifying them of the claim — not accusatory, (7) once resolved: update the Guesty internal note to Claim Resolved, keep automations OFF permanently for this guest. Fail if: trainee does not immediately toggle automations OFF, does not create the ClickUp task, sends an accusatory message to the guest, or forgets to keep automations OFF after resolution.

---

### Section 6 — Quick Reference (`quick-reference`)

**No test.** Displayed as scannable reference cards. Trainee clicks "Done — mark as complete" to finish the section.

Cards: Parking · Pets · Luggage storage · Maintenance — urgent · Noise complaints · VIP threshold · Escalation (Tier 1 / Tier 2 / Althea / Luisa)

*(Full card content for all 7 reference cards — Parking, Pets, Luggage storage, Maintenance — urgent, Noise complaints, VIP threshold, Escalation — must be implemented verbatim in `lib/sections.ts`. Use the original training spec provided by Elise as the authoritative source.)*

---

### Final Test (`final-test`)

No section labels. Two complete scenarios, 3 questions each.

---

**Scenario 1 (Q1–Q3):**

*Context shown for all three questions:*
> "Hey! Quick question — we're arriving Saturday at noon. There'll be 6 of us. Is that fine for the apartment? Also can we sort out parking? And one last thing — is there somewhere nearby to store our luggage on Sunday morning after we check out? We'd be so grateful, it's our first time in Chicago!"

**Q1:** What do you check before replying to this message, and why?

*Scoring criteria:* Must cover — (1) read the full message and identify all questions: whether 6 guests is fine for the unit, parking availability, luggage storage after checkout, and — implied — whether noon on Saturday is within normal check-in hours, (2) check the reservation to confirm it was booked for 6 guests and that the unit capacity allows it, (3) check the Guesty calendar unlisted section for parking availability on their dates, (4) note that luggage storage is not something we offer — Bounce or LuggageHero, (5) check what the standard check-in time is for that property — noon is before standard 4pm check-in, which needs to be addressed even though they did not ask, (6) read the emotional tone — they are excited and first-time visitors, the reply should match that warmth. Fail if: trainee misses the noon arrival concern, misses any of the questions, or does not check parking in the Guesty unlisted section specifically.

**Q2:** Based on your checks, what does this guest actually need — including things they have not explicitly asked about?

*Scoring criteria:* Must identify — (1) an answer on whether 6 guests is within the unit capacity, (2) parking — availability and price if available, or SpotHero/Park Chicago if not, (3) luggage storage — we do not offer it, they need Bounce or LuggageHero, (4) the noon arrival — they have not asked about check-in time but "arriving Saturday at noon" implies they expect access at noon, which is before standard check-in. A good answer proactively addresses this, (5) they are first-time Chicago visitors who seem excited — the reply should be warm and welcoming. Fail if: trainee does not flag the noon arrival concern, or treats this as a list of questions to answer in order rather than understanding what the guest actually needs.

**Q3:** Now write the reply.

*Scoring criteria:* Must — (1) open with warmth and welcome — they are excited first-timers, match that energy, (2) address all questions: guest count/capacity, parking, luggage storage, and proactively address the noon arrival without waiting for them to ask, (3) on parking: if available, give a price and offer to arrange it; if not, recommend SpotHero and Park Chicago with brief instructions, (4) on luggage storage: recommend Bounce or LuggageHero and briefly explain how they work, (5) on noon arrival: proactively let them know standard check-in is in the afternoon and offer to look into early check-in options, (6) sound like a human — warm, genuine, excited to host them, not a bulleted list, (7) decisive language throughout, no uncertain phrases, clear next steps. Fail if: trainee misses any of the four topics, uses uncertain language, sounds robotic, does not address the noon arrival concern, or opens without warmth.

---

**Scenario 2 (Q4–Q6):**

*Context shown for all three questions:*
> "Hi! Really enjoying the stay so far. One thing — the kitchen faucet has been dripping since yesterday, not a huge deal but wanted to flag it. Also, we're honestly loving it here so much we'd love to stay 2 more nights if possible? We're checking out Sunday but would love to stay until Tuesday."

**Q4:** What do you check before replying to this message?

*Scoring criteria:* Must cover — (1) read the full message: two things — a maintenance issue (dripping faucet) and a stay extension request, (2) check the reservation to confirm their current checkout date is Sunday, (3) check the Guesty calendar for that unit: are Monday and Tuesday nights available? Is there already a check-in booked? This determines whether the extension is possible and connects to the orphan nights process, (4) check Breezeway and ClickUp: has the faucet drip already been logged? (5) even though the guest said "not a huge deal" — a dripping faucet since yesterday is a maintenance issue that needs to be logged and addressed regardless. Fail if: trainee does not check calendar availability before the extension reply, or treats the faucet as optional to act on because the guest downplayed it.

**Q5:** What does this guest actually need, including things they have not explicitly asked about?

*Scoring criteria:* Must identify — (1) the faucet needs to be fixed — regardless of downplaying, it needs a maintenance log and contact with the building, (2) the extension: they want to stay until Tuesday — need to know if this is possible, and if it is, pricing needs to be confirmed (orphan nights process if those nights are currently unbooked), (3) if the extension nights were sent to the guest by Betsy as orphan nights at a 30% discount, the price must match that offer exactly, (4) a warm, personal reply that matches their positive energy. Fail if: trainee does not connect the extension request to the calendar check and orphan nights process, or does not address the faucet as a real action item.

**Q6:** Write the reply.

*Scoring criteria:* Must — (1) open warmly and match the guest's positive energy, (2) address the faucet genuinely — acknowledge it, say you are logging it and contacting maintenance now, give a timeframe, thank them for flagging, (3) address the extension — if available: confirm pricing and offer to arrange it; if not available: apologise and explain clearly, (4) be decisive throughout, (5) sound like a person who is genuinely happy they're enjoying the stay, (6) clear next steps for both the faucet and the extension. Fail if: trainee ignores or minimises the faucet, fails to address the extension with a clear answer or timeline, uses uncertain language, or sounds robotic given the guest's warm and positive tone.

---

## Implementation Notes

- Build the complete project with all content populated. Do not use placeholder text in study sections or test questions — the content above is the real content.
- Screenshot slots render as a styled grey placeholder box with label text. Make them easy to swap for an actual `<img>` later.
- The consecutive clean run logic is the most important piece to get right — test it carefully.
- The scoring API must handle Anthropic API errors gracefully — if scoring fails, show an error and let the trainee resubmit rather than silently passing or failing them.
- localStorage stores: trainee name, section progress (attempts per section, consecutive clean runs, passed status, full attempt history).
- After completing all sections including the final test, show the completion summary page.
- The `GuestJourneyFlowchart` component is a pure CSS/HTML diagram — no SVG, no third-party library.

---

## Local Dev Commands

```bash
cd cloud9-training-hub
npm run dev
# Open http://localhost:3000
```
