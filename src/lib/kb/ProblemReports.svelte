<script lang="ts">
  import type { Problem } from '#lib/kb/problems';
  import { split } from '#lib/kb/split-4471';

  // Every report in one problem, so the count can be checked line by line.
  let { problem }: { problem: Problem } = $props();
  const reports = $derived(split.groups.find((g) => g.problem === problem)?.reports ?? []);
</script>

<details>
  <summary>the {reports.length} reports</summary>
  <ul>
    {#each reports as r (r.id)}
      <li><code>{r.id}</code> · {r.tenant} · {r.channel} · {r.receivedAt.slice(0, 10)} · “{r.body}”</li>
    {/each}
  </ul>
</details>

<style>
  details { margin: 0.5rem 0 1rem; font-size: 0.88rem; }
  li { color: var(--muted); }
</style>
