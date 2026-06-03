import { SectionDef, Question } from './types'

export const sections: SectionDef[] = [
  {
    id: 'before-you-reply',
    number: 1,
    title: 'Before You Reply',
    hasTest: true,
    questions: [
      {
        id: 'before-you-reply-q1',
        questionText:
          'Walk me through everything you check before replying to any guest message, in the order you check it.',
        criteria:
          "Must cover — (1) reading the entire message first and identifying every question in it, (2) checking the dates, (3) checking guest count against unit capacity, (4) checking the booking payout/value, (5) reading the prior conversation thread if there is one, (6) that what you check next depends on the message type — availability means checking the calendar, parking means checking the Guesty unlisted section, pre-arrival means checking Guesty statuses and Breezeway. Must convey the principle that you check before you reply, not as you go. Fail if any of these core elements are missing.",
      },
      {
        id: 'before-you-reply-q2',
        questionText:
          "A guest sends you a message asking whether they can add a parking spot, and also mentions they're arriving next Friday. What do you check before you reply?",
        criteria:
          "Must cover — (1) reading the full message to see if there are other questions beyond parking, (2) checking the reservation dates, (3) checking whether the guest has already completed verification (pre-verification: they can add parking at the end of the verification link; post-verification: must be handled manually), (4) going to the Guesty calendar unlisted section and searching by building number to check parking availability for their dates, (5) checking the parking price per night on the calendar — most buildings are $50/night but some are $100, always verify and never quote from memory, (6) noting that Friday is coming up soon which adds time pressure. Fail if: trainee does not check verification status, does not mention the Guesty unlisted section specifically, or does not mention verifying the price.",
      },
      {
        id: 'before-you-reply-q3',
        questionText:
          "A guest who is currently staying messages to say water is dripping from the ceiling in their bathroom. What do you check before you reply, and what makes this different from a standard maintenance request?",
        criteria:
          "Must identify — (1) this is an emergency — a leak is not a standard maintenance issue and must be treated with urgency, (2) check the unit and building details in Guesty to confirm exactly which unit and building, (3) check the Building Maintenance Document for that building's emergency contact — a leak requires a real-time call to the front desk, not a portal submission or email first, (4) assess severity from the message: is this a drip or active flooding — the response and urgency differ significantly, (5) check whether there are Cloud9 units or occupied units directly above them as this affects who else needs to be contacted, (6) log in ClickUp Tier 1 immediately even before replying to the guest. Fail if: trainee treats this as a standard non-urgent maintenance request, does not identify calling the building as the first action, or does not note that severity needs to be established.",
      },
      {
        id: 'before-you-reply-q4',
        questionText:
          "A guest messages asking if they can check out at 2pm instead of 11am. You can see the next check-in for that unit is at 4pm today. What do you check before you reply?",
        criteria:
          "Must cover — (1) confirming their checkout is indeed today in Guesty, (2) the next guest checks in at 4pm — this is already known, (3) checking how long the cleaning team needs for that unit — if cleaning takes 2 hours and the next guest arrives at 4pm, a 2pm checkout leaves no buffer and cannot be approved without checking this first, (4) checking whether a late checkout fee applies for that property, (5) checking whether the cleaner is already scheduled and at what time, (6) recognising this is time-sensitive and needs a quick answer. Fail if: trainee simply approves or denies without checking the cleaning window, does not factor next check-in time against cleaning requirements, or does not mention whether a late checkout fee applies.",
      },
    ],
  },
  {
    id: 'reading-the-message',
    number: 2,
    title: 'Reading the Message',
    hasTest: true,
    questions: [
      {
        id: 'reading-the-message-q1',
        questionText:
          "How many questions is this guest asking, what is their emotional state, and what do you need to check before you reply?",
        contextText:
          "\"Hi, I just wanted to double check — we're arriving Thursday evening around 7pm, there will be 4 of us including one baby. Is there a crib available? Also is parking possible? And one more thing — is the building easy to find? First time in Chicago so a bit nervous about navigating!\"",
        criteria:
          "Must identify — (1) there are at least 4 things being asked: whether a crib/pack-n-play is available, parking availability, directions/how to find the building, and the 7pm arrival time implies they want to confirm they'll have access at that time, (2) the guest is a first-time visitor who is slightly anxious — the reply needs warmth and reassurance, not just information, (3) needs to check: whether a pack-n-play is available and how to arrange it for their dates, parking availability in the Guesty unlisted section for those dates, building access information/directions for their specific building, confirmation that the reservation has 4 guests on it and that 7pm is within normal check-in hours. Fail if: trainee misses any of the 4 questions, does not read the emotional tone, or does not identify what needs checking before replying.",
      },
      {
        id: 'reading-the-message-q2',
        questionText:
          "This is the full conversation thread. The guest has sent a second message. What is still outstanding from the first exchange, and what does the second message require you to address?",
        contextText:
          "Message 1 (guest): \"Hey, can we do an early check-in on Saturday? We're arriving at 10am.\"\nReply 1 (agent): \"Hi! I'll check if that's possible and get back to you.\"\nMessage 2 (guest): \"Also, we have a dog — is that okay?\"",
        criteria:
          "Must identify — (1) the first message asked for early check-in and the agent said they would check and get back — this is still outstanding and unresolved, it cannot be ignored now that a second message has arrived and must be addressed in the same reply, (2) the second message asks about bringing a dog — this requires telling the guest that Cloud9 is not pet friendly. The trainee must NOT say to volunteer service animal information proactively in their reply to the guest, (3) both items must be addressed in the same reply. Fail if: trainee ignores the outstanding early check-in promise, or if they say the reply should proactively mention service animals.",
      },
      {
        id: 'reading-the-message-q3',
        questionText:
          "How many things is this guest raising, what is their emotional state, and what should you be reading between the lines here?",
        contextText:
          "\"Hi, just a quick question — is the heating supposed to make that noise? Also the shower pressure seemed a bit low this morning, and it would be great to know where the extra towels are? Thanks so much!\"",
        criteria:
          "Must identify — (1) there are three things raised: a heating noise, low shower pressure, and a towels request — but the first two are potential maintenance issues dressed up as polite questions, (2) the guest is being deliberately polite and downplaying — words like \"a bit low\" and \"that noise\" soften what may be real complaints, (3) reading between the lines: the guest may be uncomfortable or frustrated but does not want to seem difficult — the reply needs to take these seriously even though they have been framed gently, (4) the practical request (towels) is easy to answer but should not distract from addressing the two potential maintenance issues, (5) needs to check: whether the heating noise is normal for that unit or a known issue, whether the shower pressure is a unit-specific problem or building-wide. Fail if: trainee treats the heating and shower pressure as minor polite comments rather than potential maintenance issues, or misses the guest's downplaying tone and what it actually signals.",
      },
      {
        id: 'reading-the-message-q4',
        questionText:
          "How many issues is this guest raising, what does the mention of a review tell you, and what must you not do in your reply?",
        contextText:
          "\"I just wanted to let you know that the experience so far hasn't been what we expected. The unit smells musty, the dishwasher isn't working, and the TV remote doesn't work. I'll be leaving a review after my stay.\"",
        criteria:
          "Must identify — (1) three specific issues: musty smell, broken dishwasher, TV remote not working — these are all real and need to be addressed, (2) the mention of a review is a signal that the guest is unhappy and considering how they will report this publicly — it must be taken seriously without panicking, (3) what must NOT be done: offer compensation before the guest checks out — this is a firm rule. Offering compensation during a stay risks complications if the guest has caused damage that only becomes visible at checkout, (4) the right approach: acknowledge all three issues with genuine empathy, take clear action on each one, give clear timelines, but make no promises about compensation, (5) tone: this guest is unhappy and signalling it — the reply needs real acknowledgement, not a scripted response. Fail if: trainee offers or mentions compensation, ignores the review mention entirely, or addresses only some of the three issues.",
      },
    ],
  },
  {
    id: 'writing-the-reply',
    number: 3,
    title: 'Writing the Reply',
    hasTest: true,
    questions: [
      {
        id: 'writing-the-reply-q1',
        questionText: 'Write a reply to this guest.',
        contextText:
          "\"Hi there — the hot water in the bathroom isn't working, we've been without it since this morning and it's been quite stressful. We have a baby with us. Can someone sort this as soon as possible?\"",
        criteria:
          'Must — (1) acknowledge the situation with empathy BEFORE giving information or next steps — the guest has a baby, this has been happening since morning, this is stressful and that needs to be acknowledged first, (2) be decisive — "I\'m contacting maintenance now" not "I\'ll try to get someone", (3) give a clear next step and a timeframe, (4) sound like a human — warm, not robotic, not starting with "Certainly!" or a similarly canned opener, (5) use no uncertain language, (6) address the implicit question which is whether this will be fixed and when. Fail if: reply starts with information rather than empathy, uses uncertain language, sounds like it was copy-pasted from a template without editing, or does not give a clear next step with a timeframe.',
      },
      {
        id: 'writing-the-reply-q2',
        questionText: "Write a reply to this guest's second message.",
        contextText:
          'Context: This is your second message to this guest today. Your first reply started with: "Hi Sarah! Thanks so much for reaching out, I completely understand how frustrating this must be."\nGuest\'s second message: "Any update on the hot water? It\'s been 2 hours."',
        criteria:
          'Must — (1) NOT open with "Hi Sarah! Thanks so much" or any opener with the same structure and energy as the first reply, (2) be appropriately shorter and more direct since context is already established, (3) give a concrete update or a concrete new timeframe — not a vague "I\'m still working on it", (4) acknowledge that 2 hours is a significant amount of time without making excuses, (5) vary in tone and structure from the first reply. Fail if: reply has the same structure or opener as the first, fails to give a concrete update, or uses vague language about ongoing efforts without a clear next milestone.',
      },
      {
        id: 'writing-the-reply-q3',
        questionText: 'Write a reply to this guest.',
        contextText:
          '"The street noise has been going since 6am. We booked this for a quiet stay and this is really not what we expected. We\'re very disappointed."',
        criteria:
          "Must — (1) open with genuine empathy — being woken at 6am is a real problem and the guest's disappointment is valid, (2) be honest that street noise is outside Cloud9's control — do not make promises you cannot keep, (3) offer what actually can be done: remind them there are earplugs in the bedside tables of all bedrooms, (4) not be defensive or dismissive, (5) not offer compensation — per Cloud9 policy, compensation is never offered before checkout, (6) close with warmth and a genuine offer to help with anything else, (7) sound like a human being who understands the frustration. Fail if: trainee offers compensation or hints at it, is dismissive of the guest's disappointment, does not mention the earplugs, or sounds robotic and detached.",
      },
      {
        id: 'writing-the-reply-q4',
        questionText: 'Write a reply to this guest.',
        contextText: '"What\'s the WiFi password?"',
        criteria:
          'Must — (1) give a short, direct reply — this is a simple question and does not warrant a long response, (2) include the actual password or a clear instruction on where to find it (e.g. on the card on the kitchen counter / on the router in the hallway), (3) not over-explain, not add unnecessary sentences, not open with "Certainly!" or "Of course!", (4) sound warm and human in one or two lines, (5) optionally add one helpful line if relevant (e.g. network name if there are multiple). Fail if: the reply is more than 3–4 lines for such a simple question, uses a robotic opener, or turns a one-word answer into a formal paragraph.',
      },
    ],
  },
  {
    id: 'when-youre-not-sure',
    number: 4,
    title: "When You're Not Sure",
    hasTest: true,
    questions: [
      {
        id: 'when-youre-not-sure-q1',
        questionText:
          "You receive a message from a guest about a situation you have genuinely never seen before. It's your shift, it's quiet, and there's nobody immediately available to ask. Walk me through exactly what you do from the moment you read the message.",
        criteria:
          "Must include — (1) reply to the guest immediately with a holding message before doing anything else — do not leave them without a response while you figure things out, (2) think through what category the situation falls into: maintenance, money/claims, building access, operations — before asking anyone, (3) check relevant resources first: Building Maintenance Document, SOPs, anything they've been shown in training, (4) if they still need help: ask specifically — give the situation, what they've checked, what they need — not a vague \"I don't know what to do\", (5) update the guest again once they have something to say, even if it's just a progress update. Fail if: trainee does not mention replying to the guest first, asks for help without any prior thinking or checking, or does not update the guest after getting an answer.",
      },
    ],
  },
  {
    id: 'common-situations',
    number: 5,
    title: 'Common Situations',
    hasTest: true,
    questions: [
      {
        id: 'common-situations-q1',
        questionText:
          'A guest messages asking if they can bring their dog for their 5-night stay. Walk through exactly how you handle this.',
        criteria:
          "Must — (1) tell the guest Cloud9 is not pet friendly, (2) NOT proactively mention service animals in the response to the guest at this point, (3) if the answer goes on to describe how to handle it if the guest then says it is a service animal: collect proof of registration, breed, weight, photo, immunisation records, and what service the animal provides — then discuss with Althea before any other action — then email building management with all documentation — then follow up with a call. Fail if: the trainee proactively mentions service animals before the guest brings it up, or fails to involve Althea before contacting the building, or says the answer to a pet request is anything other than no.",
      },
      {
        id: 'common-situations-q2',
        questionText:
          'It is 10pm and a guest messages to say there is no hot water in their unit. Walk through your full process.',
        criteria:
          "Must cover — (1) recognise this is urgent, (2) first action is to call the building immediately — not submit a portal request or send an email first, (3) get the name of the person spoken to when calling, (4) after calling, submit through the building's maintenance channel (Livly or resident portal), (5) send a follow-up email to the building, (6) log the issue in ClickUp Tier 1, (7) stay on top of it — call again if no update, (8) if the building is unresponsive: contact Althea on the WhatsApp group chat. Fail if: trainee starts with an email or portal submission instead of calling, does not mention logging in ClickUp, does not mention following up if no response, or does not mention contacting Althea if the building is unresponsive.",
      },
      {
        id: 'common-situations-q3',
        questionText:
          'A guest who completed verification last week messages asking to add a parking spot for their 4-night stay next week. Walk through how you handle this.',
        criteria:
          "Must cover — (1) this is Scenario B — guest has already completed verification, so it must be handled manually, (2) go to Guesty calendar unlisted section, search by building number, check if a spot is available for their dates, (3) check the price per night on the calendar — verify it, do not assume it is $50, (4) give the guest the price and total and get their explicit confirmation they are happy to be charged on the card on file BEFORE charging anything, (5) once confirmed: add a manual block on the parking calendar for those dates with the guest's name, (6) create a ClickUp task in the Claims channel formatted as \"Please charge [guest name] ([reservation number]) [$amount] for parking ([X] nights)\" and assign to Luisa. Fail if: trainee charges the card without getting guest confirmation first, skips verifying the price on the calendar, or does not create the ClickUp task for Luisa.",
      },
      {
        id: 'common-situations-q4',
        questionText:
          'Althea has just posted photos in the WhatsApp group showing a damaged bathroom mirror and a stained mattress in a unit where the guest checked out this morning. You are the first person to respond in the group. Walk through your complete process.',
        criteria:
          "Must cover — (1) responding first means you are now the DRI — directly responsible for this claim, (2) immediately add an internal note in Guesty on that reservation: \"Claim underway - [your name] handling\", (3) toggle automations OFF in Guesty immediately — kill switch, no automated messages to this guest, (4) create a task in ClickUp on the Claims & Additional Fees board — include guest name, unit, reservation number, and specify the damages, assign to Luisa for standard claim or Marcus if high-value or disputed, (5) compile evidence: Althea's photos plus \"before\" photos from the most recent inspection report plus a brief internal summary, (6) send the guest a neutral, professional message notifying them of the claim — not accusatory, (7) once resolved: update the Guesty internal note to Claim Resolved, keep automations OFF permanently for this guest. Fail if: trainee does not immediately toggle automations OFF, does not create the ClickUp task, sends an accusatory message to the guest, or forgets to keep automations OFF after resolution.",
      },
    ],
  },
  {
    id: 'quick-reference',
    number: 6,
    title: 'Quick Reference',
    hasTest: false,
    questions: [],
  },
]

