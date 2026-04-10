export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { scanType, input } = req.body || {};

    if (!scanType || !input) {
      return res.status(400).json({
        error: "Missing scanType or input",
      });
    }

    const result = buildAnalysis(scanType, input);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(200).json({
      score: 50,
      verdict: "Needs Verification",
      confidence: "Low",
      keyInsight: "A safe fallback result was returned.",
      recommendedAction:
        "Retry the scan and verify through official sources before taking action.",
      positives: ["Request reached the analysis service"],
      risks: ["Internal analysis issue occurred"],
      nextSteps: ["Retry the scan", "Check official sources"],
      summary: "Fallback analysis returned due to an internal error.",
    });
  }
}

function buildAnalysis(scanType, input) {
  const lower = String(input).toLowerCase();
  const type = String(scanType).toLowerCase();

  let score = 58;
  let verdict = "Needs Verification";
  let confidence = "Medium";
  let keyInsight =
    "The input shows mixed trust signals, so extra verification is needed before taking action.";
  let recommendedAction =
    "Verify the official source, team credibility, and community reputation before proceeding.";

  const positives = [
    "The input is structured enough to review",
    "It can be checked further through public references",
  ];

  const risks = [
    "Limited context may hide important red flags",
    "Narrative-driven crypto inputs often carry elevated risk",
  ];

  const nextSteps = [
    "Check the official website or source",
    "Review team and community credibility",
    "Look for audits, documentation, or history",
  ];

  if (
    lower.includes("guaranteed") ||
    lower.includes("100x") ||
    lower.includes("airdrop") ||
    lower.includes("claim") ||
    lower.includes("free money") ||
    lower.includes("instant profit") ||
    lower.includes("seed phrase")
  ) {
    score = 26;
    verdict = "High Risk";
    confidence = "High";
    keyInsight =
      "The input contains common scam or hype markers such as airdrop bait, guaranteed upside, or unrealistic promises.";
    recommendedAction =
      "Do not interact until the source is independently verified through official channels and trusted community references.";
    risks.unshift(
      "Contains common scam-language or hype-driven wording",
      "May be attempting to trigger impulsive action without proof"
    );
    nextSteps.unshift(
      "Verify whether the offer is posted by the official project account"
    );
  } else if (
    lower.includes("stellar.org") ||
    lower.includes("official") ||
    lower.includes("audit") ||
    lower.includes("docs")
  ) {
    score = 78;
    verdict = "Low Risk";
    confidence = "Medium";
    keyInsight =
      "The input points toward stronger trust signals such as official branding or verifiable documentation, though independent confirmation is still wise.";
    recommendedAction =
      "Proceed carefully, but still confirm links, branding, and recent activity before taking action.";
    positives.unshift(
      "Input suggests a more verifiable or official-looking source"
    );
  }

  if (type.includes("wallet")) {
    risks.unshift("Wallet labels alone do not prove trustworthiness");
    nextSteps.unshift("Check wallet history and transaction behavior");
  }

  if (type.includes("project")) {
    nextSteps.unshift("Confirm domain ownership and social account legitimacy");
  }

  if (type.includes("token")) {
    nextSteps.unshift("Check token liquidity, contract details, and launch context");
  }

  return {
    score,
    verdict,
    confidence,
    keyInsight,
    recommendedAction,
    positives: positives.slice(0, 4),
    risks: risks.slice(0, 4),
    nextSteps: nextSteps.slice(0, 4),
    summary: `${scanType} analysis for "${input}". This response is generated safely so the app always returns a verdict.`,
  };
}