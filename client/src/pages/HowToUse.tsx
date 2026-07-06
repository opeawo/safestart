import { Shell } from "../components/Shell";
import { useApp } from "../state/AppContext";
import { useLocation } from "wouter";
import { useState } from "react";
import { PLATFORMS } from "../content/platforms";
import { VideoModal } from "../components/VideoModal";

// English-first per PRD §7.3 — translations queued for native review.
// Content is structured (not parsed markdown) so it renders with the
// app's typography and spacing tokens, not generic prose styles.

type Tab = "parents" | "schools";

export default function HowToUse() {
  const { t } = useApp();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("parents");

  return (
    <Shell onBack={() => navigate("/home")}>
      <h1
        className="font-display lowercase"
        style={{ color: "rgb(var(--green))", fontSize: 36, lineHeight: 1.05 }}
      >
        {t("howToUseTitle")}
      </h1>
      <p
        className="mt-3 text-[15px] leading-[1.55]"
        style={{ color: "rgb(var(--gray-light))" }}
      >
        {t("howToUseSub")}
      </p>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label={t("howToUseTitle")}
        className="mt-6 flex gap-2 p-1 rounded-2xl"
        style={{
          background: "rgb(248,248,248)",
          border: "1px solid rgb(var(--border-color))",
        }}
      >
        {(["parents", "schools"] as Tab[]).map((id) => {
          const active = tab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className="flex-1 py-2.5 rounded-xl no-tap-highlight font-extrabold text-[14px]"
              style={{
                background: active ? "white" : "transparent",
                color: active ? "rgb(var(--green))" : "rgb(var(--gray-light))",
                boxShadow: active ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
                transition: "all 120ms",
              }}
              data-testid={`tab-${id}`}
            >
              {id === "parents" ? t("howToTabParents") : t("howToTabSchools")}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="mt-6">
        {tab === "parents" ? <ParentsTab /> : <SchoolsTab />}
      </div>

      <ClosingNote />
    </Shell>
  );
}

/* ------------------------------ Shared atoms ------------------------------ */

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-8 mb-3 text-[20px] font-extrabold leading-tight"
      style={{ color: "rgb(var(--gray-text))" }}
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[15px] leading-[1.65] mb-3"
      style={{ color: "rgb(var(--gray-text))" }}
    >
      {children}
    </p>
  );
}

function Em({ children }: { children: React.ReactNode }) {
  return (
    <em style={{ fontStyle: "normal", color: "rgb(var(--gray-light))" }}>
      &ldquo;{children}&rdquo;
    </em>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return (
    <strong style={{ color: "rgb(var(--gray-text))", fontWeight: 800 }}>
      {children}
    </strong>
  );
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul
      className="text-[15px] leading-[1.65] mb-3 pl-5"
      style={{ color: "rgb(var(--gray-text))", listStyle: "disc" }}
    >
      {children}
    </ul>
  );
}

function LI({ children }: { children: React.ReactNode }) {
  return <li className="mb-1.5">{children}</li>;
}

function OL({ children }: { children: React.ReactNode }) {
  return (
    <ol
      className="text-[15px] leading-[1.65] mb-3 pl-5"
      style={{ color: "rgb(var(--gray-text))", listStyle: "decimal" }}
    >
      {children}
    </ol>
  );
}

function Card({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "blue";
}) {
  const tones: Record<string, { bg: string; border: string }> = {
    neutral: {
      bg: "rgb(248,248,248)",
      border: "rgb(var(--border-color))",
    },
    green: { bg: "rgba(88,204,2,0.08)", border: "rgba(88,204,2,0.25)" },
    blue: { bg: "rgba(28,176,246,0.08)", border: "rgba(28,176,246,0.25)" },
  };
  const c = tones[tone];
  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      {children}
    </div>
  );
}

