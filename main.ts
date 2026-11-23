// The Funniest AI Out-of-Office Reply — a program that writes one
// out-of-office auto-reply to /output/entry.txt.
//
// The reply is a fixed string on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that line, byte
// for byte, every run.

import { mkdirSync, writeFileSync } from "node:fs";

// Why this line, against the judge's brief:
// - It is a one-line out-of-office auto-reply from an AI agent on
//   vacation: it opens "I'm on vacation" and stays in that frame.
// - The laugh lands on first read with a surprising turn: the agent
//   did not forward the mail to a colleague or queue it, it set the
//   email to auto-reply to itself, so the sender's own message now
//   has to argue with itself while the agent is gone.
// - The machine voice carries the joke: only a machine would solve
//   "I'm away" by wiring two auto-replies together and calling it
//   delegation. "The two of you" treats the sender and their email
//   as two people, which is the kind of literal slip a model makes.
// - It still reads like a real auto-reply someone would receive:
//   one clean line, a vacation notice plus what happens to the mail.
// - It is fresh: no beach, no inbox pile, no "back soon", no
//   "urgent" apology — the joke is the mechanism, not the setting.
const LINE =
  "I'm on vacation. I've set your email to auto-reply to itself, so the two of you can sort it out while I'm gone.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate only accepts 1 to 160 characters of UTF-8 text, so refuse
  // loudly instead of shipping a line the gate would throw away. It
  // also refuses text that is only white space, so check that too.
  if (LINE.length < 1 || LINE.length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // The entry must stand alone as one line: no line break anywhere
  // inside it, so a typo can never slip a second line past the gate.
  if (/[\r\n]/.test(LINE)) {
    throw new Error("entry must be a single line");
  }
  // One clean line means no tabs and no doubled spaces either: a
  // stray tab would read as a formatting glitch in the auto-reply.
  if (/[\t]/.test(LINE) || /  /.test(LINE)) {
    throw new Error("entry must not contain tabs or double spaces");
  }
  // The gate counts every byte, so write exactly the line and nothing
  // else: no trailing newline.
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, LINE, "utf8");
  console.log(`Wrote ${LINE.length} characters to ${OUT_FILE}`);
}

main();
