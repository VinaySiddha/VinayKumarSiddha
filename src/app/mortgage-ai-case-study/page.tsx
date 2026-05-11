import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Mortgage Document Package Processor — Case Study',
  description:
    'An end-to-end pipeline design for parsing, classifying, validating, and reporting on 2,000-page mortgage/loan PDF packages at scale with bounded OCR + LLM costs.',
}

type StageTone = 'blue' | 'teal' | 'purple' | 'green' | 'amber' | 'pink' | 'red'

function toneClasses(tone: StageTone) {
  switch (tone) {
    case 'blue':
      return {
        num: 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20',
        badge: 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20',
      }
    case 'teal':
      return {
        num: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20',
        badge: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20',
      }
    case 'purple':
      return {
        num: 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple/20',
        badge: 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple/20',
      }
    case 'green':
      return {
        num: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
        badge: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
      }
    case 'amber':
      return {
        num: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
        badge: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
      }
    case 'pink':
      return {
        num: 'bg-cyber-pink/10 text-cyber-pink border-cyber-pink/20',
        badge: 'bg-cyber-pink/10 text-cyber-pink border-cyber-pink/20',
      }
    case 'red':
      return {
        num: 'bg-red-500/10 text-red-300 border-red-500/20',
        badge: 'bg-red-500/10 text-red-300 border-red-500/20',
      }
  }
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mt-16">
      <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 whitespace-nowrap">
        {label}
      </div>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-md border border-white/10 bg-white/5 text-white/70 text-xs font-mono">
      {children}
    </span>
  )
}

function StageCard({
  num,
  title,
  objective,
  tone,
  badge,
  intro,
  leftLabel,
  leftItems,
  rightLabel,
  rightItems,
  rightNote,
  fullWidthLabel,
  fullWidth,
  callout,
}: {
  num: string
  title: string
  objective: string
  tone: StageTone
  badge: string
  intro?: string
  leftLabel: string
  leftItems: ReactNode
  rightLabel: string
  rightItems: ReactNode
  rightNote?: ReactNode
  fullWidthLabel?: string
  fullWidth?: ReactNode
  callout?: ReactNode
}) {
  const t = toneClasses(tone)

  return (
    <section className="mt-12 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 p-6 sm:p-8 border-b border-white/10">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-sm font-bold flex-shrink-0 ${t.num}`}
        >
          {num}
        </div>
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-white/50">{objective}</p>
        </div>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-md border text-[10px] font-mono tracking-[0.2em] uppercase ${t.badge}`}
        >
          {badge}
        </div>
      </header>

      <div className="p-6 sm:p-8">
        {intro && <p className="text-white/70 leading-relaxed">{intro}</p>}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 mb-3">
              {leftLabel}
            </div>
            {leftItems}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 mb-3">
              {rightLabel}
            </div>
            {rightItems}
            {rightNote ? <div className="mt-4 text-sm text-white/60">{rightNote}</div> : null}
          </div>
        </div>

        {fullWidth && fullWidthLabel ? (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 mb-3">
              {fullWidthLabel}
            </div>
            {fullWidth}
          </div>
        ) : null}

        {callout ? (
          <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
            {callout}
          </div>
        ) : null}
      </div>
    </section>
  )
}

function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3 text-sm text-white/70 leading-relaxed">
      {items.map((it, idx) => (
        <li key={idx} className="flex gap-3">
          <span className="mt-1 text-white/30 font-mono">→</span>
          <span className="flex-1">{it}</span>
        </li>
      ))}
    </ul>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/60 p-5 text-xs text-cyber-blue/80">
      <code className="font-mono whitespace-pre">{code.trim()}</code>
    </pre>
  )
}

