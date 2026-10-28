<script lang="ts">
  import type { Problem } from '#lib/kb/problems';
  import { countOf, split } from '#lib/kb/split-4471';

  // A count in running text, computed: <ProblemCount problem="hint" />, or <ProblemCount /> for the total.
  let { problem }: { problem?: Problem } = $props();
</script>

<strong>{problem ? countOf(problem) : split.total}</strong>
