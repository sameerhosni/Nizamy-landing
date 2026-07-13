/**
 * Regenerates the pre-rendered headline PNGs embedded in the lead emails
 * (artifacts/api-server/assets/email-text/). Gmail strips web fonts, so the
 * branded display text (Cairo/Tajawal ExtraBold) is rendered to images.
 *
 * Requirements:
 * - ImageMagick with Pango delegate (`magick` on PATH) — handles Arabic
 *   shaping/bidi correctly. Do NOT use @resvg/resvg-js (broken Arabic bidi)
 *   or node-canvas (no Node 24 prebuild).
 * - Fonts installed for fontconfig, e.g. ~/.fonts/cairo-800.ttf and
 *   ~/.fonts/tajawal-800.ttf, then `fc-cache -f`. Font family names as seen
 *   by fontconfig: "Cairo" (weight via font desc) and "Tajawal ExtraBold"
 *   (weight baked into the family name — must use font_family attr).
 *
 * Run: pnpm --filter @workspace/scripts run generate-email-text-images
 * After regenerating, update the hardcoded display widths (intrinsic px / 2)
 * in artifacts/api-server/src/lib/emailTemplates.ts if dimensions changed.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const OUT_DIR = resolve(import.meta.dirname, "../../artifacts/api-server/assets/email-text");

const navy = "#0F172A";
const blue = "#2563EB";
const white = "#FFFFFF";

interface Span {
  text: string;
  color: string;
}

interface Job {
  file: string;
  spans: Span[];
  lang: "ar" | "en";
  sizePt: number;
}

const jobs: Job[] = [
  {
    file: "welcome-headline-ar",
    spans: [
      { text: "نظامي ", color: navy },
      { text: "يرجّع لك.", color: blue },
    ],
    lang: "ar",
    sizePt: 56,
  },
  {
    file: "welcome-headline-en",
    spans: [
      { text: "Nizamy ", color: navy },
      { text: "pays you back.", color: blue },
    ],
    lang: "en",
    sizePt: 56,
  },
  {
    file: "banner-ar",
    spans: [{ text: "حتى 30% من اشتراكك يرجع لك سنويًا", color: white }],
    lang: "ar",
    sizePt: 32,
  },
  {
    file: "banner-en",
    spans: [{ text: "Up to 30% of your subscription back every year", color: white }],
    lang: "en",
    sizePt: 32,
  },
  {
    file: "returning-headline-ar",
    spans: [
      { text: "نظام موارد بشرية ", color: navy },
      { text: "يرجع لك قيمة.", color: blue },
    ],
    lang: "ar",
    sizePt: 52,
  },
  {
    file: "returning-headline-en",
    spans: [
      { text: "An HR system that ", color: navy },
      { text: "pays you value.", color: blue },
    ],
    lang: "en",
    sizePt: 52,
  },
  {
    file: "stat-ar",
    spans: [{ text: "حتى 30%", color: blue }],
    lang: "ar",
    sizePt: 92,
  },
  {
    file: "stat-en",
    spans: [{ text: "Up to 30%", color: blue }],
    lang: "en",
    sizePt: 92,
  },
];

function escapeMarkup(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function markupFor(job: Job): string {
  return job.spans
    .map((span) => {
      const fontAttrs = `font_family="IBM Plex Sans Arabic" weight="bold" size="${job.sizePt}pt"`;
      return `<span ${fontAttrs} foreground="${span.color}">${escapeMarkup(span.text)}</span>`;
    })
    .join("");
}

function main(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const workDir = mkdtempSync(join(tmpdir(), "email-text-"));
  for (const job of jobs) {
    const markupPath = join(workDir, `${job.file}.txt`);
    writeFileSync(markupPath, markupFor(job), "utf8");
    const outPath = join(OUT_DIR, `${job.file}.png`);
    execFileSync("magick", [
      "-background",
      "none",
      `pango:@${markupPath}`,
      "-trim",
      "+repage",
      outPath,
    ]);
    const size = execFileSync("magick", ["identify", "-format", "%wx%h", outPath], {
      encoding: "utf8",
    });
    process.stdout.write(`${job.file}.png ${size}\n`);
  }
}

main();
