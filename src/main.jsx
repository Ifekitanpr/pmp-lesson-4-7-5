import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Handshake,
  Lightbulb,
  Menu,
  Ruler,
  Search,
  Target,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useLessonAudio } from "../../shared/useLessonAudio";
import "./styles.css";

const files = import.meta.glob("./assets/illustrations/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});
const img = (name) => files[`./assets/illustrations/${name}.png`];
const tabs = [
  "The preparation",
  "Two competencies",
  "Four moves",
  "BATNA & ZOPA",
  "Worked example",
  "Exam lens",
];

const details = [
  {
    title: "Separate the People from the Problem",
    image: "people-problem-detail",
    icon: Users,
    text: "Attack the issue, not the person across the table — because that person is someone you'll likely be working with for the entire life of the contract. Treating a tough negotiating position as a personal attack poisons a relationship you still need afterward.",
  },
  {
    title: "Focus on Interests, Not Positions",
    image: "interests-positions-detail",
    icon: Search,
    text: (
      <>
        A stated position is what someone says they want. An interest is why
        they want it — and the two are often very different.{" "}
        <i>
          Example: a supplier insists on a clause removing any liability for
          re-testing after a failed inspection — that's their stated position.
          Digging in reveals the real interest: they're worried about losing
          control over how the test environment gets configured, since a poorly
          set up environment could produce a false failure that's not really
          their fault. A solution granting more control over the test
          environment — without a blanket liability waiver — satisfies the real
          concern without the buyer giving up protection they actually need.
        </i>
      </>
    ),
  },
  {
    title: "Invent Options for Mutual Gain Before Deciding",
    image: "mutual-gain-detail",
    icon: Lightbulb,
    text: "Enlarge the pie before dividing it. A negotiation that only haggles over price leaves value on the table that a broader package could capture — combining price, liability terms, and support-rate terms together tends to beat a price-only standoff, because it gives both sides more dimensions to trade across.",
  },
  {
    title: "Insist on Objective Criteria",
    image: "objective-criteria-detail",
    icon: Ruler,
    text: "Ground the final agreement in market rates, industry benchmarks, or a published scorecard — something external and verifiable — rather than letting the outcome be decided by whoever simply holds out longer. An agreement built on objective standards is one both sides can defend afterward; an agreement built on exhaustion rarely survives contract execution intact.",
  },
];

const modalData = {
  hook: {
    title: "Procurement negotiation works the same way.",
    image: "preparation-before-talk-modal",
    text: "What happens inside the room matters enormously — but it's built entirely on the strategy prepared before anyone walks in. This lesson covers both halves: the homework done in advance, and the discipline carried into the conversation itself.",
  },
  meaning: {
    title: "Determine the strategy. Participate in the negotiation.",
    image: "negotiable-terms-modal",
    text: (
      <>
        This lesson combines two enablers from ECO Process Task 5 — determining
        a negotiation strategy, and participating in agreement negotiations.
        PMBOK® 8 is precise about what procurement negotiation is actually for:
        it clarifies the structure, rights, and obligations of the parties,
        along with every other term of the purchase, so mutual agreement can be
        reached before anything gets signed. PMBOK® 8's Appendix X4 makes an
        important point about scope: <b>almost everything is negotiable</b> —
        cost, delivery and payment dates, location of work, ownership of
        intellectual property, and more. Nothing about a draft contract should
        be treated as fixed just because it was written down first. The ECO
        deliberately splits this into two distinct competencies: determining a
        negotiation strategy is the homework done before the room; participating
        in negotiations is the actual conduct inside it.
      </>
    ),
  },
  trade: {
    title: "The trade that made it worthwhile",
    image: "trade-ledger-modal",
    text: "Suppose a competing vendor's ranked offer sets a buyer's reservation point at $96,000 — the most they'd pay before walking to that alternative instead. Negotiating with the preferred vendor, the deal ultimately settles at $98,000 — a number technically above the reservation point on price alone, but justified because the vendor also agreed to transfer a disputed re-test liability clause into the buyer's favor. The trade across two dimensions, not just price, is what made accepting slightly above the reservation point genuinely worthwhile — and having a real BATNA already secured is precisely what made insisting on that trade safe to do, rather than a bluff that could have backfired. That transferred liability clause isn't just a negotiating win — it's a risk response, from the risk management discipline, made contractually enforceable. Negotiation is where a planned risk response stops being an intention and becomes something the other party is legally bound to honor.",
  },
  exam: {
    title: "Negotiation clarifies structure, rights, and obligations.",
    image: "exam-negotiation-modal",
    text: "Negotiation clarifies structure, rights, and obligations, and it ends in a signed agreement — with almost everything on the table open to negotiation. Strategy comes before conduct: the homework of BATNA and ZOPA gets built before anyone sits down, and principled negotiation — separating people from problems, focusing on interests, inventing options for mutual gain, and insisting on objective criteria — governs what happens once the conversation starts. Win-win isn't sentiment. It's contract design — built on a walk-away point strong enough to protect you, and a shared zone of agreement real enough to actually close the deal.",
    bullets: [
      "Two distinct competencies: determining a negotiation strategy (before) and participating in negotiations (during)",
      "Principled negotiation's four moves: separate people from problem, interests not positions, invent options for mutual gain, insist on objective criteria",
      "BATNA = your walk-away power, built in advance, never revealed casually. ZOPA = the overlap between both sides' reservation points",
      "A settlement above the reservation point can still be the right call if it wins something else of value across a different dimension",
    ],
  },
};

const quiz = {
  q: "Scenario: You're negotiating a services contract. Your team has already secured a strong alternative offer from a competing vendor at $110,000, and you're now discussing terms with your preferred vendor. Partway through the conversation, your preferred vendor pushes hard on a support-rate clause, and your team, feeling pressure to keep the relationship warm, starts drifting toward accepting terms that would put the total contract value at $118,000. What should guide your team's decision at this point?",
  answers: [
    "Compare the $118,000 package with the $110,000 BATNA and reject any worse deal",
    "Accept the higher terms, since maintaining a good relationship with the preferred vendor matters more than the numbers",
    "Walk away immediately, since any deviation from the original target number means the negotiation has failed",
    "Reveal your BATNA to the vendor immediately to strengthen your negotiating position",
  ],
  correct: 0,
  good: "Correct! This is exactly what BATNA is built for — a clear, pre-established threshold that keeps in-room pressure from talking your team into a worse outcome than what's already secured elsewhere. If $118,000 in total value doesn't outperform the $110,000 alternative, accepting it would be a strategic mistake regardless of how the conversation feels in the moment.",
  bad: "Reconsider — separating people from the problem preserves the relationship without abandoning your position; BATNA isn't a rigid ceiling to defend no matter what; and revealing your BATNA early hands the other party exactly the information they need to negotiate right up to that number.",
};

function Modal({ data, close, read }) {
  const [step, setStep] = useState(0);
  return createPortal(
    <div className="modal-backdrop" onClick={close}>
      <section className="focus-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={close} aria-label="Close">
          <X />
        </button>
        {step === 0 ? (
          <>
            <img className="modal-illustration" src={img(data.image)} alt="" />
            <h3>{data.title}</h3>
            <div className="modal-copy">
              <p>{data.text}</p>
            </div>
          </>
        ) : (
          <div className="memory-step">
            <p className="eyebrow">EXAM-RELEVANT ENABLERS TO REMEMBER</p>
            <ul>
              {data.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        )}
        {data.bullets && step === 0 ? (
          <button className="modal-action" onClick={() => setStep(1)}>
            Next <ArrowRight />
          </button>
        ) : (
          <button
            className="modal-action"
            onClick={() => {
              read();
              close();
            }}
          >
            Mark as read <Check />
          </button>
        )}
      </section>
    </div>,
    document.body,
  );
}

function KnowledgeCheck({ finish }) {
  const [picked, setPicked] = useState(null);
  return createPortal(
    <div className="knowledge-backdrop">
      <section className="knowledge-modal">
        <p className="quiz-label">
          <Target /> MICRO KNOWLEDGE CHECK
        </p>
        <h3>{quiz.q}</h3>
        <div className="answers">
          {quiz.answers.map((a, i) => (
            <button
              key={a}
              onClick={() => setPicked(i)}
              className={
                picked === i ? (i === quiz.correct ? "correct" : "wrong") : ""
              }
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {a}
            </button>
          ))}
        </div>
        {picked !== null && (
          <>
            <p
              className={`feedback ${picked === quiz.correct ? "good" : "bad"}`}
            >
              {picked === quiz.correct ? quiz.good : quiz.bad}
            </p>
            <button className="finish-check" onClick={finish}>
              Finish check <ArrowRight />
            </button>
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}

function FlipCard({ image, label, title, text, flipped, onFlip }) {
  return (
    <div className="illustrated-flip">
      <img className="flip-card-art" src={img(image)} alt="" />
      <button className={`flip ${flipped ? "flipped" : ""}`} onClick={onFlip}>
        <span className="flip-inner">
          <span className="flip-front">
            <small>CLICK TO FLIP</small>
            <h3>{title}</h3>
            <span>{label}</span>
          </span>
          <span className="flip-back">
            <small>{label}</small>
            <h3>{title}</h3>
            <p>{text}</p>
          </span>
        </span>
      </button>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState(0),
    [done, setDone] = useState(Array(6).fill(false)),
    [modal, setModal] = useState(null),
    [seen, setSeen] = useState([]),
    [flips, setFlips] = useState([]),
    [tradeRead, setTradeRead] = useState(false),
    [quizOpen, setQuizOpen] = useState(false),
    [sound, setSound] = useState(true),
    [outline, setOutline] = useState(false);
  useLessonAudio(sound);
  const mark = (i) => setDone((old) => old.map((v, n) => (n === i ? true : v)));
  useEffect(() => {
    if (seen.length === 4) mark(2);
  }, [seen]);
  useEffect(() => {
    if (flips.length === 2) mark(3);
  }, [flips]);
  const visit = (i) => setSeen((v) => (v.includes(i) ? v : [...v, i]));
  const flip = (i) => setFlips((v) => (v.includes(i) ? v : [...v, i]));
  const go = (i) => {
    if (i >= 0 && i < 6 && (i === 0 || done[i - 1])) setScreen(i);
  };
  let content;
  if (screen === 0)
    content = (
      <div className="hero-layout">
        <div>
          <p className="eyebrow">
            LESSON 4.7.5 · DETERMINE A NEGOTIATION STRATEGY AND PARTICIPATE IN
            NEGOTIATIONS
          </p>
          <h1>
            A skilled diplomat doesn't walk into a peace summit and start
            talking.
          </h1>
          <p className="lead">
            They've already studied what each side actually needs, what they'll
            do if talks collapse, and where genuine common ground might exist —
            long before anyone sits down at the table. The talking itself is
            only the visible part. The real work happened beforehand.
          </p>
          <button
            className="primary-cta"
            onClick={() => setModal(modalData.hook)}
          >
            Reveal the preparation <ArrowRight />
          </button>
        </div>
        <img
          className="lesson-art"
          src={img("diplomat-preparation-hero")}
          alt=""
        />
      </div>
    );
  if (screen === 1)
    content = (
      <div className="hero-layout">
        <div>
          <p className="eyebrow">WHAT THIS ENABLER MEANS</p>
          <h2>
            Determine a Negotiation Strategy and Participate in Negotiations
          </h2>
          <p className="lead">
            Skipping the homework and hoping to improvise the conversation is
            how a project manager ends up negotiating from weakness without even
            realizing it.
          </p>
          <button
            className="primary-cta"
            onClick={() => setModal(modalData.meaning)}
          >
            Reveal what the enabler means <ArrowRight />
          </button>
        </div>
        <img className="lesson-art" src={img("before-during-screen")} alt="" />
      </div>
    );
  if (screen === 2)
    content = (
      <div className="wide-page">
        <p className="eyebrow">PRINCIPLED NEGOTIATION</p>
        <h2>
          The discipline most worth carrying into the room is principled
          negotiation — the framework that turns PMBOK® 8's win-win instruction
          into four practical moves.
        </h2>
        <p className="lead">Click each to explore.</p>
        <img
          className="section-illustration"
          src={img("principled-negotiation-screen")}
          alt=""
        />
        <div className="direct-card-grid four">
          {details.map((d, i) => {
            const Icon = d.icon;
            return (
              <button
                className={`direct-detail-card ${seen.includes(i) ? "visited" : ""}`}
                key={d.title}
                onClick={() => {
                  visit(i);
                  setModal(d);
                }}
              >
                <span className="major-icon">
                  <Icon />
                </span>
                <span className="direct-card-copy">
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  <strong>{d.title}</strong>
                </span>
                <ArrowRight />
              </button>
            );
          })}
        </div>
      </div>
    );
  if (screen === 3)
    content = (
      <div className="wide-page">
        <p className="eyebrow">BATNA AND ZOPA — THE STRATEGY'S SPINE</p>
        <h2>
          Two concepts anchor the strategy prepared before any negotiation
          begins — and both have to exist before anyone walks into the room.
        </h2>
        <p className="lead">Flip both cards to see them.</p>
        <div className="flip-grid">
          <FlipCard
            image="batna-card"
            title="BATNA"
            label="Best Alternative to a Negotiated Agreement"
            flipped={flips.includes(0)}
            onFlip={() => flip(0)}
            text="What you'll actually do if this particular negotiation fails. It's the only honest source of real walk-away power in the room. A strong BATNA has to be built before the meeting starts, never revealed casually during the conversation, and never — under any pressure — should terms get accepted that are worse than what the BATNA already guarantees."
          />
          <FlipCard
            image="zopa-card"
            title="ZOPA"
            label="Zone of Possible Agreement"
            flipped={flips.includes(1)}
            onFlip={() => flip(1)}
            text="The overlap between each side's reservation point — the worst deal each party would still be willing to accept. If that overlap doesn't exist, more pressure inside the room won't create one. The job at that point is to change the package being negotiated, not to push harder on a deal that structurally can't close."
          />
        </div>
      </div>
    );
  if (screen === 4)
    content = (
      <div className="hero-layout">
        <div>
          <p className="eyebrow">WORKED EXAMPLE</p>
          <h2>The trade that made it worthwhile</h2>
          <p className="lead">
            Here's BATNA and ZOPA actually playing out in a real negotiation —
            including why a number technically above the reservation point was
            still the right call.
          </p>
          <button
            className="primary-cta"
            onClick={() => setModal(modalData.trade)}
          >
            {tradeRead ? "Example revealed" : "Reveal the worked example"}{" "}
            <ArrowRight />
          </button>
          {tradeRead && (
            <button className="knowledge-cta" onClick={() => setQuizOpen(true)}>
              <Target /> Start knowledge check <ArrowRight />
            </button>
          )}
        </div>
        <img className="lesson-art" src={img("trade-example-screen")} alt="" />
      </div>
    );
  if (screen === 5)
    content = (
      <div className="exam-layout">
        <div>
          <p className="eyebrow">SYNTHESIS · EXAM LENS</p>
          <h2>
            Back to the diplomat one more time — because the summit was never
            won or lost at the table.
          </h2>
          <p className="lead">
            It was won or lost in the preparation nobody in the room could see.
          </p>
          <button
            className="primary-cta"
            onClick={() => setModal(modalData.exam)}
          >
            Reveal the exam lens <ArrowRight />
          </button>
        </div>
        <div className="exam-visual">
          <img src={img("signed-agreement-screen")} alt="" />
        </div>
      </div>
    );
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="course-select">
          <Handshake />
          <span>Project Management Professional</span>
          <ChevronDown />
        </button>
        <div className="module-progress">
          <div>
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  className={`progress-dot ${i < 8 ? "done" : i === 8 ? "active" : ""}`}
                >
                  {i < 8 ? <Check /> : <span />}
                </span>
              ))}
          </div>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => setSound(!sound)}>
            {sound ? <Volume2 /> : <VolumeX />}
            <span>{sound ? "Sound on" : "Sound off"}</span>
          </button>
          <button className="ghost-button">Quit</button>
        </div>
      </header>
      <main className="workspace">
        <section className="lesson-stage">
          <div className="outline">
            <button
              className="menu-button"
              onClick={() => setOutline(!outline)}
            >
              <Menu />
            </button>
            {outline && (
              <div className="outline-panel">
                <div className="outline-summary">
                  <b>Lesson 4.7.5</b>
                  <span className="summary-track">
                    <span
                      style={{
                        width: `${(done.filter(Boolean).length / 6) * 100}%`,
                      }}
                    />
                  </span>
                </div>
                <div className="lesson-list">
                  {tabs.map((t, i) => (
                    <button
                      className={`lesson ${screen === i ? "current" : ""}`}
                      disabled={i > 0 && !done[i - 1]}
                      onClick={() => go(i)}
                      key={t}
                    >
                      <span>{done[i] ? <Check /> : i + 1}</span>
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <article className="lesson-card">
            <nav className="section-tabs">
              <p>SECTION {screen + 1} OF 6</p>
              <div>
                {tabs.map((t, i) => (
                  <button
                    key={t}
                    disabled={i > 0 && !done[i - 1]}
                    className={`${done[i] ? "done" : ""} ${screen === i ? "active" : ""}`}
                    onClick={() => go(i)}
                  >
                    {done[i] && <Check />}
                    {t}
                  </button>
                ))}
              </div>
            </nav>
            <div className="lesson-content">{content}</div>
            {done[screen] && (
              <p className="completion">
                <Check /> Interaction complete — continue when ready.
              </p>
            )}
            <footer className="nav-footer">
              <button
                className="secondary-button"
                disabled={screen === 0}
                onClick={() => setScreen(screen - 1)}
              >
                <ArrowLeft /> Previous
              </button>
              <button
                className="primary-button"
                disabled={!done[screen]}
                onClick={() => screen < 5 && setScreen(screen + 1)}
              >
                {screen === 5 ? "Complete" : "Continue"}
                <ArrowRight />
              </button>
            </footer>
          </article>
        </section>
      </main>
      {modal && (
        <Modal
          data={modal}
          close={() => setModal(null)}
          read={() => {
            if (screen === 0 || screen === 1 || screen === 5) mark(screen);
            if (screen === 4) setTradeRead(true);
          }}
        />
      )}{" "}
      {quizOpen && (
        <KnowledgeCheck
          finish={() => {
            setQuizOpen(false);
            mark(4);
          }}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
