<script lang="ts">
  import { PROBLEM_INFO } from '#lib/kb/problems';
  import { ISSUES_URL, issueOf, split } from '#lib/kb/split-4471';

  const channels = (c: Record<string, number>) =>
    Object.entries(c)
      .sort((a, b) => b[1] - a[1])
      .map(([ch, n]) => `${ch} ×${n}`)
      .join(' · ');
</script>

<p class="sum" data-total={split.total}>
  <strong>{split.total}</strong> reports merged into #{split.ticket} ·
  <strong>{split.groups.length}</strong> problems{#if split.unplaced.length} · <strong>{split.unplaced.length}</strong> unplaced{/if}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>channels</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.groups as g (g.problem)}
      {@const issue = issueOf(g.problem)}
      <tr>
        <td><code>{g.problem}</code><br /><span class="what">{PROBLEM_INFO[g.problem].title}</span></td>
        <td>
          <strong>{g.reports.length}</strong>
          {#each Object.entries(g.alsoIn) as [q, n] (q)}<br /><span class="what">{n} also under <code>{q}</code></span>{/each}
        </td>
        <td class="tags">{channels(g.channels)}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if issue}<a href="{ISSUES_URL}/{issue}">#{issue}</a>{:else}not filed{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p class="note">Each report counts where the desk files it, by tenant. A report the desk read as another
problem is counted there too, so the rows add up to more than the reports.</p>

<style>
  .sum { font-size: 1.1rem; }
  .what { color: var(--muted); font-size: 0.85em; }
  .tags { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
</style>