export default function MortgageCaseStudyPage() {
  return (
    <article className="relative min-h-screen bg-black">
      <div className="relative z-10 px-4 sm:px-6 pt-24 sm:pt-32 pb-24">
        <div className="container mx-auto max-w-5xl">
          {/* Back */}
          <div className="mb-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-mono uppercase tracking-widest">Back to Projects</span>
            </Link>
          </div>

          {/* Header */}
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="text-xs font-mono tracking-widest text-white/60 uppercase">Architecture Case Study</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              MORTGAGE DOCUMENT PACKAGE <span className="text-cyber-blue">PROCESSOR</span>
              <span className="text-cyber-blue">.</span>
            </h1>

            <p className="mt-5 text-white/60 text-base md:text-lg leading-relaxed max-w-3xl">
              An end-to-end pipeline for parsing, classifying, sequencing, validating, and reporting on{' '}
              <span className="text-white">2,000-page PDF loan packages</span> — designed to scale to{' '}
              <span className="text-white">1,000 packages/day</span> with a strict cost-control philosophy:
              OCR-first, rules-first, and LLM only as a gated fallback.
            </p>
          </header>

          {/* Pipeline Bar */}
          <section className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-white/10">
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40">Pipeline Overview</div>
            </div>
            <div className="flex gap-0 overflow-x-auto px-6 sm:px-8 py-6">
              {[
                { n: '01', l1: 'Ingestion', l2: 'Split', tone: 'blue' as const },
                { n: '02', l1: 'OCR', l2: 'Extraction', tone: 'teal' as const },
                { n: '03', l1: 'Feature', l2: 'Engineering', tone: 'purple' as const },
                { n: '04', l1: 'Rule-Based', l2: 'Classify', tone: 'green' as const },
                { n: '05', l1: 'LLM', l2: 'Fallback', tone: 'amber' as const },
                { n: '06', l1: 'Assembly', l2: 'Sequencing', tone: 'pink' as const },
                { n: '07', l1: 'Validation', l2: 'QA', tone: 'red' as const },
                { n: '08', l1: 'Output', l2: 'Reporting', tone: 'teal' as const },
              ].map((s, idx, arr) => {
                const t = toneClasses(s.tone)
                return (
                  <div key={s.n} className="relative flex-1 min-w-[130px] flex flex-col items-center">
                    {/* connector */}
                    {idx !== 0 && (
                      <div className="absolute left-0 top-[22px] w-1/2 h-px bg-white/10" aria-hidden="true" />
                    )}
                    {idx !== arr.length - 1 && (
                      <div className="absolute right-0 top-[22px] w-1/2 h-px bg-white/10" aria-hidden="true" />
                    )}
                    <div
                      className={`relative z-10 w-11 h-11 rounded-full border flex items-center justify-center font-mono text-xs ${t.num}`}
                    >
                      {s.n}
                    </div>
                    <div className="mt-2 text-[11px] text-white/50 text-center leading-tight">
                      {s.l1}
                      <br />
                      {s.l2}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Stages */}
          <StageCard
            num="01"
            title="Ingestion & Page Splitting"
            objective="Normalize the raw PDF into discrete page units and tag modality (digital vs scanned)"
            tone="blue"
            badge="Zero LLM Cost"
            intro="The pipeline starts by decomposing the raw loan package into atomic, addressable pages. Each page is classified as DIGITAL or SCANNED so downstream stages can route processing efficiently and avoid unnecessary OCR/LLM spend."
            leftLabel="Logic & Algorithm"
            leftItems={
              <BulletList
                items={[
                  <>
                    Load the PDF using <strong>PyMuPDF (fitz)</strong>; extract each page as a standalone object.
                  </>,
                  <>
                    Attempt <code className="font-mono text-white/80">page.get_text()</code>. If the result contains
                    &gt; 50 meaningful characters, tag as <strong>DIGITAL</strong>; else tag as <strong>SCANNED</strong>.
                  </>,
                  <>Rasterize SCANNED pages to 300 DPI PNG for OCR; DIGITAL pages skip rasterization.</>,
                  <>
                    Compute a <strong>perceptual hash (pHash)</strong> for each page image and store it for Stage 7 duplicate detection.
                  </>,
                  <>
                    Persist per-page metadata: <strong>page_id</strong>, position, modality, image_path, and raw_text.
                  </>,
                ]}
              />
            }
            rightLabel="Tools & Technologies"
            rightItems={
              <div className="flex flex-wrap gap-2">
                <Pill>PyMuPDF (fitz)</Pill>
                <Pill>pdf2image</Pill>
                <Pill>Pillow</Pill>
                <Pill>imagehash (pHash)</Pill>
                <Pill>multiprocessing.Pool</Pill>
                <Pill>AWS S3 / GCS</Pill>
              </div>
            }
            fullWidthLabel="Example Page Metadata"
            fullWidth={
              <CodeBlock
                code={`{
  "page_id": "pkg_001_0042",
  "package_id": "pkg_001",
  "position": 42,
  "modality": "SCANNED",
  "image_path": "s3://mortgage-packages/pkg_001/pages/page_0042.png",
  "raw_text": "Uniform Residential Loan Application\\nBorrower Name: John Smith\\nDate: 03/15/2024\\nPage 3 of 8"
}`}
              />
            }
            callout={
              <div className="text-sm text-amber-200/80 leading-relaxed">
                <span className="font-mono text-amber-300">COST &amp; LATENCY</span>
                <span className="text-white/10"> — </span>
                No LLM calls here. Rasterization is the main cost (≈ 0.5–1s per scanned page per core). Spending compute here reduces
                expensive downstream LLM leakage.
              </div>
            }
          />

          <StageCard
            num="02"
            title="OCR & Text Extraction"
            objective="Produce a machine-readable text layer for scanned pages with structured output (blocks, tables, forms)"
            tone="teal"
            badge="Zero LLM Cost"
            intro="DIGITAL pages already have text from Stage 1. This stage handles SCANNED pages using a tiered OCR strategy that maximizes accuracy while controlling cloud spend."
            leftLabel="Logic & Algorithm"
            leftItems={
              <BulletList
                items={[
                  <>
                    Run <strong>Tesseract 5</strong> locally first. If OCR confidence &lt; 70%, escalate to <strong>AWS Textract</strong>.
                  </>,
                  <>
                    Use Textract <strong>AnalyzeDocument</strong> (FORMS + TABLES) to capture key-value pairs and table cells.
                  </>,
                  <>
                    Store structured output per page: raw_text, blocks with bounding boxes, tables (row/col arrays), key_value_pairs.
                  </>,
                  <>
                    Preprocess images (deskew, binarize, border removal) with <strong>OpenCV</strong> to lift OCR accuracy by 10–20%.
                  </>,
                ]}
              />
            }
            rightLabel="Tools & Technologies"
            rightItems={
              <div className="flex flex-wrap gap-2">
                <Pill>Tesseract 5</Pill>
                <Pill>AWS Textract</Pill>
                <Pill>OpenCV</Pill>
                <Pill>pytesseract</Pill>
                <Pill>boto3</Pill>
              </div>
            }
            rightNote={
              <>
                Typical split: ~30–50% scanned pages in a 2,000-page package. Escalate only the hardest subset to Textract to keep
                OCR cost bounded.
              </>
            }
            callout={
              <div className="text-sm text-amber-200/80 leading-relaxed">
                <span className="font-mono text-amber-300">COST &amp; LATENCY</span>
                <span className="text-white/10"> — </span>
                Tesseract is free (~0.3s/page). Textract is gated (~$0.015/page for FORMS). OCR-first is typically 10–20× cheaper than
                running a vision LLM across all pages.
              </div>
            }
          />

          <StageCard
            num="03"
            title="Feature Engineering"
            objective="Extract rule-friendly signals from text and layout to build a per-page feature vector"
            tone="purple"
            badge="Zero LLM Cost"
            intro="Immediately after OCR, the system extracts lightweight signals (keywords, identifiers, dates, tables, signature zones) to drive deterministic classification. This is the main lever that reduces LLM usage later."
            leftLabel="Signal Extraction"
            leftItems={
              <BulletList
                items={[
                  <>
                    Header keywords via regex: “Uniform Residential Loan Application”, “Form 1003”, “W-2”, “Form 1040”, “Credit Report”,
                    “Appraisal Report”, “Title Insurance”, “HUD-1”.
                  </>,
                  <>
                    Structural markers: Fannie/Freddie form numbers, SSN patterns, EIN, loan numbers, bank routing numbers.
                  </>,
                  <>
                    Page number extraction: “Page X of Y”, “Page X”, “- X -” for sequencing.
                  </>,
                  <>
                    Date extraction: statement periods and tax years anchor document identity.
                  </>,
                  <>
                    Table density score from Textract tables → strong signal for financial docs.
                  </>,
                  <>
                    Signature zone detection (“Signature”, underline zones) and whether a zone appears filled.
                  </>,
                ]}
              />
            }
            rightLabel="Tools & Output"
            rightItems={
              <>
                <div className="flex flex-wrap gap-2">
                  <Pill>Python re</Pill>
                  <Pill>spaCy</Pill>
                  <Pill>dateparser</Pill>
                  <Pill>numpy</Pill>
                </div>
                <CodeBlock
                  code={`{
  "page_id": "pkg_01_p0042",
  "keyword_hits": ["Form 1003", "Loan Application"],
  "form_numbers": ["1003"],
  "page_num": { "current": 3, "total": 8 },
  "dates": ["03/15/2024"],
  "has_ssn": true,
  "table_density": 0.42,
  "signature_zones": [{ "y_pct": 0.88, "filled": false }]
}`}
                />
              </>
            }
            callout={
              <div className="text-sm text-amber-200/80 leading-relaxed">
                <span className="font-mono text-amber-300">COST &amp; LATENCY</span>
                <span className="text-white/10"> — </span>
                Pure local compute (&lt; 5ms/page). Richer signals here directly reduce the pages that leak into Stage 5.
              </div>
            }
          />

          <StageCard
            num="04"
            title="Rule-Based Page Classification"
            objective="Classify the majority of pages deterministically with confidence scoring"
            tone="green"
            badge="Zero LLM Cost"
            intro="A deterministic classifier uses Stage 3 features to assign each page a document type and confidence score. Only low-confidence pages are routed to the LLM gate."
            leftLabel="Rules (Examples)"
            leftItems={
              <BulletList
                items={[
                  <>
                    <strong>LOAN_APP_INITIAL</strong>: keyword match + signature zone not filled → confidence 0.95+
                  </>,
                  <>
                    <strong>LOAN_APP_FINAL</strong>: same keyword + signature filled + date present → confidence 0.92+
                  </>,
                  <>
                    <strong>BANK_STATEMENT</strong>: “Statement Period”/“Account Summary” + table_density &gt; 0.5 + routing/account number → 0.90+
                  </>,
                  <>
                    <strong>W2</strong>: wages keywords + form number + employer EIN → 0.98+
                  </>,
                  <>
                    <strong>TAX_1040</strong>: “U.S. Individual Income Tax Return” + “Form 1040” → 0.97+
                  </>,
                  <>
                    <strong>PAY_STUB</strong>: Pay Period + Gross/Net Pay + YTD present → 0.90+
                  </>,
                  <>
                    <strong>CREDIT_REPORT</strong>: FICO/Credit Score/Tradelines + bureau names → 0.93+
                  </>,
                  <>
                    <strong>APPRAISAL</strong>: URAR + Market Value + Subject Property → 0.95+
                  </>,
                ]}
              />
            }
            rightLabel="Confidence Threshold & Routing"
            rightItems={
              <BulletList
                items={[
                  <>
                    &gt; <strong>0.85</strong> → classify immediately → Stage 6
                  </>,
                  <>
                    <strong>0.60–0.85</strong> → tentative label → Stage 5 verification
                  </>,
                  <>
                    &lt; <strong>0.60</strong> → unclassified → Stage 5
                  </>,
                  <>
                    In practice, rules handle ~85% of pages in a typical package.
                  </>,
                ]}
              />
            }
          />

          <StageCard
            num="05"
            title="LLM-Assisted Classification (Fallback Gate)"
            objective="Use an LLM only for ambiguous pages; enforce structured output; minimize token spend"
            tone="amber"
            badge="LLM • Minimal Scope"
            intro="This is the only stage that incurs LLM cost — intentionally narrow and gated. The LLM acts as a fallback classifier for pages that rules cannot confidently resolve."
            leftLabel="Cost Minimization Strategy"
            leftItems={
              <BulletList
                items={[
                  <>
                    <strong>Text-only prompting</strong> for pages with usable OCR text (&gt; 100 chars) — avoid vision tokens.
                  </>,
                  <>
                    <strong>Batching</strong>: classify up to 20 pages per API call; return a JSON array.
                  </>,
                  <>
                    <strong>Vision fallback</strong> only for unreadable pages (2–5% typical), at reduced resolution (≈150 DPI).
                  </>,
                  <>
                    Enforce <strong>JSON mode / function calling</strong> — no prose, no explanations.
                  </>,
                  <>
                    Keep the system prompt short (&lt; 200 tokens) with only the allowed type list and schema.
                  </>,
                ]}
              />
            }
            rightLabel="Tools"
            rightItems={
              <div className="flex flex-wrap gap-2">
                <Pill>GPT-4o (text)</Pill>
                <Pill>GPT-4o Vision</Pill>
                <Pill>JSON mode</Pill>
                <Pill>asyncio batching</Pill>
              </div>
            }
            fullWidthLabel="Sample Batch Prompt"
            fullWidth={
              <CodeBlock
                code={`System: Classify each page into one of:
LOAN_APP_INITIAL, LOAN_APP_FINAL,
BANK_STATEMENT, PAY_STUB, W2,
TAX_1040, CREDIT_REPORT, APPRAISAL,
TITLE_DOC, UNKNOWN.
Return JSON: [{"page_id":..., "type":..., "confidence":0.0-1.0}]

User: PAGE pkg_01_p0107:
"""Gross Pay: $6,250.00
Net Pay: $4,812.33
Pay Period: 03/01/24–03/15/24
Employee: John Smith
Employer: Acme Corp"""`}
              />
            }
            callout={
              <div className="text-sm text-amber-200/80 leading-relaxed">
                <span className="font-mono text-amber-300">COST ESTIMATE</span>
                <span className="text-white/10"> — </span>
                If ~15% of 2,000 pages reach the gate (≈300 pages) and are batched into 15 calls, the total LLM spend can be bounded to
                ~<strong className="text-amber-200">$0.19/package</strong>.
              </div>
            }
          />

          <StageCard
            num="06"
            title="Document Assembly & Sequencing"
            objective="Group pages by type, split into instances, and restore correct ordering"
            tone="pink"
            badge="Zero LLM Cost"
            intro="Once pages are classified, the system reconstructs logical documents (often multiple instances per type) and sequences pages as if the input had been perfectly organized."
            leftLabel="Grouping Logic"
            leftItems={
              <BulletList
                items={[
                  <>
                    Primary grouping: group by document type label (e.g., all BANK_STATEMENT pages).
                  </>,
                  <>
                    Multi-instance detection: split within a group using statement period, tax year, initial/final flags, signer names.
                  </>,
                  <>
                    Entity linking: match bank statements to borrower via name/account; validate SSN consistency across documents.
                  </>,
                ]}
              />
            }
            rightLabel="Page Sequencing Logic"
            rightItems={
              <BulletList
                items={[
                  <>
                    Prefer explicit page numbers (“Page X of Y”) and sort by X.
                  </>,
                  <>
                    Use statement date continuity for bank statements; known section order for Form 1003.
                  </>,
                  <>
                    Fallback to original PDF adjacency when no ordering signals exist.
                  </>,
                ]}
              />
            }
            fullWidthLabel="Assembly Pipeline"
            fullWidth={
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-white/60">
                <span className="px-3 py-1 rounded-md border border-white/10 bg-black/60">Classified Pages</span>
                <span className="text-white/20">→</span>
                <span className="px-3 py-1 rounded-md border border-white/10 bg-black/60">Group by type</span>
                <span className="text-white/20">→</span>
                <span className="px-3 py-1 rounded-md border border-white/10 bg-black/60">Split instances</span>
                <span className="text-white/20">→</span>
                <span className="px-3 py-1 rounded-md border border-white/10 bg-black/60">Sort pages</span>
                <span className="text-white/20">→</span>
                <span className="px-3 py-1 rounded-md border border-white/10 bg-black/60">Validate counts</span>
                <span className="text-white/20">→</span>
                <span className="px-3 py-1 rounded-md border border-white/10 bg-black/60">Document Objects</span>
              </div>
            }
          />

          <StageCard
            num="07"
            title="Validation & Quality Assurance"
            objective="Detect missing docs/pages/signatures and duplicates; emit structured exceptions (never a crash)"
            tone="red"
            badge="Zero LLM Cost"
            intro="Validation is designed for graceful degradation: anomalies become structured exception records with severity — the pipeline still emits partial output plus a full report."
            leftLabel="Validation Checks"
            leftItems={
              <BulletList
                items={[
                  <>
                    Required checklist: LOAN_APP_FINAL, 3× BANK_STATEMENT, W2, TAX_1040, CREDIT_REPORT, APPRAISAL, TITLE_DOC.
                  </>,
                  <>
                    Page count validation using “Page X of Y” — detect missing page ranges.
                  </>,
                  <>
                    Signature detection: confirm at least one signature zone filled for legally required docs (OpenCV ink-stroke detection).
                  </>,
                  <>
                    Duplicate detection: compare pHash values (Hamming distance ≤ 4 = near-duplicate) and de-duplicate.
                  </>,
                  <>
                    Version conflict detection: INITIAL + FINAL with same dates → ambiguous.
                  </>,
                  <>
                    Date range coverage: ensure statement months have no gaps.
                  </>,
                ]}
              />
            }
            rightLabel="Severity Levels"
            rightItems={
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40">
                      <th className="text-left py-2 pr-4">Level</th>
                      <th className="text-left py-2 pr-4">Example</th>
                      <th className="text-left py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    <tr className="border-t border-white/10">
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 font-mono text-xs">CRITICAL</span>
                      </td>
                      <td className="py-3 pr-4">No signed 1003 final; no credit report</td>
                      <td className="py-3">Block decisioning; require re-submission</td>
                    </tr>
                    <tr className="border-t border-white/10">
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-200 font-mono text-xs">WARNING</span>
                      </td>
                      <td className="py-3 pr-4">Missing one bank stmt month; duplicate pages</td>
                      <td className="py-3">Flag for underwriter review</td>
                    </tr>
                    <tr className="border-t border-white/10">
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded bg-cyber-blue/10 text-cyber-blue font-mono text-xs">INFO</span>
                      </td>
                      <td className="py-3 pr-4">Initial 1003 present alongside final</td>
                      <td className="py-3">Log; prefer final</td>
                    </tr>
                    <tr className="border-t border-white/10">
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-200 font-mono text-xs">OK</span>
                      </td>
                      <td className="py-3 pr-4">All checks passed</td>
                      <td className="py-3">Proceed to output stage</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
          />

          <StageCard
            num="08"
            title="Output Generation & Exception Reporting"
            objective="Emit structured JSON, reconstituted PDFs, and a human-readable exception report"
            tone="teal"
            badge="Zero LLM Cost"
            intro="The system outputs machine-parseable artifacts for decisioning plus a human-friendly summary for underwriters. The output stage is deterministic, fast I/O."
            leftLabel="Output Artifacts"
            leftItems={
              <BulletList
                items={[
                  <>
                    Structured JSON manifest: one object per document instance with metadata, page order, validation status, exceptions.
                  </>,
                  <>
                    Reconstituted per-document PDFs: deterministic storage paths (e.g., <code className="font-mono text-white/80">s3://output/&lt;package_id&gt;/&lt;doc_type&gt;/&lt;instance_id&gt;.pdf</code>).
                  </>,
                  <>
                    Exception report (JSON + HTML) summarizing WARNING/CRITICAL issues with recommended actions.
                  </>,
                  <>
                    Processing metadata: stage latency, LLM call count, OCR escalations, modality stats, total cost.
                  </>,
                ]}
              />
            }
            rightLabel="Tools & Technologies"
            rightItems={
              <div className="flex flex-wrap gap-2">
                <Pill>PyMuPDF</Pill>
                <Pill>Pydantic</Pill>
                <Pill>AWS S3 / GCS</Pill>
                <Pill>Jinja2 (HTML report)</Pill>
              </div>
            }
            fullWidthLabel="Output Schema (Abbreviated)"
            fullWidth={
              <CodeBlock
                code={`{
  "package_id": "pkg_001",
  "status": "PARTIAL_EXCEPTIONS",
  "documents": [
    {
      "type": "LOAN_APP_FINAL",
      "pages": [42, 43, 44, 45],
      "signed": true,
      "date": "2024-03-15",
      "pdf_path": "s3://out/pkg_001/..."
    }
  ],
  "exceptions": [
    {
      "level": "WARNING",
      "code": "BANK_STMT_GAP",
      "message": "Feb 2024 statement missing",
      "affected_pages": []
    }
  ],
  "pipeline_meta": {
    "total_pages": 2000,
    "llm_calls": 15,
    "llm_cost_usd": 0.19,
    "latency_s": 127
  }
}`}
              />
            }
          />

          {/* Constraints */}
          <SectionDivider label="Constraint Coverage" />
          <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                tone: 'red' as const,
                title: 'FILE NAMING UNRELIABLE',
                body: 'The pipeline ignores filenames entirely. Classification is driven by content-derived signals (Stages 3–5).',
              },
              {
                tone: 'amber' as const,
                title: 'NOT ALL PAGES MACHINE-READABLE',
                body: 'Stage 1 detects modality. Scanned pages flow through Tesseract → Textract. Vision LLM is last-resort fallback.',
              },
              {
                tone: 'blue' as const,
                title: 'LLM CALLS EXPENSIVE',
                body: 'Stages 1–4 and 6–8 are zero-LLM. Stage 5 is gated to ambiguous pages, batched, and text-first to bound cost.',
              },
              {
                tone: 'green' as const,
                title: 'NEVER-SEEN PACKAGES',
                body: 'Rules target universal standards (IRS forms, Fannie/Freddie docs, bureau terminology). LLM gate absorbs novelty.',
              },
              {
                tone: 'amber' as const,
                title: 'GRACEFUL DEGRADATION',
                body: 'Anomalies become structured exception records (CRITICAL/WARNING/INFO). The system emits partial output + report.',
              },
              {
                tone: 'blue' as const,
                title: 'SCALE: 1,000 PKG/DAY',
                body: 'Ingestion/OCR are parallelized across cores + async I/O. ~2 minutes per package is achievable with a small worker fleet.',
              },
            ].map((c) => {
              const t = toneClasses(c.tone)
              return (
                <div key={c.title} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                  <div className={`inline-flex px-3 py-1 rounded-md border text-[10px] font-mono tracking-[0.3em] uppercase ${t.badge}`}>
                    {c.title}
                  </div>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">{c.body}</p>
                </div>
              )
            })}
          </section>

          {/* Performance */}
          <SectionDivider label="Performance & Cost Summary" />
          <section className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { val: '~2 min', label: 'End-to-end latency per 2,000-page package', tone: 'blue' as const },
                { val: '~85%', label: 'Pages classified without any LLM call', tone: 'green' as const },
                { val: '$0.19', label: 'Estimated LLM cost per package (gated + batched)', tone: 'amber' as const },
                { val: '1,000+', label: 'Packages/day (8–16 cores + parallel OCR)', tone: 'red' as const },
              ].map((m) => {
                const t = toneClasses(m.tone)
                return (
                  <div key={m.label} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                    <div className={`text-3xl font-black tracking-tight ${t.badge.split(' ')[1]}`}>{m.val}</div>
                    <div className="mt-2 text-xs text-white/50 leading-relaxed">{m.label}</div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40">Targets / Estimates</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40">
                      <th className="text-left px-6 py-4">Metric</th>
                      <th className="text-left px-6 py-4">Target / Estimate</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    {[
                      ['Pages classified without LLM', '~85% (≈1,700 / 2,000 pages)'],
                      ['Pages requiring LLM', '~15% (≈300 pages)'],
                      ['LLM calls per package', '~15 batched calls (≈20 pages/call)'],
                      ['Estimated LLM cost per package', '~$0.19'],
                      ['Daily LLM cost @ 1,000 packages', '~$190'],
                      ['Daily OCR (Textract) cost @ 1,000 packages', '~$1,500–$2,250 (gated escalation)'],
                      ['Packages/day capacity (8–16 CPU cores)', '1,000+'],
                    ].map(([metric, value]) => (
                      <tr key={metric} className="border-t border-white/10">
                        <td className="px-6 py-4">{metric}</td>
                        <td className="px-6 py-4">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <footer className="mt-16 text-center text-xs font-mono tracking-widest text-white/30">
            Mortgage Document Package Processor — Architecture Case Study
          </footer>
        </div>
      </div>
    </article>
  )
}
