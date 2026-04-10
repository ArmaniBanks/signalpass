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
import { useState } from "react";
import { connectFreighterWallet, sendTestnetPayment } from "./stellar";

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

const emptyResult = {
  score: 0,
  verdict: "Needs Verification",
  confidence: "Medium",
  keyInsight: "",
  recommendedAction: "",
  positives: [],
  risks: [],
  nextSteps: [],
  summary: "",
};

export default function App() {
  const [step, setStep] = useState("home");
  const [selectedScan, setSelectedScan] = useState(scans[0]);
  const [query, setQuery] = useState("");
  const [paying, setPaying] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(emptyResult);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [paymentHash, setPaymentHash] = useState("");
  const [connectingWallet, setConnectingWallet] = useState(false);

  const verdictTone = getVerdictTone(result.verdict);
  const RECEIVER_ADDRESS =
    "GCOYT6QV2BRTMEBJ4NTOX2MOS42N7Q7HHYKFJ7YWGCLREJ72QXTCFMIW";

  const handleConnectWallet = async () => {
    setConnectingWallet(true);
    setError("");

    try {
      const address = await connectFreighterWallet();
      setWalletAddress(address);
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setConnectingWallet(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scanType: selectedScan.title,
          input: query,
        }),
      });

      const raw = await res.text();
      let data = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("API did not return valid JSON.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Analysis failed");
      }

      setResult({
        score: data.score ?? 0,
        verdict: data.verdict ?? "Needs Verification",
        confidence: data.confidence ?? "Medium",
        keyInsight: data.keyInsight ?? "",
        recommendedAction: data.recommendedAction ?? "",
        positives: Array.isArray(data.positives) ? data.positives : [],
        risks: Array.isArray(data.risks) ? data.risks : [],
        nextSteps: Array.isArray(data.nextSteps) ? data.nextSteps : [],
        summary: data.summary ?? "",
      });

      setStep("result");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePay = async () => {
    if (!walletAddress) {
      setError("Connect your Freighter wallet first.");
      return;
    }

    setPaying(true);
    setError("");

    try {
      const numericAmount = parseFloat(selectedScan.price);

      const paymentResult = await sendTestnetPayment({
        senderPublicKey: walletAddress,
        destination: RECEIVER_ADDRESS,
        amount: numericAmount,
      });

      setPaymentHash(paymentResult.hash || "");
      await handleAnalyze();
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  const resetFlow = () => {
    setStep("home");
    setSelectedScan(scans[0]);
    setQuery("");
    setPaying(false);
    setAnalyzing(false);
    setResult(emptyResult);
    setError("");
    setPaymentHash("");
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
              <h3>Choose what to verify</h3>
              <p>Pick a token, wallet, or project trust check.</p>
            </div>
            <div className="card">
              <Wallet size={20} />
              <h3>Unlock a scan with XLM</h3>
              <p>Simple pay-per-use access instead of a subscription wall.</p>
            </div>
            <div className="card">
              <ShieldCheck size={20} />
              <h3>Get a structured risk verdict</h3>
              <p>Score, insight, risks, green flags, and next actions.</p>
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
              This is a Stellar Testnet payment step for the MVP.
            </p>
          </div>

          <div className="card payment-card" style={{ marginTop: "16px" }}>
            <p>
              <strong>Wallet:</strong>{" "}
              {walletAddress ? walletAddress : "Not connected"}
            </p>

            {!walletAddress && (
              <button
                className="primary-btn"
                onClick={handleConnectWallet}
                disabled={connectingWallet}
                style={{ marginTop: "12px" }}
              >
                {connectingWallet ? "Connecting..." : "Connect Freighter"}
              </button>
            )}

            {walletAddress && (
              <p className="muted" style={{ marginTop: "12px" }}>
                Freighter connected on Stellar Testnet.
              </p>
            )}
          </div>

          <div className="footer-actions">
            <button className="ghost-btn" onClick={() => setStep("query")}>
              Back
            </button>
            <button
              className="primary-btn"
              onClick={handlePay}
              disabled={paying || analyzing}
            >
              {paying
                ? "Processing on Stellar..."
                : analyzing
                ? "Running analysis..."
                : "Pay with XLM"}
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}
        </main>
      )}

      {step === "result" && (
        <main className="container">
          {paymentHash && (
            <div className="card" style={{ marginBottom: "20px" }}>
              <h3>Payment confirmed on Stellar Testnet</h3>
              <p className="muted" style={{ wordBreak: "break-all" }}>
                Transaction Hash: {paymentHash}
              </p>
            </div>
          )}

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