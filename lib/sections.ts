/**
 * All training section definitions and final test questions.
 * Criteria strings are sent verbatim to the scoring API — do not paraphrase.
 */

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
          'What do you check before replying to a guest message generally?',
        criteria:
          "Pass if the trainee mentions checking the dates, the unit and building, and the guest number. No specific order required. Fail only if the answer is missing most of these basics.",
      },
      {
        id: 'before-you-reply-q2',
        questionText:
          "A guest sends you a message asking whether they can add a parking spot, and also mentions they're arriving next Friday. What do you check before you reply?",
        criteria:
          "Pass if the trainee mentions checking parking availability for the guest's dates. Any mention of checking or verifying the price also counts as a pass signal — phrasing like 'check the pricing', 'verify the cost', 'look up the price' are all fine. Fail only if the answer has no mention of checking availability at all.",
      },
      {
        id: 'before-you-reply-q3',
        questionText:
          "A guest who is currently staying messages to say water is dripping from the ceiling in their bathroom. What is the most important thing to do first? What makes this different from a standard maintenance request?",
        criteria:
          "Pass if the trainee says the most important thing to do first is reply to the guest. Pass if they also identify this is urgent or an emergency as what makes it different from a standard request. If they also mention calling the building that is fine but it is not required to pass. Fail only if the trainee does not identify replying to the guest as the first priority.",
      },
      {
        id: 'before-you-reply-q4',
        questionText:
          "A guest messages asking if they can check out at 2pm today instead of 11am. You can see there is a check-in at 4pm today. What do you reply to the guest?",
        criteria:
          "Pass if the trainee's reply communicates that a 2pm checkout is not possible, and gives a reason along the lines of there being a check-in this afternoon and the housekeeping team needing the full time to turn the unit over. Does not need to be exact — mark with common sense. Pass if the core message is there: it's a no, and the reason relates to the incoming guest and cleaning time. Fail if the trainee approves the late checkout or gives no reason.",
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
          "How many questions is this guest asking? What would you check before replying? What is their emotional state, and how would that influence your response?",
        contextText:
          "\"Hi, I just wanted to double check — we're arriving Thursday evening around 7pm, there will be 4 of us including one baby. Is there a crib available? Also is parking possible? And one more thing — is the building easy to find? First time in Chicago so a bit nervous about navigating!\"",
        criteria:
          "Pass if the trainee covers the main points: (1) identifies the three things to address — the pack-n-play (guests can add this themselves via the registration link, no need to check availability), parking availability, and directions/building info, (2) reads the guest's emotional state — they are a first-timer who is a little anxious, (3) mentions that the reply should be warm and reassuring. Be flexible — they do not need to say everything perfectly, just hit these main points. Fail only if they miss most of the questions, completely ignore the guest's tone, or say nothing about reassurance.",
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
          "A guest has just checked in and sent this message. How is the guest feeling, and what are the next steps?",
        contextText:
          "\"Hi, just a quick question — is the heating supposed to make that noise? Also the shower pressure seemed a bit low this morning, and it would be great to know where the extra towels are? Thanks so much!\"",
        criteria:
          "Pass if the trainee covers the key points: (1) the guest seems confused or uncertain — this may be their first impression of the unit and it is not a great one, they are being polite but clearly not fully comfortable, (2) next steps: let them know where the towels are, submit maintenance requests for the heating noise and low shower pressure, ask the guest's permission for the maintenance team to stop by to check on those issues, and reassure the guest that you are here if anything else comes up. The tone should make the guest feel cared for, not ignored. Fail if: trainee does not address the maintenance issues, does not ask for the guest's permission before sending maintenance in, or gives a flat informational reply with no reassurance.",
      },
      {
        id: 'reading-the-message-q4',
        questionText:
          "List the issues this guest is raising. What would you do differently because of the mention of a bad review?",
        contextText:
          "\"I just wanted to let you know that the experience so far hasn't been what we expected. The unit smells musty, the dishwasher isn't working, and the TV remote doesn't work. I'll be leaving a review after my stay.\"",
        criteria:
          "Pass if the trainee: (1) lists the three issues — musty smell, broken dishwasher, TV remote not working, (2) recognises that the mention of a bad review changes the approach — the guest has leverage here, so the response needs to be noticeably warmer and more attentive than usual. Be extra nice, extra careful, and really try to smooth things over, even if the guest is being unreasonable or angry. Fail if: trainee lists the issues but treats the review mention as unimportant, or does not explain that the tone and level of care should shift significantly because of it.",
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
          "Pass if the reply covers these three things in any order: (1) genuine empathy — express that you're sorry and that you understand this isn't okay. The baby doesn't need to be specifically mentioned, just show real concern for the situation, (2) let the guest know a maintenance ticket will be raised as soon as possible to get it sorted quickly, (3) ask for the guest's permission for the maintenance team to stop by — we always need to confirm the guest is happy before sending someone in. Fail only if the reply is cold or dismissive, does not mention sorting the maintenance issue, or does not ask permission before sending someone in.",
      },
      {
        id: 'writing-the-reply-q2',
        questionText: "Write a reply to this guest's second message.",
        contextText:
          'Context: This is your second message to this guest today. Your first reply started with: "Hi Sarah! Thanks so much for reaching out, I completely understand how frustrating this must be."\nGuest\'s second message: "Any update on the hot water? It\'s been 2 hours."',
        criteria:
          "Pass if the reply: (1) apologises for the delay and acknowledges that this is not acceptable or not up to standard, (2) says they will follow up with the building right now and keep the guest updated. Note: exact timeframes are not required here — the maintenance is handled by the building team, not Cloud9 directly, so it is genuinely hard to give a precise time. Being clear that you are actively following up is enough. Fail if the reply makes excuses, is dismissive of the wait, or does not commit to following up and keeping the guest in the loop.",
      },
      {
        id: 'writing-the-reply-q3',
        questionText: 'Write a reply to this guest.',
        contextText:
          '"The street noise has been going since 6am. We booked this for a quiet stay and this is really not what we expected. We\'re very disappointed."',
        criteria:
          "Pass if the reply: (1) opens with genuine empathy — acknowledge that the guest is uncomfortable and that you're sorry to hear it, (2) mentions that earplugs and an eye mask are provided in the bedside table drawers, (3) gently sets context — the units are centrally located in Chicago, and some city noise is part of that, without being dismissive or defensive about it, (4) closes warmly and invites the guest to reach out if they need anything else. No compensation should be offered or hinted at. Fail if the reply is dismissive of the complaint, does not mention the earplugs, or offers compensation.",
      },
      {
        id: 'writing-the-reply-q4',
        questionText: 'Write a reply to this guest.',
        contextText: '"Hi there, I have a booking and I\'ll be checking in tomorrow. When will I be receiving my check-in instructions?"',
        criteria:
          "Pass if the reply: (1) is warm and welcoming — the guest is arriving tomorrow so a friendly tone is appropriate, (2) lets the guest know the check-in instructions will be sent automatically tomorrow morning, as long as they have completed their registration, (3) explains the check-in process simply — present ID to the concierge, who will hand over the unit keys, (4) closes with an offer to help if they have any other questions. Fail if the reply does not mention the registration requirement, skips the check-in process explanation, or is cold and unhelpful.",
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
          "Pass if the trainee covers these steps in roughly this order: (1) reply to the guest first — let them know you have heard them, that you are escalating to the team, and that you will keep them updated, (2) do their own research before asking anyone — review SOPs, check available resources, think back to any similar situations they have seen and how those were handled, (3) if they still cannot find an answer, identify the best person to ask for this specific situation, (4) give that person the relevant details and ask what to do, (5) keep the guest updated throughout and reply to them as soon as they have an answer. Fail if the trainee does not mention replying to the guest first, goes straight to asking for help without doing any research themselves, or does not mention keeping the guest updated.",
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
          "Pass if the trainee covers the key points: (1) reply to the guest first and get their permission to enter the unit, (2) treat this as very urgent — no hot water is a fundamental issue and should be escalated quickly, (3) call the building straight away to let them know, (4) create a work order so it is on paper, (5) keep following up and escalate to Althea if the building is unresponsive. Fail if the trainee does not mention replying to the guest and getting permission first, does not call the building, or does not mention following up and escalating if needed.",
      },
      {
        id: 'common-situations-q3',
        questionText:
          'A guest messages asking to add a parking spot for their 4-night stay next week. Walk through how you handle this.',
        criteria:
          "Must cover both scenarios — (Scenario A: guest has NOT completed registration) direct them to complete their registration and let them know they can add parking on the final page of the registration link. Mention that spots are limited and get booked out, so they should complete it as soon as possible. (Scenario B: guest HAS already completed registration and no longer has access to the registration link) handle it manually with these four steps: (1) check availability and pricing, (2) get confirmation from the guest, (3) block the parking calendar for those dates, (4) assign a task to Luisa for the charge. In feedback, you may note as a bonus that if the guest wants to pay with a different card, Luisa can generate a separate invoice — but this is not required in the answer. Fail if the trainee skips getting guest confirmation before charging, or does not mention assigning the charge to Luisa.",
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

/**
 * Questions for the final test. Not part of any SectionDef and not returned
 * by getSectionById. Use FINAL_TEST_ID from state.ts as the sectionId when
 * scoring these questions.
 */
export const finalTestQuestions: Question[] = [
  {
    id: 'final-q1',
    questionText: 'What do you check before replying to this message, and why?',
    contextText:
      "\"Hey! Quick question — we're arriving Saturday at noon. There'll be 6 of us. Is that fine for the apartment? Also can we sort out parking? And one last thing — is there somewhere nearby to store our luggage on Sunday morning after we check out? We'd be so grateful, it's our first time in Chicago!\"",
    criteria:
      "Pass if the trainee mentions: (1) check the reservation to confirm how many guests are listed — if it matches 6, that question is answered, (2) check parking availability, (3) flag that the guest mentioned arriving at noon — standard check-in is 4pm, so this is worth noting even though they did not directly ask about it. Luggage storage does not require any checking — it is a straight no with a recommendation to use an external service. Be flexible and do not require specific tools or exact wording. Fail only if the trainee misses both the guest count check and the noon arrival flag.",
  },
  {
    id: 'final-q2',
    questionText:
      'Based on your checks, what does this guest actually need — including things they have not explicitly asked about?',
    contextText:
      "\"Hey! Quick question — we're arriving Saturday at noon. There'll be 6 of us. Is that fine for the apartment? Also can we sort out parking? And one last thing — is there somewhere nearby to store our luggage on Sunday morning after we check out? We'd be so grateful, it's our first time in Chicago!\"",
    criteria:
      "Pass if the trainee mentions all three: (1) early check-in — the guest is arriving at noon and will likely want access before the standard 4pm check-in, (2) parking, (3) luggage storage. All three need to be mentioned. Fail only if one or more of these is missing entirely.",
  },
  {
    id: 'final-q3',
    questionText: 'Now write the reply.',
    contextText:
      "\"Hey! Quick question — we're arriving Saturday at noon. There'll be 6 of us. Is that fine for the apartment? Also can we sort out parking? And one last thing — is there somewhere nearby to store our luggage on Sunday morning after we check out? We'd be so grateful, it's our first time in Chicago!\"",
    criteria:
      "Pass if the reply covers these three things: (1) mentions the standard check-in time is 4pm and that if they want an early check-in they should reach out the day before, as that is when the housekeeping schedule is confirmed, (2) addresses parking in any reasonable way — saying they will look into it and get back to the guest, telling them they can add it in their registration link, or giving availability and pricing details if known — any of these is a pass, (3) lets the guest know luggage storage is not offered at the building and recommends an external service such as Bounce or LuggageHero. Reply should be warm and friendly. Fail if any of the three topics is missing entirely.",
  },
  {
    id: 'final-q4',
    questionText: 'What do you check before replying to this message?',
    contextText:
      "\"Hi! Really enjoying the stay so far. One thing — the kitchen faucet has been dripping since yesterday, not a huge deal but wanted to flag it. Also, we're honestly loving it here so much we'd love to stay 2 more nights if possible? We're checking out Sunday but would love to stay until Tuesday.\"",
    criteria:
      "Pass if the trainee mentions checking the availability of the unit for the two extra nights. That is the only thing that needs to be checked before replying. The faucet does not require any checking — it just needs a follow-up message to the guest asking permission for the maintenance team to enter. Fail only if the trainee does not mention checking availability for the extension.",
  },
  {
    id: 'final-q5',
    questionText:
      'What does this guest actually need, including things they have not explicitly asked about?',
    contextText:
      "\"Hi! Really enjoying the stay so far. One thing — the kitchen faucet has been dripping since yesterday, not a huge deal but wanted to flag it. Also, we're honestly loving it here so much we'd love to stay 2 more nights if possible? We're checking out Sunday but would love to stay until Tuesday.\"",
    criteria:
      "Pass if the trainee mentions both: (1) a maintenance ticket needs to be raised for the faucet, pending the guest's permission for the maintenance team to enter, (2) the guest wants to extend their stay and needs to know if that is possible. Both need to be mentioned. Fail only if one of the two is missing entirely.",
  },
  {
    id: 'final-q6',
    questionText: 'Write the reply.',
    contextText:
      "\"Hi! Really enjoying the stay so far. One thing — the kitchen faucet has been dripping since yesterday, not a huge deal but wanted to flag it. Also, we're honestly loving it here so much we'd love to stay 2 more nights if possible? We're checking out Sunday but would love to stay until Tuesday.\"",
    criteria:
      "Pass if the reply: (1) opens warmly and acknowledges the guest is enjoying their stay, (2) thanks the guest for flagging the faucet, offers to raise a maintenance ticket, and asks for their permission for someone to stop by, (3) addresses the extension request — says they will check availability and get back to the guest shortly. The reply does not need to confirm availability yet, just acknowledge it and commit to following up. Fail if the faucet is ignored, permission to enter is not asked, or the extension request is not acknowledged.",
  },
]

/**
 * Returns the SectionDef for the given section ID.
 * Returns undefined for unknown IDs, including 'final-test'.
 */
export function getSectionById(id: string): SectionDef | undefined {
  return sections.find((s) => s.id === id)
}
