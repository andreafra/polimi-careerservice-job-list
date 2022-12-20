<script>
	import { json } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { catURL, jobsURL } from './fetchJobs';

	onMount(async () => {
		const catRes = await fetch(catURL);
		if (catRes.status === 200) {
			const { data } = await catRes.json();
			categories = data.sort((a, b) => b.subscriptions - a.subscriptions);
		}

		fetchJobs();
	});

	async function fetchJobs() {
		const jobsMetadataRes = await fetch(jobsURL());
		if (jobsMetadataRes.status === 200) {
			const { data } = await jobsMetadataRes.json();
			totalPages = data.numberOfPages;

			const jobsRes = await fetch(jobsURL(selectedCat, totalPages, 1));
			if (jobsRes.status === 200) {
				const { data } = await jobsRes.json();
				jobs = data.pages.flat();
			}
		}
	}

	let totalPages = 0;
	let selectedCat = '';
	let categories = [];
	let jobs = [];

	let sortJobNameAsc = false;
	let sortCompanyAsc = false;
	let sortLocationAsc = false;

	function compareString(a, b) {
		a = a.toUpperCase();
		b = b.toUpperCase();
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	}

	function sortByJob() {
		sortJobNameAsc = !sortJobNameAsc;
		jobs = jobs.sort((a, b) => compareString(a.name, b.name));
		if (!sortJobNameAsc) jobs = jobs.reverse();
		console.log(jobs);
	}

	function sortByCompany() {
		sortCompanyAsc = !sortCompanyAsc;
		jobs = jobs.sort((a, b) => compareString(a.companyName, b.companyName));
		if (!sortCompanyAsc) jobs = jobs.reverse();
		console.log(jobs);
	}

	function sortByLocation() {
		sortLocationAsc = !sortLocationAsc;
		jobs = jobs.sort((a, b) => compareString(a.location, b.location));
		if (!sortLocationAsc) jobs = jobs.reverse();
		console.log(jobs);
	}
</script>

<h1>Jobs</h1>
<select bind:value={selectedCat} on:change={async () => fetchJobs()}>
	<option value="" selected>All</option>
	{#each categories as cat}
		<option value={cat.fieldId}>
			{cat.fieldName} [{cat.subscriptions}]
		</option>
	{/each}
</select>

<p>Entries: {jobs.length}</p>
<table class="jobs">
	<tr class="job-header">
		<th on:click={() => sortByJob()}>
			<span>{sortJobNameAsc ? '▲' : '▼'}</span>
			Job
		</th>
		<th on:click={() => sortByCompany()}>
			<span>{sortCompanyAsc ? '▲' : '▼'}</span>
			Company
		</th>
		<th on:click={() => sortByLocation()}>
			<span>{sortLocationAsc ? '▲' : '▼'}</span>
			Location
		</th>
	</tr>
	{#each jobs as job}
		<tr class="job">
			<td>{job.name}</td>
			<td>{job.companyName}</td>
			<td>{job.location}</td>
		</tr>
	{/each}
</table>

<style>
	* {
		font-family: sans-serif;
	}
	.job:nth-child(odd) {
		background-color: #ddd;
	}
	table,
	th,
	td {
		border-spacing: 0;
		border: 1px solid black;
	}
</style>
