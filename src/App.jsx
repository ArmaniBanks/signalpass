import {
  ShieldCheck,
  Wallet,
  Search,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BadgeDollarSign,
  Link2,
  Radar,
  Sparkles,
  CircleDashed,
} from "lucide-react";
import { useMemo, useState } from "react";

const scans = [
  {
    id: "token",
    title: "Token Risk Check",
    price: "2 XLM",
    icon: <Radar size={20} />,
    description: "Assess a token before you interact, trade, or ape.",
    placeholder: "e.g. XLM, BASE, token ticker, or contract address",
    samples: ["XLM", "meme token airdrop", "BASE", "guaranteed 100x token"],
  },
  {
    id: "wallet",
    title: "Wallet Exposure Check",
    price: "3 XLM",
    icon: <Wallet size={20} />,
    description: "Review wallet-linked risk signals before sending funds.",
    placeholder: "e.g. wallet address or wallet label",
    samples: [
      "suspicious wallet",
      "active whale wallet",
      "new wallet with big inflows",
      "fake wallet alert",
    ],
  },
  {
    id: "project",
    title: "Project Trust Check",
    price: "2 XLM",
    icon: <Link2 size={20} />,
    description: "Check a project, post, or site before trusting the narrative.",
    placeholder: "e.g. project URL, tweet link, or protocol name",
    samples: [
      "stellar.org",
      "project promising guaranteed yield",
      "new protocol landing page",
      "airdrop claim page",
    ],
  },
];

function makeMockResult(type, input) {
  const text = (input || "").toLowerCase();

  let score = 71;
  let verdict = "Needs Verification";
  let confidence = "Medium";
  let keyInsight =
    "The input shows some visible trust signals, but not enough verified depth to justify blind confidence.";
  let recommendedAction =
    "Verify official links, recent activity, and ownership details before taking action.";
  let positives = [
    "Public-facing identity is visible",
    "Use case is understandable from the input",
    "There are some surface-level trust signals",
  ];
  let risks = [
    "Key claims are not yet independently verified",
    "Historical context is still limited",
    "Further wallet, contract, or source review is needed",
  ];
  let nextSteps = [
    "Verify official links and source of truth",
    "Check wallet, contract, or team history",
    "Confirm whether liquidity, activity, or traction is real",
  ];
  let summary =
    "SignalPass found some encouraging indicators, but not enough proof to treat this as low risk without further verification.";

  if (
    text.includes("btc") ||
    text.includes("bitcoin") ||
    text.includes("stellar") ||
    text.includes("xlm")
  ) {
    score = 88;
    verdict = "Low Risk";
    confidence = "High";
    keyInsight =
      "This input has stronger public legitimacy and lower ambiguity than average, which improves baseline trust.";
    recommendedAction =
      "Confirm the exact asset or source, then review current market context before acting.";
    positives = [
      "Strong public awareness and discoverability",
      "Clear market identity",
      "Lower ambiguity around the asset being referenced",
    ];
    risks = [
      "Market volatility still applies",
      "Execution risk depends on exact context and timing",
      "Users should still verify the exact asset or source",
    ];
    nextSteps = [
      "Confirm the exact asset, wallet, or official link",
      "Check recent ecosystem context before acting",
      "Use this result as support, not as your only signal",
    ];
    summary =
      "This input shows stronger trust indicators than average, but SignalPass still recommends a final verification pass before action.";
  }

  if (
    text.includes("meme") ||
    text.includes("pump") ||
    text.includes("airdrop") ||
    text.includes("guaranteed") ||
    text.includes("100x")
  ) {
    score = 34;
    verdict = "High Risk";
    confidence = "Medium";
    keyInsight =
      "The language around this input looks more hype-driven than proof-driven, which is a classic risk signal.";
    recommendedAction =
      "Pause and independently verify ownership, utility, and source credibility before any interaction.";
    positives = [
      "High attention potential",
      "Narrative strength may attract fast interest",
    ];
    risks = [
      "Speculative language detected",
      "Hype appears stronger than proof",
      "Scam, dump, or manipulation risk is elevated",
    ];
    nextSteps = [
      "Do not act based on urgency or hype alone",
      "Verify ownership, source, and utility claims",
      "Check whether the claims are independently provable",
    ];
    summary =
      "This input carries multiple classic danger signals. Treat it as high risk unless stronger proof appears.";
  }

  if (
    text.includes("rug") ||
    text.includes("scam") ||
    text.includes("fake") ||
    text.includes("suspicious")
  ) {
    score = 22;
    verdict = "High Risk";
    confidence = "High";
    keyInsight =
      "Explicit suspicion markers are present, and the quality of trust signals looks very weak.";
    recommendedAction =
      "Do not proceed until links, wallet history, ownership, and community legitimacy are all cross-checked.";
    positives = ["User awareness is already elevated"];
    risks = [
      "Explicit suspicion or scam language detected",
      "Trust signal quality is very weak",
      "Manual verification is critical before any interaction",
    ];
    nextSteps = [
      "Pause before taking action",
      "Cross-check all links and ownership data",
      "Verify contract, wallet, and community legitimacy",
    ];
    summary =
      "SignalPass flags this input as highly risky. Extra caution is strongly advised before any action.";
  }

  return {
    score,
    verdict,
    confidence,
    keyInsight,
    recommendedAction,
    positives,
    risks,
    nextSteps,
    summary,
  };
}

