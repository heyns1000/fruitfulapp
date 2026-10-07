// Waterfall Memory Hook — system-driven classification.
// Grounded in: waterfall-memory-hook-seed-prompt.md, FRUITFULCORE_GLOBAL_UPDATE_TRAILS_UPDATED.md

export const ROOT_ID = 'origin-gorilla';

export const STAGES = [
  { key: 'origin', glyph: '🦍', label: 'Origin', meaning: 'Identifiable source authority' },
  { key: 'captured', glyph: '💧', label: 'Captured prompt', meaning: 'The initiating instruction or event' },
  { key: 'preserved', glyph: '🌱', label: 'Preserved record', meaning: 'Retained and versioned payload' },
  { key: 'extension', glyph: '🌿', label: 'Linked extension', meaning: 'Derived, reconciled or corrected' },
  { key: 'projection', glyph: '🌳', label: 'Approved projection', meaning: 'Controlled output — needs approval scope' },
];

export const STATUSES = ['captured', 'evidenced', 'reviewed', 'approved', 'released', 'superseded'];

export const PLACEHOLDERS = [
  '[TBC]',
  '[REQUIRES_APPROVAL]',
  '[SERVER_SIDE_SECRET]',
  '[CANONICAL_REPOSITORY_PATH]',
  '[VALIDATED_URL_REQUIRED]',
];

const RULES = [
  {
    event_type: 'correction',
    stage: 'extension',
    relation: 'supersedes',
    re: /\b(correct|correction|supersede|superseded|revoke|revocation|reversal|instead of|amendment|rectif)/i,
    note: 'Correction — written as a new child record pointing at the original. Never an overwrite.',
  },
  {
    event_type: 'release',
    stage: 'projection',
    relation: 'projected_from',
    re: /\b(release|publish|deploy|projection|go[- ]?live|shipped|announce)/i,
    note: 'Projection — a controlled output. Requires explicit approval scope before release.',
  },
  {
    event_type: 'decision',
    stage: 'extension',
    relation: 'approved_from',
    re: /\b(decid|decision|approv|sign[- ]?off|authoris|authoriz|sanction)/i,
    note: 'Approval is recorded as its own named event, not folded into another record.',
  },
  {
    event_type: 'claim',
    stage: 'extension',
    relation: 'supports',
    re: /\b(claim|assert|state[sd]? that|report[s]? that|alleged|evidence|evidenced)/i,
    note: 'Claim — must carry a source reference. No claim without a source pointer.',
  },
  {
    event_type: 'intake',
    stage: 'preserved',
    relation: 'preserved_as',
    re: /\b(intake|index|indexed|census|inventory|catalog|scan|received|source file|metadata)/i,
    note: 'Intake — retained and versioned at metadata level, not yet approved.',
  },
];

const CONFLICT_RE = /\b(conflict|contradict|mismatch|inconsisten|disagree|discrepan|dispute)/i;

/** System-driven classification. No manual cross-check required. */
export function describeEntry(text) {
  const body = (text || '').trim();
  const signals = [];
  const hit = RULES.find((rule) => rule.re.test(body));
  const conflict = CONFLICT_RE.test(body);

  const event_type = hit ? hit.event_type : 'prompt';
  const stage = hit ? hit.stage : 'captured';
  const relation = conflict ? 'contradicts' : (hit ? hit.relation : 'captured_from');

  if (hit) signals.push(hit.note);
  if (conflict) signals.push('Conflict detected — linked as a contradictory child record.');
  const placeholders = PLACEHOLDERS.filter((p) => body.toUpperCase().includes(p));
  if (placeholders.length) signals.push(`Control placeholders present: ${placeholders.join(', ')}.`);
  if (!body) signals.push('Awaiting a description to classify.');

  return { event_type, stage, relation, placeholders, signals };
}

/** Release gates that hold until an authorised approval event exists. */
export function gatesFor(read) {
  const gates = [];
  const placeholders = read?.placeholders || [];
  if (read?.stage === 'projection') gates.push('External write blocked — approval scope required before release.');
  if (placeholders.includes('[REQUIRES_APPROVAL]')) gates.push('Marked REQUIRES_APPROVAL — will not be marked approved.');
  if (placeholders.includes('[SERVER_SIDE_SECRET]')) gates.push('Secret boundary — credential values are never stored.');
  if (read?.relation === 'contradicts') gates.push('Exception record — source evidence is preserved, not replaced.');
  return gates;
}

export function hashContent(text) {
  const bytes = new TextEncoder().encode(text || '');
  return crypto.subtle.digest('SHA-256', bytes).then((digest) =>
    Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
  );
}

export function buildRecordId(isoDate, sequence) {
  const compact = String(isoDate || '').slice(0, 10).replace(/-/g, '');
  return `waterplant-${compact}-${String(sequence).padStart(4, '0')}`;
}