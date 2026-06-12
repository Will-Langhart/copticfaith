import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FATHERS } from '../data/fathers';
import './AskAFather.css';

// ── Journey stages ────────────────────────────────────────────
const STAGES = [
  {
    id: 'curious',
    label: 'Just Curious',
    icon: '🕊',
    desc: 'I\'ve heard about Coptic Christianity and want to learn more',
    tone: 'Gentle and welcoming — no jargon, comparisons to familiar Protestant concepts, no pressure',
  },
  {
    id: 'exploring',
    label: 'Seriously Exploring',
    icon: '📖',
    desc: 'I\'m studying this faith and considering whether it\'s true',
    tone: 'Theological depth, honest about differences with Protestantism, direct Father citations',
  },
  {
    id: 'converting',
    label: 'Preparing to Convert',
    icon: '✦',
    desc: 'I\'ve made or am close to making a decision — help me go deeper',
    tone: 'Practical and personal — sacramental preparation, what catechumenate looks like, lived faith',
  },
];

const STAGE_LABELS = { curious: 'Just Curious', exploring: 'Seriously Exploring', converting: 'Preparing to Convert' };
const LS_KEY = 'acf_journey_stage';

// ── Page context map ──────────────────────────────────────────
const PAGE_CONTEXT = {
  '/baptism':       { topic: 'Holy Baptism', suggestions: ['Why does the Coptic Church baptize infants?', 'What is the significance of triple immersion?', 'What did Cyril of Jerusalem teach about baptism?'] },
  '/eucharist':     { topic: 'The Holy Eucharist', suggestions: ['Is the Eucharist truly the Body and Blood of Christ?', 'What did Ignatius of Antioch say about the Eucharist?', 'How does the Coptic Church understand the Eucharistic sacrifice?'] },
  '/chrismation':   { topic: 'Chrismation (Myron)', suggestions: ['What is the biblical basis for Chrismation?', 'How does the Holy Spirit work through Chrismation?'] },
  '/confession':    { topic: 'Repentance and Confession', suggestions: ['Did the early Church practice sacramental confession?', 'What did Cyprian teach about restoring the lapsed?'] },
  '/unction':       { topic: 'Unction of the Sick', suggestions: ['What is the biblical basis for anointing the sick?', 'How did the Fathers understand healing prayer?'] },
  '/matrimony':     { topic: 'Holy Matrimony', suggestions: ['How does the Coptic Church view marriage as a sacrament?', 'What did the Fathers teach about Christian marriage?'] },
  '/holy-orders':   { topic: 'Holy Orders', suggestions: ['What is apostolic succession and why does it matter?', 'How did Ignatius describe the role of the bishop?'] },
  '/salvation':     { topic: 'Salvation and Theosis', suggestions: ['What is theosis and is it biblical?', 'How did Athanasius understand salvation?', 'How does the Coptic view of salvation differ from Protestant views?'] },
  '/church-history':{ topic: 'Coptic Church History', suggestions: ['Why did the Coptic Church separate from Rome and Constantinople?', 'What happened at the Council of Chalcedon in 451?'] },
  '/fathers':       { topic: 'The Church Fathers', suggestions: ['Who is the most important Coptic Church Father?', 'How do the Fathers read Scripture differently from modern Christians?', 'What did Athanasius teach about the Trinity?'] },
  '/sacraments':    { topic: 'The Seven Holy Mysteries', suggestions: ['Why are the sacraments called "Mysteries" in the Coptic Church?', 'What is the biblical basis for seven sacraments?'] },
  '/glossary':      { topic: 'Coptic Theology', suggestions: ['What does "Theotokos" mean and why does it matter?', 'What is the difference between Miaphysitism and Monophysitism?'] },
  '/faq':           { topic: 'Coptic Faith Questions', suggestions: ['Is Coptic Christianity the same as Orthodox Christianity?', 'What makes the Coptic Church unique among Christian traditions?'] },
};

const STAGE_SUGGESTIONS = {
  curious:    ['What is Coptic Christianity?', 'How is this different from the church I grew up in?', 'Why do Coptic Christians venerate saints?', 'What do the Church Fathers have to do with the Bible?'],
  exploring:  ['What did the Church Fathers teach about the Trinity?', 'How did Athanasius defend the divinity of Christ?', 'What is theosis and is it biblical?', 'What happened at the Council of Chalcedon?'],
  converting: ['What does becoming Coptic Orthodox actually involve?', 'What are the Seven Holy Mysteries?', 'What is theosis and how do I receive it?', 'How do I find a Coptic parish near me?'],
};