function getVerdictTone(verdict) {
  if (verdict === "Low Risk") {
    return {
      icon: <CheckCircle2 size={18} />,
      className: "verdict-badge verdict-low",
    };
  }

  if (verdict === "High Risk") {
    return {
      icon: <AlertTriangle size={18} />,
      className: "verdict-badge verdict-high",
    };
  }

  return {
    icon: <CircleDashed size={18} />,
    className: "verdict-badge verdict-mid",
  };
}

export default function App() {
  const [step, setStep] = useState("home");
  const [selectedScan, setSelectedScan] = useState(scans[0]);
  const [query, setQuery] = useState("");
  const [paying, setPaying] = useState(false);

  const result = useMemo(
    () => makeMockResult(selectedScan.title, query),
    [selectedScan, query]
  );

  const verdictTone = getVerdictTone(result.verdict);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setStep("result");
    }, 1800);
  };

  const resetFlow = () => {
    setStep("home");
    setSelectedScan(scans[0]);
    setQuery("");
    setPaying(false);
  };

  return (
    <div className="app-shell">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <header className="topbar">
        <div className="brand">
          <ShieldCheck size={22} />
          <span>SignalPass</span>
        </div>
        <button className="ghost-btn" onClick={resetFlow}>
          Reset
        </button>
      </header>

      {step === "home" && (
        <main className="container hero">
          <div className="badge">Built for Stellar Hacks: Agents</div>
          <h1>Pay before you ape.</h1>
          <p className="hero-copy">
            SignalPass helps users pay a small amount in XLM to assess token,
            wallet, and project risk before taking action.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setStep("services")}>
              Start Scan <ArrowRight size={18} />
            </button>
          </div>

          <div className="hero-note card stellar-note">
            <BadgeDollarSign size={20} />
            <div>
              <strong>XLM-powered access</strong>
              <p>
                A pay-per-use due-diligence flow designed for agent-native
                interactions on Stellar.
              </p>
            </div>
          </div>

          <div className="grid three">
            <div className="card">
              <Search size={20} />
              <h3>Choose a scan</h3>
              <p>Pick a token, wallet, or project trust check.</p>
            </div>
            <div className="card">
              <Wallet size={20} />
              <h3>Pay in XLM</h3>
              <p>Simple pay-per-use access instead of a subscription wall.</p>
            </div>
            <div className="card">
              <ShieldCheck size={20} />
              <h3>Get a verdict</h3>
              <p>Score, risk signals, green flags, and what to verify next.</p>
            </div>
          </div>
        </main>
      )}

      {step === "services" && (
        <main className="container">
          <div className="section-head">
            <div>
              <div className="badge">Step 1</div>
              <h2>Select a scan type</h2>
              <p className="muted">
                Choose the check that best matches what you want to verify.
              </p>
            </div>
          </div>

          <div className="grid three">
            {scans.map((scan) => (
              <button
                key={scan.id}
                className={`card selectable ${
                  selectedScan.id === scan.id ? "selected" : ""
                }`}
                onClick={() => setSelectedScan(scan)}
              >
                <div className="service-icon">{scan.icon}</div>
                <h3>{scan.title}</h3>
                <p>{scan.description}</p>
                <div className="price">{scan.price}</div>
              </button>
            ))}
          </div>

          <div className="footer-actions">
            <button className="primary-btn" onClick={() => setStep("query")}>
              Continue
            </button>
          </div>
        </main>
      )}

      {step === "query" && (
        <main className="container narrow">
          <div className="section-head">
            <div>
              <div className="badge">Step 2</div>
              <h2>{selectedScan.title}</h2>
              <p className="muted">
                Paste the input you want SignalPass to assess.
              </p>
            </div>
          </div>

          <textarea
            className="input-box"
            placeholder={selectedScan.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="sample-row">
            {selectedScan.samples.map((sample) => (
              <button
                key={sample}
                className="sample-chip"
                onClick={() => setQuery(sample)}
                type="button"
              >
                {sample}
              </button>
            ))}
          </div>

          <div className="query-note">
            The stronger the input, the stronger the result. Paste a token,
            wallet, project name, or direct link.
          </div>

          <div className="footer-actions">
            <button className="ghost-btn" onClick={() => setStep("services")}>
              Back
            </button>
            <button
              className="primary-btn"
              onClick={() => setStep("payment")}
              disabled={!query.trim()}
            >
              Continue to Payment
            </button>
          </div>
        </main>
      )}

      {step === "payment" && (
        <main className="container narrow">
          <div className="section-head">
            <div>
              <div className="badge">Step 3</div>
              <h2>Confirm payment</h2>
              <p className="muted">
                Pay once in XLM to unlock a structured risk verdict.
              </p>
            </div>
          </div>

          <div className="card payment-card">
            <p>
              <strong>Service:</strong> {selectedScan.title}
            </p>
            <p>
              <strong>Input:</strong> {query}
            </p>
            <p>
              <strong>Amount:</strong> {selectedScan.price}
            </p>
            <p className="muted">
              This is a simulated Stellar payment step for the MVP demo.
            </p>
          </div>

          <div className="footer-actions">
            <button className="ghost-btn" onClick={() => setStep("query")}>
              Back
            </button>
            <button
              className="primary-btn"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? "Processing on Stellar..." : "Pay with XLM"}
            </button>
          </div>
        </main>
      )}

      {step === "result" && (
        <main className="container">
          <div className="result-header">
            <div>
              <div className="badge">Scan Complete</div>
              <h2>{selectedScan.title} Result</h2>
              <p className="muted">{query}</p>
            </div>

            <div className="score-card">
              <span>Trust Score</span>
              <strong>{result.score}/100</strong>
              <small>{result.confidence} confidence</small>
            </div>
          </div>

          <div className="grid two">
            <div className="card">
              <h3>Verdict</h3>
              <div className={verdictTone.className}>
                {verdictTone.icon}
                <span>{result.verdict}</span>
              </div>
              <p>{result.summary}</p>
              <p>
                <strong>Interpretation:</strong> This output supports
                decision-making, but final verification is still on the user.
              </p>
            </div>

            <div className="card insight-card">
              <h3>Key Insight</h3>
              <div className="insight-row">
                <Sparkles size={18} />
                <span>{result.keyInsight}</span>
              </div>
              <div className="action-box">
                <strong>Recommended Action</strong>
                <p>{result.recommendedAction}</p>
              </div>
            </div>

            <div className="card">
              <h3>What to verify next</h3>
              <ul>
                {result.nextSteps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3>Positive signals</h3>
              <ul>
                {result.positives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3>Risk signals</h3>
              <ul>
                {result.risks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-actions">
            <button className="ghost-btn" onClick={resetFlow}>
              New Scan
            </button>
          </div>
        </main>
      )}
    </div>
  );
}