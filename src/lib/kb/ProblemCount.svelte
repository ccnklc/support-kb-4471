<script lang="ts">
  import type { Problem } from '#lib/kb/problems';
  import { countOf, split } from '#lib/kb/split-4471';

  // A count in running text, computed: <ProblemCount problem="hint" /> for one problem's reports,
  // <ProblemCount of="problems" /> for how many problems, <ProblemCount /> for all reports.
  let { problem, of = 'reports' }: { problem?: Problem; of?: 'reports' | 'problems' } = $props();
</script>

<strong>{of === 'problems' ? split.groups.length : problem ? countOf(problem) : split.total}</strong>
