// #4471 split by problem, from the exports in src/lib/data. Rebuilt on every build.
import reports from '#lib/data/reports-4471.json';
import notes from '#lib/data/desk-notes.json';
import tickets from '#lib/data/tickets.json';
import type { Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';
import { splitTicket, type Problem } from '#lib/kb/problems';

export const split = splitTicket(reports as Report[], tenantOf, notes.oneDayMove, 4471);

export const countOf = (p: Problem): number => split.groups.find((g) => g.problem === p)?.reports.length ?? 0;

// Issue numbers in this repo, written by scripts/sync-issues.ts.
export const issueOf = (p: Problem): number | undefined => (tickets as Partial<Record<Problem, number>>)[p];
export const ISSUES_URL = 'https://github.com/ccnklc/support-kb-4471/issues';
