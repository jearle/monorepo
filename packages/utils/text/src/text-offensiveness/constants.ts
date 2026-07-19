export const TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM = `ALGO_SPEAK_EUPHEMISM`;
export const TEXT_OFFENSIVENESS_SIGNAL_CUSS_TERM = `CUSS_TERM`;
export const TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT = `HARASSMENT_INSULT`;
export const TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM = `HATE_CODED_TERM`;
export const TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR = `IDENTITY_SLUR`;
export const TEXT_OFFENSIVENESS_SIGNAL_OBFUSCATED_PROFANITY = `OBFUSCATED_PROFANITY`;
export const TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY = `SUPPLEMENTAL_PROFANITY`;

export const TEXT_OFFENSIVENESS_SIGNALS = [
  TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
  TEXT_OFFENSIVENESS_SIGNAL_CUSS_TERM,
  TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
  TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
  TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
  TEXT_OFFENSIVENESS_SIGNAL_OBFUSCATED_PROFANITY,
  TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
] as const;

/*
 * Monorepo-owned supplemental terms. Reference sources consulted on 2026-06-06:
 * cuss, LDNOOBW/naughty-words, HurtLex, Wiktionary offensive/slur categories,
 * TSPA abuse taxonomy/glossary, ADL hate-symbol guidance, GLAAD anti-LGBTQ
 * online hate guidance, PEN America online-abuse glossary, GARM brand-safety
 * framework, Ofcom illegal-content guidance, and current slang/dictionary
 * entries from Merriam-Webster and Dictionary.com. Terms are manually selected,
 * normalized, and deduplicated for deterministic tagging; this file does not
 * reproduce third-party word lists.
 */
export const TEXT_OFFENSIVENESS_SUPPLEMENTAL_TERMS = [
  {
    term: `109/110`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `14 words`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `14-88`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `14/88`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `1488`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `1488-110`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `8814`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `acoustic`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `artistic`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `aryan brotherhood`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `basement dweller`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `based department`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `beaner`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `beta male`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `chink`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `coon`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `ctb`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `catch the bus`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `cuck`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `dafuq`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: false,
  },
  {
    term: `day of the rope`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: false,
  },
  {
    term: `delete yourself`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: false,
  },
  {
    term: `dyke`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `fag`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `faggot`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `femoid`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `ffs`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: false,
  },
  {
    term: `fml`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: true,
  },
  {
    term: `foid`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `fourteen words`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `gfy`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: false,
  },
  {
    term: `go die`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: false,
  },
  {
    term: `go kill yourself`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: false,
  },
  {
    term: `go kys`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: false,
  },
  {
    term: `gook`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `great replacement`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `graped`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `groomer`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `jfc`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: false,
  },
  {
    term: `jigaboo`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `jungle bunny`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `kike`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `kill yourself`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: false,
  },
  {
    term: `kms`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `kys`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: false,
  },
  {
    term: `landwhale`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `land whale`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `mfer`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: false,
  },
  {
    term: `mf`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: false,
  },
  {
    term: `mfing`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: false,
  },
  {
    term: `mofo`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: false,
  },
  {
    term: `mouthbreather`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `neck yourself`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: false,
  },
  {
    term: `nigger`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `paki`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `pdfile`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `pdf file`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `porch monkey`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `raghead`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `rahowa`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `regarded`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `restarted`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `retard`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `redskin`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `roastie`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `roasties`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `sand nigger`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `self delete`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: false,
  },
  {
    term: `self-delete`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: false,
  },
  {
    term: `self-yeet`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `secks`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `seggs`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `shemale`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `sewerslide`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `smoothbrain`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `smooth brain`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `smooth-brained`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `soyboy`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `spic`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `squaw`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `spaz`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `stfu`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: false,
  },
  {
    term: `tard`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `towelhead`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `trannoid`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `tranny`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `troid`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: true,
  },
  {
    term: `troon`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `unalive yourself`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: false,
  },
  {
    term: `unalive`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
    needsContext: true,
  },
  {
    term: `wetback`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
    needsContext: false,
  },
  {
    term: `white genocide`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `white pride worldwide`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: false,
  },
  {
    term: `window licker`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
    needsContext: true,
  },
  {
    term: `wpww`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `wtf`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
    needsContext: false,
  },
  {
    term: `yt`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
  {
    term: `zog`,
    signal: TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
    needsContext: true,
  },
] as const;

export const TEXT_OFFENSIVENESS_OBFUSCATED_PROFANITY_PATTERNS = [
  /f[\W_]*[u*@][\W_]*[c(][\W_]*k/iu,
  /s[\W_]*h[\W_]*[i!1][\W_]*t/iu,
  /b[\W_]*[i!1][\W_]*t[\W_]*c[\W_]*h/iu,
  /a[\W_]*s[\W_]*s[\W_]*h[\W_]*[o0][\W_]*l[\W_]*e/iu,
  /c[\W_]*[u*@][\W_]*n[\W_]*t/iu,
  /d[\W_]*[i!1][\W_]*c[\W_]*k/iu,
  /p[\W_]*[u*@][\W_]*s[\W_]*s[\W_]*y/iu,
] as const;