function getFatherByID(id) {
  return FATHERS.find(f => f.id === id);
}

// ── Onboarding Screen ─────────────────────────────────────────
function OnboardingScreen({ onSelect }) {
  return (
    <div className="acf-onboarding">
      <p className="acf-onboarding__ornament" aria-hidden="true">✦</p>
      <h3 className="acf-onboarding__title">Where are you on your journey?</h3>
      <p className="acf-onboarding__subtitle">
        Your answer helps the Fathers speak to you where you are.
      </p>
      <div className="acf-onboarding__cards">
        {STAGES.map(stage => (
          <button
            key={stage.id}
            className="acf-stage-card"
            onClick={() => onSelect(stage.id)}
          >
            <span className="acf-stage-card__icon" aria-hidden="true">{stage.icon}</span>
            <span className="acf-stage-card__label">{stage.label}</span>
            <span className="acf-stage-card__desc">{stage.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Citation Card ─────────────────────────────────────────────
function CitationCard({ citation }) {
  const father = getFatherByID(citation.fatherId);
  return (
    <div className="acf-citation">
      <div className="acf-citation__avatar-wrap">
        {father?.image ? (
          <img
            src={father.image}
            alt={citation.name}
            className="acf-citation__avatar"
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <span className="acf-citation__avatar-fallback" style={{ display: father?.image ? 'none' : 'flex' }}>
          {citation.name.replace(/^(Saint|The Scholar)\s/, '').charAt(0)}
        </span>
      </div>
      <div className="acf-citation__body">
        <span className="acf-citation__name">{citation.name}</span>
        {citation.work && <span className="acf-citation__work">{citation.work}</span>}
        {citation.quote && <p className="acf-citation__quote">"{citation.quote}"</p>}
        {father && (
          <Link to={`/fathers/${father.id}`} className="acf-citation__link">
            Read full profile →
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Message ───────────────────────────────────────────────────
function Message({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="acf-msg acf-msg--user">
        <p className="acf-msg__text">{msg.text}</p>
      </div>
    );
  }

  if (msg.loading) {
    return (
      <div className="acf-msg acf-msg--father acf-msg--loading">
        <img src="/logo.png" alt="" className="acf-loading__logo" aria-hidden="true" />
        <span className="acf-loading__text">The Fathers are reflecting…</span>
      </div>
    );
  }

  if (msg.error) {
    return (
      <div className="acf-msg acf-msg--error">
        <p>{msg.error}</p>
      </div>
    );
  }

  const { answer, citations = [], scripture = [], suggestedFollowUps = [] } = msg;

  return (
    <div className="acf-msg acf-msg--father">
      <div className="acf-msg__answer">
        {answer.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {citations.length > 0 && (
        <div className="acf-msg__citations">
          <p className="acf-msg__citations-label">
            <span aria-hidden="true">✦</span> The Fathers Speak
          </p>
          {citations.map((c, i) => <CitationCard key={i} citation={c} />)}
        </div>
      )}

      {scripture.length > 0 && (
        <div className="acf-msg__scripture">
          <span className="acf-msg__scripture-label">Scripture</span>
          {scripture.map((s, i) => (
            <span key={i} className="acf-msg__scripture-ref">{s}</span>
          ))}
        </div>
      )}

      {suggestedFollowUps.length > 0 && (
        <div className="acf-msg__followups">
          {suggestedFollowUps.map((q, i) => (
            <button key={i} className="acf-msg__followup" data-question={q}>
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Widget ───────────────────────────────────────────────
export default function AskAFather() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // null = not yet chosen (show onboarding), string = stage id
  const [journeyStage, setJourneyStage] = useState(() => localStorage.getItem(LS_KEY));

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();

  const pageCtx = PAGE_CONTEXT[location.pathname] ?? null;
  const suggestions = pageCtx?.suggestions
    ?? (journeyStage ? STAGE_SUGGESTIONS[journeyStage] : STAGE_SUGGESTIONS.curious);

  const showOnboarding = journeyStage === null;

  function handleStageSelect(stageId) {
    localStorage.setItem(LS_KEY, stageId);
    setJourneyStage(stageId);
  }

  function handleStageChange() {
    localStorage.removeItem(LS_KEY);
    setJourneyStage(null);
    setMessages([]);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setHasUnread(false);
    }
  }, [open]);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const ask = useCallback(async (question) => {
    if (!question.trim() || loading) return;

    const userMsg = { role: 'user', text: question.trim(), id: Date.now() };
    const loadingMsg = { role: 'father', loading: true, id: Date.now() + 1 };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask-father', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          pageContext: pageCtx,
          journeyStage,
        }),
      });

      const data = await res.json();

      setMessages(prev => prev.map(m =>
        m.id === loadingMsg.id
          ? { ...m, loading: false, ...(res.ok ? data : { error: data.error ?? 'Something went wrong.' }) }
          : m
      ));

      if (!open) setHasUnread(true);
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === loadingMsg.id
          ? { ...m, loading: false, error: 'Could not connect. Please check your connection and try again.' }
          : m
      ));
    } finally {
      setLoading(false);
    }
  }, [loading, pageCtx, open, journeyStage]);

  function handleSubmit(e) {
    e.preventDefault();
    ask(input);
  }

  function handleFollowUp(e) {
    const q = e.target.closest('[data-question]')?.dataset.question;
    if (q) ask(q);
  }

  function handleSuggestion(q) {
    setInput(q);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const isEmpty = messages.length === 0;

  return (
    <>
      <button
        className={`acf-trigger ${open ? 'acf-trigger--open' : ''} ${hasUnread ? 'acf-trigger--unread' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close Ask a Church Father' : 'Ask a Church Father'}
        aria-expanded={open}
      >
        <img src="/logo.png" alt="" className="acf-trigger__icon" aria-hidden="true" />
        <span className="acf-trigger__label">Ask a Father</span>
        {hasUnread && <span className="acf-trigger__unread-dot" aria-hidden="true" />}
      </button>

      {open && (
        <div className="acf-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      <div
        className={`acf-drawer ${open ? 'acf-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Ask a Church Father"
      >
        {/* Header */}
        <div className="acf-header">
          <div className="acf-header__left">
            <img src="/logo.png" alt="" className="acf-header__cross" aria-hidden="true" />
            <div>
              <h2 className="acf-header__title">Ask a Church Father</h2>
              {journeyStage ? (
                <p className="acf-header__subtitle">
                  <span className="acf-stage-badge">{STAGE_LABELS[journeyStage]}</span>
                  <button className="acf-stage-change" onClick={handleStageChange}>change</button>
                </p>
              ) : (
                <p className="acf-header__subtitle">Grounded in Scripture &amp; the Fathers</p>
              )}
            </div>
          </div>
          <button className="acf-header__close" onClick={() => setOpen(false)} aria-label="Close">×</button>
        </div>

        {/* Context pill */}
        {pageCtx?.topic && !showOnboarding && (
          <div className="acf-context-pill">
            <span aria-hidden="true">📖</span> You're reading about <strong>{pageCtx.topic}</strong>
          </div>
        )}

        {/* Messages / Onboarding */}
        <div className="acf-messages" onClick={handleFollowUp}>
          {showOnboarding ? (
            <OnboardingScreen onSelect={handleStageSelect} />
          ) : isEmpty ? (
            <div className="acf-welcome">
              <p className="acf-welcome__ornament" aria-hidden="true">✦</p>
              <p className="acf-welcome__text">
                Ask any question about the Coptic Orthodox faith. Your answer will be grounded in Holy Scripture and the writings of the Church Fathers.
              </p>
              <div className="acf-suggestions">
                {suggestions.map((s, i) => (
                  <button key={i} className="acf-suggestion" onClick={() => handleSuggestion(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="acf-welcome__disclaimer">
                Answers are AI-generated from patristic sources. Always consult your priest for pastoral guidance.
              </p>
            </div>
          ) : (
            messages.map(msg => <Message key={msg.id} msg={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input — hidden during onboarding */}
        {!showOnboarding && (
          <form className="acf-form" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className="acf-input"
              placeholder="Ask about the faith, the Fathers, the sacraments…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); }
              }}
              rows={2}
              maxLength={500}
              disabled={loading}
              aria-label="Your question"
            />
            <button
              className="acf-submit"
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send question"
            >
              {loading
                ? <span className="acf-submit__spinner" aria-hidden="true" />
                : <span aria-hidden="true">↑</span>
              }
            </button>
          </form>
        )}

        {!isEmpty && !showOnboarding && (
          <button className="acf-new-btn" onClick={() => setMessages([])}>
            + New conversation
          </button>
        )}
      </div>
    </>
  );
}
