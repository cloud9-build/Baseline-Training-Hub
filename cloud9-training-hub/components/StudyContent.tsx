import GuestJourneyFlowchart from './GuestJourneyFlowchart'

interface Props {
  sectionId: string
}

function HoldingMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-warm-border bg-warm-bg px-4 py-3 rounded-r-lg my-3 text-sm text-muted italic leading-relaxed">
      {children}
    </div>
  )
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal list-outside pl-5 space-y-2 text-sm text-ink leading-relaxed">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ol>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-outside pl-5 space-y-2 text-sm text-ink leading-relaxed">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  )
}

function SituationCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-warm-border rounded-card p-5 bg-warm-card">
      <h3 className="text-sm font-bold text-ink mb-3">{title}</h3>
      <div className="space-y-2 text-sm text-ink leading-relaxed">{children}</div>
    </div>
  )
}

export default function StudyContent({ sectionId }: Props) {
  switch (sectionId) {
    case 'before-you-reply':
      return (
        <div className="space-y-5">
          <p className="text-sm font-semibold text-ink">
            Core principle: Check before you type. Never answer a guest message from memory or instinct. Every reply starts with checking.
          </p>
          <div>
            <p className="text-sm font-semibold text-ink mb-3">Always check before any reply:</p>
            <NumberedList items={[
              'Read the entire message — identify every single question being asked. If there are three questions, you are answering three questions.',
              'Check the dates — the check-in and check-out dates of their reservation.',
              'Check the guest count — how many guests are on the reservation vs the capacity of the unit.',
              'Check the total payout — the value of the booking matters for context.',
              'Read the full conversation thread — if you\'ve already messaged this guest, what have you said? What did you promise to follow up on?',
            ]} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink mb-3">Check based on what the message is about:</p>
            <BulletList items={[
              'Availability question → check the Guesty calendar for those dates',
              'Parking question → check the parking calendar in Guesty (unlisted section, search by building number)',
              'Pre-arrival or check-in related → check Guesty reservation statuses (T&S, Documentation, Deposit) + Breezeway cleaning status and maintenance flags',
            ]} />
          </div>
          <p className="text-sm text-ink leading-relaxed">
            The goal: come back with a reply that answers everything so the guest does not have to follow up. Anticipate the next question they are going to ask and answer it before they ask it.
          </p>
        </div>
      )

    case 'reading-the-message':
      return (
        <div className="space-y-5">
          <p className="text-sm text-ink leading-relaxed">
            Before you write a single word of your reply, you need to fully understand what you are responding to.
          </p>
          <div>
            <p className="text-sm font-semibold text-ink mb-3">How to read a message properly:</p>
            <NumberedList items={[
              'Read the entire message — not just the first sentence. People often include important questions or context at the end.',
              'Count the questions — if there are three questions, you are writing a reply that answers three questions. Miss one and the guest will follow up.',
              'Read the tone and emotional state — is this person stressed, confused, excited, or upset? This changes how you open your reply, even if the information you are giving is exactly the same.',
              'Understand what they actually need vs what they literally asked — "just checking everything is fine with my booking" often means they are anxious and need reassurance, not just a yes.',
              'Read the full conversation thread — if this is not the first message from this guest, what has already been said? What did you promise to follow up on? Do not repeat information already given and do not ignore a commitment you made.',
              'Note what you need to check — before you start typing, know exactly what you need to look up in order to give a complete answer.',
            ]} />
          </div>
        </div>
      )

    case 'writing-the-reply':
      return (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-ink mb-3">The formula for any guest interaction:</p>
            <NumberedList items={[
              'Acknowledge — before you give information, acknowledge what they said. For problems: empathy. For excitement or good news: match their energy. Never jump straight to the answer.',
              'Answer every question — every single one.',
              'State the next step clearly — tell them exactly what you are doing or what happens next. "I will" not "I think" or "maybe".',
              'If you need time to check — say so and give a timeframe. "Let me check on that and I\'ll get back to you within the hour."',
            ]} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink mb-2">Tone:</p>
            <BulletList items={[
              'Match the guest\'s energy. Stressed guest = empathy, warmth, slower. Excited guest = enthusiasm. Practical guest = confident and direct.',
              'Always decisive. "I\'ll get this sorted for you now" not "I\'ll try to look into that."',
              'Never uncertain language: "I think", "maybe", "possibly", "I\'m not sure but".',
            ]} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink mb-2">Variation across a conversation:</p>
            <BulletList items={[
              'If you have already replied to this guest, your next message cannot open the same way as the last one.',
              'People can tell when every message has the same structure and energy. It reads as automated.',
              'Vary your openings, sentence length, and level of warmth. A second or third reply in the same conversation can be shorter and more direct.',
            ]} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink mb-2">Using templates or AI tools:</p>
            <BulletList items={[
              'Using a template or an AI tool to draft a reply is fine for efficiency.',
              'You must read the full draft before sending. Every single time.',
              'Edit out anything that sounds robotic or overly formal before sending.',
              'Warning signs a message was not read before sending: "Certainly!", "Of course!", "I hope this message finds you well", bullet points for a simple answer, overly formal language when the guest was casual, same structure as your last reply to the same person.',
            ]} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink mb-2">Common mistakes:</p>
            <BulletList items={[
              'Solving before acknowledging how the person feels',
              'Missing one of the questions they asked',
              'Sending the same structure multiple times in a row to the same guest',
              'Uncertain language',
              'Not confirming what happens next',
            ]} />
          </div>
        </div>
      )

    case 'when-youre-not-sure':
      return (
        <div className="space-y-6">
          <p className="text-sm text-ink leading-relaxed">
            The most common mistake a new person makes is not replying because they don&apos;t know what to say. The guest doesn&apos;t know you&apos;re stuck — they just know nobody is responding. Every minute without a reply makes the situation worse.
          </p>

          <div>
            <p className="text-sm font-bold text-ink mb-3">Step 1 — Reply immediately. Even without an answer.</p>
            <p className="text-sm text-ink leading-relaxed mb-3">
              Before you do anything else — before you ask anyone, before you figure out what&apos;s happening — send the guest a message now. The holding message does three things: it acknowledges what they said, reassures them something is happening, and thanks them for their patience.
            </p>
            <p className="text-sm text-muted mb-2">Examples (do not copy word for word — write something that fits the actual situation):</p>
            <HoldingMessage>
              &quot;Thank you so much for letting us know — I can completely understand how frustrating this must be. I&apos;m looking into this right now and checking in with the team to make sure we handle it properly. I&apos;ll keep you updated and won&apos;t leave you without an answer. Really appreciate your patience while we get this sorted.&quot;
            </HoldingMessage>
            <HoldingMessage>
              &quot;Hi [name], thanks so much for reaching out. I want to make sure I give you the right answer on this, so I&apos;m just going to check in with the team quickly. I&apos;ll get back to you shortly with a full update — thank you so much for your patience!&quot;
            </HoldingMessage>
            <HoldingMessage>
              &quot;Hi! Thanks for flagging this — I&apos;m escalating it to the right person right now to make sure it gets handled correctly. I&apos;ll follow up as soon as I have an update and keep you in the loop throughout. Really appreciate your patience.&quot;
            </HoldingMessage>
            <HoldingMessage>
              &quot;Thanks so much for letting us know about this. I&apos;m checking with the building right now to get you the right information and make sure this is dealt with properly. I&apos;ll keep you updated — won&apos;t be long. Thank you for your patience!&quot;
            </HoldingMessage>
          </div>

          <div>
            <p className="text-sm font-bold text-ink mb-2">Step 2 — Think before you ask anyone.</p>
            <BulletList items={[
              'What is the guest asking or experiencing?',
              'Does it involve maintenance? → Check the Building Maintenance Document first, then call the building. If the building isn\'t responding, that\'s when you contact Althea.',
              'Does it involve money, a charge, a refund, or a claim? → That\'s Luisa.',
              'Is it a building access or operations issue? → Althea.',
              'Have you seen something like this before — in your training, in a situation a colleague handled, in the SOPs? Think back. The answer is often already there.',
            ]} />
          </div>

          <div>
            <p className="text-sm font-bold text-ink mb-2">Step 3 — Ask properly if you still don&apos;t know.</p>
            <p className="text-sm text-ink leading-relaxed mb-2">Don&apos;t say: &quot;I don&apos;t know what to do.&quot;</p>
            <p className="text-sm text-ink leading-relaxed">Do say: &quot;Guest in unit 215.2702 is asking about X. I&apos;ve checked Y and Z. Not sure whether to contact the building or Althea on this one — what do you think?&quot; Give the situation, say what you&apos;ve already checked, say specifically what you need.</p>
          </div>

          <div>
            <p className="text-sm font-bold text-ink mb-2">Step 4 — Update the guest.</p>
            <p className="text-sm text-ink leading-relaxed">As soon as you have something — even if it&apos;s just &quot;still working on this, expect an update in 30 minutes&quot; — message the guest again. Don&apos;t wait until everything is fully resolved.</p>
          </div>

          <div>
            <p className="text-sm font-bold text-ink mb-2">The balance.</p>
            <p className="text-sm text-ink leading-relaxed">Every decision you make has two sides: making things as easy as possible for the guest, and protecting the company. When you&apos;re not sure, that balance is your guiding principle.</p>
          </div>

          <div>
            <p className="text-sm font-bold text-ink mb-3">Guest journey — the full picture</p>
            <GuestJourneyFlowchart />
          </div>
        </div>
      )

    case 'common-situations':
      return (
        <div className="space-y-4">
          <SituationCard title="Parking requests">
            <p><strong>Policy:</strong> Parking is never included in a reservation. It is always an extra fee.</p>
            <p><strong>Checking availability:</strong> Go to Guesty → calendar → unlisted section → search by building number → check if spots are available for the guest&apos;s specific dates.</p>
            <p><strong>Pricing:</strong> Most buildings $50/night. Some are $100/night. Always check the calendar before quoting. Never quote from memory.</p>
            <p><strong>If no availability:</strong> Recommend SpotHero (guest searches their building address + dates) or Park Chicago (street parking). Do not book for the guest.</p>
            <p><strong>If guest has NOT completed verification:</strong> Tell them they can select parking on the final page of the verification link. If confused, offer to handle manually.</p>
            <p><strong>If guest HAS completed verification (manual process):</strong></p>
            <ol className="list-decimal list-outside pl-4 space-y-1 text-sm">
              <li>Check availability in Guesty unlisted section</li>
              <li>Check the price per night on the calendar</li>
              <li>Give the guest the total and get their explicit confirmation before charging anything</li>
              <li>Add a manual block on the parking calendar with the guest&apos;s name</li>
              <li>Create a task in the Claims channel in ClickUp: &quot;Please charge [guest name] ([reservation number]) [$amount] for parking ([X] nights)&quot; — assign to Luisa</li>
            </ol>
            <p>If guest wants to pay with a different card: get Luisa to create an invoice.</p>
          </SituationCard>

          <SituationCard title="Pet requests">
            <p><strong>Policy:</strong> Cloud9 is not pet friendly. The answer is no.</p>
            <p><strong>Important:</strong> Do NOT proactively mention service animals. Simply say we are not pet friendly and leave it there.</p>
            <p><strong>Exception — service animals:</strong> Legally protected and cannot be refused. Only applies if the guest specifically says their animal is a service animal.</p>
            <p>If a guest mentions a service animal, collect: (1) proof it is a registered service animal, (2) breed, (3) weight, (4) photo of the animal, (5) immunisation records, (6) what service the animal provides.</p>
            <p>Once you have documentation: (1) discuss with Althea first via the WhatsApp group chat before taking any action, (2) after Althea confirms, send all documentation to the relevant building management by email, (3) follow up with a call to the building after sending the email.</p>
          </SituationCard>

          <SituationCard title="Luggage storage">
            <p><strong>Policy:</strong> We do not offer luggage storage. Our buildings are residential apartment buildings and do not have this facility.</p>
            <p><strong>What to recommend:</strong> Bounce (usebounce.com) or LuggageHero (luggagehero.com). The guest searches for options near their building&apos;s address and books directly — we do not search or book for them.</p>
          </SituationCard>

          <SituationCard title="Noise complaints">
            <p><strong>Step 1:</strong> Find out where the noise is coming from — a neighbouring unit, the street, the train, general city noise.</p>
            <p><strong>If from a neighbouring unit:</strong> Try to find out which unit. If it might be a Cloud9 unit, flag it with Althea on the WhatsApp group chat so she can check the noise monitoring app. Log the complaint in the Customer Success space in ClickUp (Tier 1) with full details.</p>
            <p><strong>If it is city noise (street, train, general):</strong> There is not much we can do. Let the guest know politely. Remind them there are earplugs in the bedside tables in all bedrooms. Log in ClickUp and set status to Completed.</p>
            <p><strong>Always log:</strong> Even if there is nothing to escalate — noise from the street, an uncomfortable couch, anything — log it in ClickUp. We track all guest feedback to spot patterns.</p>
          </SituationCard>

          <SituationCard title="Maintenance issues and emergencies">
            <p>For ALL maintenance issues: Log in the Customer Success space in ClickUp (Tier 1 list). Also check the Building Maintenance Document (Google Sheet) for the relevant building.</p>
            <p><strong>What makes it urgent:</strong> It directly impacts guest comfort or safety — a leak, no heating in winter, no hot water, flooding, no electricity.</p>
            <p><strong>If urgent:</strong></p>
            <ol className="list-decimal list-outside pl-4 space-y-1 text-sm">
              <li>Call the building immediately. Say: &quot;I have a guest in unit [unit number] and [describe issue] — this needs to be addressed urgently.&quot; Get the name of the person you spoke to.</li>
              <li>Submit through the building&apos;s maintenance channel (Livly or resident portal). If the portal is down, skip it and go to email.</li>
              <li>Send a follow-up email to the building — what the issue is, which unit, that you called and who you spoke to, that it is urgent, ask them to keep you updated.</li>
              <li>Stay on top of it. Do not submit and wait. If no update in a reasonable time, call again.</li>
              <li>If the building is unresponsive: contact Althea on the WhatsApp group chat. Tell her what the issue is, what you have done, and that the building is not responding.</li>
            </ol>
          </SituationCard>

        </div>
      )

    case 'quick-reference':
      return (
        <div className="space-y-4">
          {[
            {
              title: 'Parking',
              items: [
                'Never included. Always an extra fee.',
                'Check: Guesty → calendar → unlisted section → search by building number',
                'Price: most buildings $50/night, some $100/night — always verify on the calendar',
                'No availability: recommend SpotHero or Park Chicago',
                'To charge: get guest confirmation first → block calendar → ClickUp task for Luisa',
                'Different card: get Luisa to create an invoice',
              ],
            },
            {
              title: 'Pets',
              items: [
                'Not pet friendly. Answer is no.',
                'Do not mention service animals proactively.',
                'If they say service animal: collect documentation → Althea first → then building',
              ],
            },
            {
              title: 'Luggage storage',
              items: [
                'We do not offer it.',
                'Recommend: Bounce (usebounce.com) or LuggageHero (luggagehero.com)',
              ],
            },
            {
              title: 'Maintenance — urgent',
              items: [
                'Call building first. Not portal. Not email.',
                'Get the name of the person you spoke to.',
                'Then: submit through portal + send follow-up email',
                'Log in ClickUp Tier 1',
                'Building unresponsive: contact Althea on WhatsApp',
              ],
            },
            {
              title: 'Noise complaints',
              items: [
                'Find the source first',
                'Neighbouring Cloud9 unit: flag to Althea',
                'City noise: mention earplugs in bedside tables, log in ClickUp as Completed',
                'Always log everything regardless',
              ],
            },
            {
              title: 'Escalation',
              items: [
                'Tier 1: handle yourself + log in ClickUp',
                'Tier 2: needs sign-off → assign to Marcus in ClickUp',
                'Althea: building issues, service animals, noise from Cloud9 units, unresponsive buildings, claims',
                'Luisa: parking charges, additional fees, invoices, claims payments',
              ],
            },
          ].map((card) => (
            <div key={card.title} className="border border-warm-border rounded-card p-5 bg-warm-card">
              <h3 className="text-sm font-bold text-ink mb-2">{card.title}</h3>
              <ul className="space-y-1">
                {card.items.map((item, i) => (
                  <li key={i} className="text-sm text-ink leading-relaxed flex gap-2">
                    <span className="text-faint shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )

    default:
      return <p className="text-sm text-muted">Content not found.</p>
  }
}