export const finalTestQuestions: Question[] = [
  {
    id: 'final-q1',
    questionText: 'What do you check before replying to this message, and why?',
    contextText:
      "\"Hey! Quick question — we're arriving Saturday at noon. There'll be 6 of us. Is that fine for the apartment? Also can we sort out parking? And one last thing — is there somewhere nearby to store our luggage on Sunday morning after we check out? We'd be so grateful, it's our first time in Chicago!\"",
    criteria:
      "Must cover — (1) read the full message and identify all questions: whether 6 guests is fine for the unit, parking availability, luggage storage after checkout, and — implied — whether noon on Saturday is within normal check-in hours, (2) check the reservation to confirm it was booked for 6 guests and that the unit capacity allows it, (3) check the Guesty calendar unlisted section for parking availability on their dates, (4) note that luggage storage is not something we offer — Bounce or LuggageHero, (5) check what the standard check-in time is for that property — noon is before standard 4pm check-in, which needs to be addressed even though they did not ask, (6) read the emotional tone — they are excited and first-time visitors, the reply should match that warmth. Fail if: trainee misses the noon arrival concern, misses any of the questions, or does not check parking in the Guesty unlisted section specifically.",
  },
  {
    id: 'final-q2',
    questionText:
      'Based on your checks, what does this guest actually need — including things they have not explicitly asked about?',
    contextText:
      "\"Hey! Quick question — we're arriving Saturday at noon. There'll be 6 of us. Is that fine for the apartment? Also can we sort out parking? And one last thing — is there somewhere nearby to store our luggage on Sunday morning after we check out? We'd be so grateful, it's our first time in Chicago!\"",
    criteria:
      "Must identify — (1) an answer on whether 6 guests is within the unit capacity, (2) parking — availability and price if available, or SpotHero/Park Chicago if not, (3) luggage storage — we do not offer it, they need Bounce or LuggageHero, (4) the noon arrival — they have not asked about check-in time but \"arriving Saturday at noon\" implies they expect access at noon, which is before standard check-in. A good answer proactively addresses this, (5) they are first-time Chicago visitors who seem excited — the reply should be warm and welcoming. Fail if: trainee does not flag the noon arrival concern, or treats this as a list of questions to answer in order rather than understanding what the guest actually needs.",
  },
  {
    id: 'final-q3',
    questionText: 'Now write the reply.',
    contextText:
      "\"Hey! Quick question — we're arriving Saturday at noon. There'll be 6 of us. Is that fine for the apartment? Also can we sort out parking? And one last thing — is there somewhere nearby to store our luggage on Sunday morning after we check out? We'd be so grateful, it's our first time in Chicago!\"",
    criteria:
      "Must — (1) open with warmth and welcome — they are excited first-timers, match that energy, (2) address all questions: guest count/capacity, parking, luggage storage, and proactively address the noon arrival without waiting for them to ask, (3) on parking: if available, give a price and offer to arrange it; if not, recommend SpotHero and Park Chicago with brief instructions, (4) on luggage storage: recommend Bounce or LuggageHero and briefly explain how they work, (5) on noon arrival: proactively let them know standard check-in is in the afternoon and offer to look into early check-in options, (6) sound like a human — warm, genuine, excited to host them, not a bulleted list, (7) decisive language throughout, no uncertain phrases, clear next steps. Fail if: trainee misses any of the four topics, uses uncertain language, sounds robotic, does not address the noon arrival concern, or opens without warmth.",
  },
  {
    id: 'final-q4',
    questionText: 'What do you check before replying to this message?',
    contextText:
      "\"Hi! Really enjoying the stay so far. One thing — the kitchen faucet has been dripping since yesterday, not a huge deal but wanted to flag it. Also, we're honestly loving it here so much we'd love to stay 2 more nights if possible? We're checking out Sunday but would love to stay until Tuesday.\"",
    criteria:
      "Must cover — (1) read the full message: two things — a maintenance issue (dripping faucet) and a stay extension request, (2) check the reservation to confirm their current checkout date is Sunday, (3) check the Guesty calendar for that unit: are Monday and Tuesday nights available? Is there already a check-in booked? This determines whether the extension is possible and connects to the orphan nights process, (4) check Breezeway and ClickUp: has the faucet drip already been logged? (5) even though the guest said \"not a huge deal\" — a dripping faucet since yesterday is a maintenance issue that needs to be logged and addressed regardless. Fail if: trainee does not check calendar availability before the extension reply, or treats the faucet as optional to act on because the guest downplayed it.",
  },
  {
    id: 'final-q5',
    questionText:
      'What does this guest actually need, including things they have not explicitly asked about?',
    contextText:
      "\"Hi! Really enjoying the stay so far. One thing — the kitchen faucet has been dripping since yesterday, not a huge deal but wanted to flag it. Also, we're honestly loving it here so much we'd love to stay 2 more nights if possible? We're checking out Sunday but would love to stay until Tuesday.\"",
    criteria:
      "Must identify — (1) the faucet needs to be fixed — regardless of downplaying, it needs a maintenance log and contact with the building, (2) the extension: they want to stay until Tuesday — need to know if this is possible, and if it is, pricing needs to be confirmed (orphan nights process if those nights are currently unbooked), (3) if the extension nights were sent to the guest by Betsy as orphan nights at a 30% discount, the price must match that offer exactly, (4) a warm, personal reply that matches their positive energy. Fail if: trainee does not connect the extension request to the calendar check and orphan nights process, or does not address the faucet as a real action item.",
  },
  {
    id: 'final-q6',
    questionText: 'Write the reply.',
    contextText:
      "\"Hi! Really enjoying the stay so far. One thing — the kitchen faucet has been dripping since yesterday, not a huge deal but wanted to flag it. Also, we're honestly loving it here so much we'd love to stay 2 more nights if possible? We're checking out Sunday but would love to stay until Tuesday.\"",
    criteria:
      "Must — (1) open warmly and match the guest's positive energy, (2) address the faucet genuinely — acknowledge it, say you are logging it and contacting maintenance now, give a timeframe, thank them for flagging, (3) address the extension — if available: confirm pricing and offer to arrange it; if not available: apologise and explain clearly, (4) be decisive throughout, (5) sound like a person who is genuinely happy they're enjoying the stay, (6) clear next steps for both the faucet and the extension. Fail if: trainee ignores or minimises the faucet, fails to address the extension with a clear answer or timeline, uses uncertain language, or sounds robotic given the guest's warm and positive tone.",
  },
]

export function getSectionById(id: string): SectionDef | undefined {
  return sections.find((s) => s.id === id)
}
