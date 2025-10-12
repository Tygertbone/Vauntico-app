export function explainDecision(action: { rule: string; item: string; type: string; to: string }) {
  const lines = [
    `Rule: ${action.rule}`,
    `Action: ${action.type} → ${action.to}`,
    `Target: ${action.item}`,
    `Why: Matching plan criteria; reversible via time capsule and logs.`
  ];
  return lines.join("\n");
}
