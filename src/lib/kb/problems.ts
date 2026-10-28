// The problems in a merged ticket, counted the desk's way. causes.ts files every report under its
// cause by tenant; the desk's own reading (desk-notes.json) marks the reports that are not a
// date-order bug at all: the date moved by one day. As in CauseTable (`readAs`), those stay counted
// where they are filed and are counted again under the problem they were read as.
// Pages explain it; this file is what runs.
// Plain relative imports with extensions, so scripts/sync-issues.ts runs the same code in Node.
import { causeOf, uniqueById, type Report, type Tenant } from './causes.ts';

export type Problem = 'parser' | 'hint' | 'one-day';
export const PROBLEMS: readonly Problem[] = ['parser', 'hint', 'one-day'];

export const PROBLEM_INFO: Record<Problem, { title: string; what: string }> = {
  parser: {
    title: 'Shared date parser reads day-first dates month first',
    what: 'Reports from day-first tenants through the app, email and the booking-v2 form: day and month come out swapped (7 April shows as 4 July).',
  },
  hint: {
    title: 'booking-v3 form hints MM/DD/YYYY to day-first tenants, then reads the date day first',
    what: "Form reports from day-first tenants on booking-v3: people type what the hint asks, month first, and the form reads it the tenant's way. Same symptom as the parser bug, different code.",
  },
  'one-day': {
    title: 'Dates move by one day, not day and month swapped',
    what: 'The date shifts by a single day (Tuesday shows as Monday), or two people in different time zones see different days for one meeting. Not a date-order bug.',
  },
};

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: number;
  channels: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
  // Reports in this group that are also counted under another problem: problem → count.
  alsoIn: Partial<Record<Problem, number>>;
};

export type Split = { ticket: number; total: number; groups: ProblemGroup[]; unplaced: Report[] };

// Every problem a report counts under: its cause by tenant, plus how the desk read it.
export function problemsOf(r: Report, t: Tenant | undefined, oneDay: readonly string[]): Problem[] {
  const cause = causeOf(r, t);
  return [...(cause ? [cause] : []), ...(oneDay.includes(r.id) ? (['one-day'] as const) : [])];
}

export function splitTicket(
  all: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDay: readonly string[],
  ticket: number,
): Split {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const groups: ProblemGroup[] = [];
  for (const problem of PROBLEMS) {
    const rs = merged.filter((r) => problemsOf(r, tenantOf(r), oneDay).includes(problem));
    if (!rs.length) continue;
    const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
    groups.push({
      problem,
      reports: rs,
      tenants: new Set(rs.map((r) => r.tenant)).size,
      channels: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.channel]: (n[r.channel] ?? 0) + 1 }), {}),
      firstSeen: days[0],
      lastSeen: days[days.length - 1],
      alsoIn: rs.reduce<Partial<Record<Problem, number>>>((n, r) => {
        for (const q of problemsOf(r, tenantOf(r), oneDay)) if (q !== problem) n[q] = (n[q] ?? 0) + 1;
        return n;
      }, {}),
    });
  }
  const unplaced = merged.filter((r) => problemsOf(r, tenantOf(r), oneDay).length === 0);
  return { ticket, total: merged.length, groups: groups.sort((a, b) => b.reports.length - a.reports.length), unplaced };
}