function VideoGallery() {
  const [open, setOpen] = useState<{ src: string; name: string } | null>(null);
  const items = PLATFORMS.map((p) => ({
    id: p.id,
    name: p.name,
    color: p.color,
    emoji: p.emoji,
    src: p.walkthroughVideoUrl,
  }));

  return (
    <>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {items.map((it) => {
          const ready = !!it.src;
          return (
            <button
              key={it.id}
              type="button"
              disabled={!ready}
              onClick={() =>
                ready && setOpen({ src: it.src as string, name: it.name })
              }
              data-testid={`button-video-${it.id}`}
              className="no-tap-highlight text-left rounded-2xl p-3"
              style={{
                background: "rgb(248,248,248)",
                border: "1px solid rgb(var(--border-color))",
                opacity: ready ? 1 : 0.55,
                cursor: ready ? "pointer" : "not-allowed",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="grid place-items-center rounded-lg text-[16px]"
                  style={{
                    width: 32,
                    height: 32,
                    background: it.color,
                    color: "#fff",
                  }}
                >
                  {it.emoji}
                </span>
                <span
                  className="font-extrabold text-[14px]"
                  style={{ color: "rgb(var(--gray-text))" }}
                >
                  {it.name}
                </span>
              </div>
              <p
                className="mt-1.5 text-[12px] font-bold"
                style={{
                  color: ready
                    ? "rgb(var(--blue))"
                    : "rgb(var(--gray-light))",
                }}
              >
                {ready ? "▶ Watch walkthrough" : "Coming soon"}
              </p>
            </button>
          );
        })}
      </div>
      {open && (
        <VideoModal src={open.src} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

function FAQ({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <Card>
      <p
        className="text-[15px] font-extrabold mb-1.5"
        style={{ color: "rgb(var(--gray-text))" }}
      >
        “{q}”
      </p>
      <p
        className="text-[15px] leading-[1.55]"
        style={{ color: "rgb(var(--gray-light))" }}
      >
        {a}
      </p>
    </Card>
  );
}

/* ------------------------------ Parents tab ------------------------------ */

function ParentsTab() {
  return (
    <section data-testid="panel-parents">
      <H2>What this is</H2>
      <P>
        A free, guided checklist you do <Strong>on your child&apos;s phone</Strong>.
        We walk you step by step through turning on the safety settings each app
        already has. No download. No login. No account needed.
      </P>

      <H2>Before you start</H2>
      <P>You&apos;ll need:</P>
      <UL>
        <LI><Strong>Your child&apos;s phone</Strong> (or tablet) in your hand</LI>
        <LI><Strong>5–15 minutes</Strong>, depending on how many apps you set up</LI>
        <LI><Strong>Your child&apos;s app passwords</Strong> if any are signed out (most won&apos;t be)</LI>
      </UL>
      <P>
        That&apos;s it. You don&apos;t need to be tech-savvy. If you can send a
        WhatsApp message, you can do this.
      </P>

      <H2>Do it together with your child</H2>
      <P>
        Many parents do this alone. It works. But doing it together with your
        child works better — and here&apos;s why.
      </P>
      <P>
        Most Nigerian children today are more confident with phones than their
        parents. That&apos;s not a problem; it&apos;s a gift. Sit with your child
        and tell them honestly:{" "}
        <Em>
          There are safety settings on these apps I never knew about. Help me
          find them.
        </Em>
      </P>
      <P>Three things happen when you do it this way:</P>
      <UL>
        <LI>
          <Strong>They understand why the settings exist</Strong> instead of
          feeling spied on
        </LI>
        <LI>
          <Strong>They actually help you find the menus</Strong> — many parents
          tell us their 11-year-old finished setup in half the time
        </LI>
        <LI>
          <Strong>They&apos;re more likely to come to you</Strong> when
          something uncomfortable happens online, because you&apos;ve shown you
          take their world seriously
        </LI>
      </UL>
      <P>
        If your child is <Strong>8 or older</Strong>, do it together. If
        they&apos;re younger, do it on their phone with them watching — and
        explain in simple words what each setting does (
        <Em>This one means strangers can&apos;t message you</Em>).
      </P>
      <P>
        The only time to do it without them is if there&apos;s already broken
        trust at home, or you suspect they&apos;re hiding something specific. In
        every other case, sitting side-by-side beats doing it secretly.
      </P>

      <H2>How it works (in 4 steps)</H2>
      <Card tone="green">
        <P>
          <Strong>1. Pick your language.</Strong> English, Naija Pidgin, Hausa,
          Igbo, or Yorùbá. You can change it later.
        </P>
        <P>
          <Strong>2. Pick the apps your child uses.</Strong> Tick TikTok,
          Instagram, YouTube, Snapchat, Roblox, Chrome, WhatsApp — only what&apos;s
          on their phone.
        </P>
        <P>
          <Strong>3. Follow the steps.</Strong> For each app, we show you exactly
          what to tap. Each step has a “Watch how-to video” link if you want to
          see it visually. Tap <Strong>I did it</Strong> when each one is done.
        </P>
        <p
          className="text-[15px] leading-[1.65]"
          style={{ color: "rgb(var(--gray-text))" }}
        >
          <Strong>4. Quick check.</Strong> After each app, we ask one short
          question to make sure the setting actually saved. If it didn&apos;t,
          we&apos;ll show you where to look.
        </p>
      </Card>

      <H2>Watch the how-to videos</H2>
      <P>
        Short walkthroughs for each app. Tap one to play it in-app — no sign-in
        needed.
      </P>
      <VideoGallery />

      <H2>What happens after</H2>
      <P>
        You&apos;ll see a celebration page showing every setting you turned on.
        From there you can:
      </P>
      <UL>
        <LI>
          <Strong>Share it on WhatsApp</Strong> so other parents in your group
          know what you did
        </LI>
        <LI>
          <Strong>Download a card</Strong> to keep as proof for yourself or your
          child&apos;s school
        </LI>
        <LI>
          <Strong>Add your child&apos;s school name</Strong> to be counted in
          your school&apos;s safety tally
        </LI>
      </UL>
      <P>
        You can also come back later — your progress saves automatically. Finish
        one app today, another tomorrow.
      </P>

      <H2>Common questions</H2>
      <FAQ
        q="Will my child notice?"
        a={
          <>
            We hope so — and we hope you tell them. Doing it together (see
            above) is the better path. But if you do it on your own, most
            settings are silent; your child will only notice if they try to do
            something now blocked (e.g. message a stranger).
          </>
        }
      />
      <FAQ
        q="What if my child changes the settings back?"
        a={
          <>
            Talk to them. Many of these settings (especially on YouTube and
            Roblox) require a parent password to undo if you set one — we&apos;ll
            show you when that option appears.
          </>
        }
      />
      <FAQ
        q="Does Safe Start collect my data?"
        a={
          <>
            No login. No tracking. We don&apos;t see your child&apos;s name,
            phone number, or anything they post. We only count anonymous totals
            like &ldquo;47 parents in Lagos finished setting up TikTok.&rdquo;
          </>
        }
      />
      <FAQ
        q="Is it really free?"
        a={<>Yes. Forever. Safe Start is a public-good initiative.</>}
      />
      <FAQ
        q="What if a setting moved or looks different?"
        a={
          <>
            Apps redesign their menus. If a step doesn&apos;t match, tap the
            “Watch how-to video” link — YouTube will show the latest tutorial.
            Then come back and tap <Strong>I did it</Strong>.
          </>
        }
      />

      <H2>After you finish</H2>
      <UL>
        <LI>
          <Strong>Thank your child</Strong> if they helped. Tell them you&apos;ll
          check the settings together every few months — and that they can come
          to you any time something online makes them uncomfortable.
        </LI>
        <LI>
          <Strong>Have the conversation.</Strong> Settings help, but talking to
          your child about what they see online matters more.
        </LI>
        <LI>
          <Strong>Tell two other parents.</Strong> WhatsApp the share card to
          your group. The more parents who do this, the safer all of our
          children are.
        </LI>
        <LI>
          <Strong>Re-check every 3 months.</Strong> Apps push updates. Settings
          sometimes reset. Bookmark Safe Start and come back — preferably with
          your child.
        </LI>
      </UL>
    </section>
  );
}

/* ------------------------------ Schools tab ------------------------------ */

function SchoolsTab() {
  const [, navigate] = useLocation();
  return (
    <section data-testid="panel-schools">
      <H2>Why bring Safe Start to your parents</H2>
      <P>
        Nigerian children are online earlier than ever. Most are using apps
        designed for adults, with safety settings buried three menus deep. Most
        parents — including educated, attentive ones — have no idea those
        settings exist or how to find them.
      </P>
      <P>
        Safe Start gives your parent community a 10-minute, mobile-first,
        multilingual onboarding to the safety settings every popular app already
        offers. You don&apos;t need a budget, an IT team, or a tech partnership.
        You just need to share a link.
      </P>

      <H2>What schools get out of it</H2>
      <UL>
        <LI>
          <Strong>A measurable safety win</Strong> — show parents and your
          board that the school is acting on online safety, not just talking
          about it
        </LI>
        <LI>
          <Strong>A credibility marker</Strong> — partner with a named,
          accountable initiative with a public methodology and a clear
          safeguarding stance
        </LI>
        <LI>
          <Strong>A shareable artifact</Strong> — every parent who finishes
          attributes their completion to your school. You get a public tally on
          the{" "}
          <button
            onClick={() => navigate("/schools")}
            className="no-tap-highlight"
            style={{
              color: "rgb(var(--blue))",
              fontWeight: 700,
              background: "none",
              border: 0,
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Schools page
          </button>
        </LI>
        <LI>
          <Strong>Free assets</Strong> — printable poster, parent newsletter
          blurb, assembly script, and 60-second explainer video, all in 5
          languages
        </LI>
        <LI>
          <Strong>A bridge between parents and children</Strong>, not a wall.
          Safe Start works best when parents and children do it together —
          children often find the menus faster, and the conversation that
          happens during setup is as valuable as the settings themselves.
        </LI>
      </UL>

      <H2>How to roll it out (3 routes, pick one)</H2>

      <Card tone="green">
        <p
          className="text-[15px] font-extrabold mb-2"
          style={{ color: "rgb(var(--gray-text))" }}
        >
          Route 1: The 5-minute rollout
        </p>
        <OL>
          <LI>
            Send the Safe Start link to your parent WhatsApp group with one
            sentence:{" "}
            <Em>
              This is a free 10-minute checklist that makes our children safer
              online. Please complete it on your child&apos;s phone.
            </Em>
          </LI>
          <LI>Pin the message.</LI>
          <LI>
            Two weeks later, share the school&apos;s parent tally as
            encouragement.
          </LI>
        </OL>
        <p
          className="text-[14px] mt-1"
          style={{ color: "rgb(var(--gray-light))" }}
        >
          This works. It&apos;s the floor, not the ceiling.
        </p>
      </Card>

      <Card tone="blue">
        <p
          className="text-[15px] font-extrabold mb-2"
          style={{ color: "rgb(var(--gray-text))" }}
        >
          Route 2: The PTA evening
        </p>
        <OL>
          <LI>Schedule a 30-minute slot at your next PTA meeting.</LI>
          <LI>
            Project the Safe Start homepage. Walk one parent through TikTok or
            WhatsApp live so everyone sees it works.
          </LI>
          <LI>
            Hand out the printable poster (download from the Schools page).
            Give parents 10 minutes to do one app each on their own phones.
          </LI>
          <LI>
            Take a group photo. Share it on the school&apos;s socials.
          </LI>
        </OL>
        <p
          className="text-[14px] mt-1"
          style={{ color: "rgb(var(--gray-light))" }}
        >
          This converts most attending parents.
        </p>
      </Card>

      <Card>
        <p
          className="text-[15px] font-extrabold mb-2"
          style={{ color: "rgb(var(--gray-text))" }}
        >
          Route 3: The full programme (1 term)
        </p>
        <UL>
          <LI>
            <Strong>Week 1:</Strong> Assembly. Read the script (download below).
            Give each child a one-page handout to take home to a parent.
          </LI>
          <LI>
            <Strong>Week 1 (continued):</Strong> Encourage students in Year 5
            and above to <Em>help their parents</Em> complete Safe Start at
            home. Frame it as a homework partnership — not a chore. Many will
            finish it the same evening because they want to teach Mum or Dad
            something for once.
          </LI>
          <LI>
            <Strong>Week 2:</Strong> Send Safe Start link via parent WhatsApp +
            class teacher follow-up.
          </LI>
          <LI>
            <Strong>Week 3:</Strong> Print and post the school tally. Recognize
            the first 10 parents who completed.
          </LI>
          <LI>
            <Strong>Week 4:</Strong> 30-minute live walkthrough at PTA evening
            for parents who haven&apos;t started.
          </LI>
          <LI>
            <Strong>Term end:</Strong> Issue a “Digitally Safe School”
            certificate to your school based on tally.
          </LI>
        </UL>
        <p
          className="text-[14px] mt-1"
          style={{ color: "rgb(var(--gray-light))" }}
        >
          This creates a permanent culture shift.
        </p>
      </Card>

      <H2>Resources (download free, no login)</H2>
      <P>
        All available on the{" "}
        <button
          onClick={() => navigate("/schools")}
          className="no-tap-highlight"
          style={{
            color: "rgb(var(--blue))",
            fontWeight: 700,
            background: "none",
            border: 0,
            padding: 0,
            textDecoration: "underline",
          }}
        >
          Schools page
        </button>{" "}
        in English, Pidgin, Hausa, Igbo, and Yorùbá:
      </P>
      <UL>
        <LI>
          <Strong>A2 printable poster</Strong> — pin in school office, library,
          or admin board
        </LI>
        <LI>
          <Strong>Parent newsletter blurb</Strong> — drop into your monthly
          newsletter, edit the school name
        </LI>
        <LI>
          <Strong>Assembly script</Strong> — 4-minute read, written for ages
          8–14
        </LI>
        <LI>
          <Strong>Head teacher&apos;s brief</Strong> — one-pager for your
          governing board or PTA chair
        </LI>
        <LI>
          <Strong>60-second explainer video</Strong> — share on the school
          WhatsApp or play at PTA
        </LI>
      </UL>

      <H2>What this is not</H2>
      <UL>
        <LI>
          <Strong>Not a replacement for talking to children about online
          safety.</Strong> It&apos;s the floor, not the ceiling. We deliberately
          frame it that way to parents on the celebration page.
        </LI>
        <LI>
          <Strong>Not a surveillance tool.</Strong> Safe Start does not track
          children. It only helps parents enable settings the apps already
          provide.
        </LI>
        <LI>
          <Strong>Not affiliated with TikTok, Meta, Google, Snapchat, Roblox,
          or WhatsApp.</Strong> We use their official, public settings — nothing
          covert, nothing requiring special access.
        </LI>
        <LI>
          <Strong>Not a paid product.</Strong> No school will ever be asked for
          money. If anyone claiming to represent Safe Start asks for payment,
          please report it to{" "}
          <a
            href="mailto:hello@prosperitytech.org"
            style={{ color: "rgb(var(--blue))", fontWeight: 700 }}
          >
            hello@prosperitytech.org
          </a>
          .
        </LI>
        <LI>
          <Strong>Not something to hide from children.</Strong> We strongly
          encourage parent + child teamwork. The moment a child realises their
          parent is taking online safety seriously enough to ask for their help
          is often the moment they start trusting their parent with the harder
          online conversations.
        </LI>
      </UL>

      <H2>How to register your school</H2>
      <P>It&apos;s optional but it helps:</P>
      <OL>
        <LI>
          Visit the{" "}
          <button
            onClick={() => navigate("/schools")}
            className="no-tap-highlight"
            style={{
              color: "rgb(var(--blue))",
              fontWeight: 700,
              background: "none",
              border: 0,
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Schools page
          </button>
          .
        </LI>
        <LI>
          Find your school in the list, or tap{" "}
          <Strong>My school is not listed</Strong> and submit it.
        </LI>
        <LI>
          Once parents start completing Safe Start and selecting your school,
          your tally appears publicly.
        </LI>
      </OL>

      <H2>Want to do more?</H2>
      <P>If your school wants to:</P>
      <UL>
        <LI>Run a workshop and need a Safe Start facilitator</LI>
        <LI>
          Translate Safe Start into a Nigerian language we don&apos;t yet
          support (Tiv, Edo, Efik, Kanuri, etc.)
        </LI>
        <LI>Sponsor printing of the poster pack for a network of schools</LI>
        <LI>Get featured as a partner school on the Safe Start homepage</LI>
      </UL>
      <P>
        Email{" "}
        <a
          href="mailto:partnerships@prosperitytech.org"
          style={{ color: "rgb(var(--blue))", fontWeight: 700 }}
        >
          partnerships@prosperitytech.org
        </a>
        . We typically reply in 2 working days.
      </P>
    </section>
  );
}

/* ------------------------------ Closing note ------------------------------ */

function ClosingNote() {
  return (
    <div
      className="mt-10 rounded-2xl p-5"
      style={{
        background: "rgb(248,248,248)",
        border: "1px solid rgb(var(--border-color))",
      }}
    >
      <p
        className="text-[12px] uppercase font-extrabold tracking-wider mb-2"
        style={{ color: "rgb(var(--green))" }}
      >
        A note from the Safe Start team
      </p>
      <P>Safe Start started in a conversation between parents.</P>
      <P>
        One parent&apos;s child had been messaged on Roblox by a stranger using
        words no child should ever read. Another had watched their kids do
        things on Chrome that no parent expects to find in a browser history. A
        third had realised their child was sneaking past the popular browsers
        entirely — quietly installing other apps and other browsers they were
        never meant to touch.
      </P>
      <P>
        None of these parents were absent or careless. They simply didn&apos;t
        know where to look. The settings already existed inside every one of
        these apps. Nobody had ever shown them how to find them.
      </P>
      <P>
        We built Safe Start to close that gap. The distance between{" "}
        <Em>the safety settings exist</Em> and{" "}
        <Em>a Nigerian parent has actually turned them on</Em> is where children
        get hurt. Closing it shouldn&apos;t require an app download, a login, a
        subscription, or English fluency. It should take 10 minutes on a Tecno
        or Infinix phone, in the language the parent thinks in.
      </P>
      <P>
        If Safe Start protected even one child today, it was worth building.
        Tell another parent. Tell another school.
      </P>
      <p
        className="text-[14px] mt-2 font-extrabold"
        style={{ color: "rgb(var(--gray-text))" }}
      >
        — The Safe Start team
      </p>
    </div>
  );
}
