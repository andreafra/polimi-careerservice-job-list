<script>
	import { onMount } from 'svelte';
	import { catURL, jobsURL } from './fetchJobs';

	const DEFAULT_IMG_URL = 'https://app.careerservice.polimi.it/upload/immagine_default_piccola.png';

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
				jobs = jobs.map((job) => {
					let loc = job.location.match(/(.*?)\((.*?)\)/);
					return {
						id: job.id,
						date: job.date,
						job: job.name.trim(),
						pictureUrl: job.pictureUrl !== DEFAULT_IMG_URL ? job.pictureUrl : null,
						company: job.companyName.trim(),
						type: job.announcementType,
						city: loc[1] || 'N/A',
						province: loc[2].length > 1 ? loc[2] : 'N/A',
						numberOfApplicants: job.stored
					};
				});
				jobs.forEach((job) => {
					cities.add(job.city);
					provinces.add(job.province);
				});
			}
		}
	}

	let totalPages = 0;
	let selectedCat = '';
	let categories = [];
	let jobs = [];
	let cities = new Set();
	let provinces = new Set();

	function compareString(a, b) {
		a = a.toUpperCase();
		b = b.toUpperCase();
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	}

	let sortState = {};

	function sortBy(attr) {
		sortState[attr] = !sortState[attr];
		jobs = jobs.sort((a, b) => compareString(a[attr], b[attr]));
		if (!sortState[attr]) jobs = jobs.reverse();
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
		<th on:click={() => sortBy('job')}>
			<span>{sortState['job'] ? '▲' : '▼'}</span>
			Job
		</th>
		<th on:click={() => sortBy('company')}>
			<span>{sortState['company'] ? '▲' : '▼'}</span>
			Company
		</th>
		<th on:click={() => sortBy('type')}>
			<span>{sortState['type'] ? '▲' : '▼'}</span>
			Type</th
		>
		<th on:click={() => sortBy('city')}>
			<span>{sortState['city'] ? '▲' : '▼'}</span>
			City
		</th>
		<th on:click={() => sortBy('province')}>
			<span>{sortState['province'] ? '▲' : '▼'}</span>
			Province/State
		</th>
	</tr>
	{#each jobs as job}
		<tr class="job">
			<td>{job.job}</td>
			<td>
				{#if job.pictureUrl}
					<img src={job.pictureUrl} alt="Logo of {job.company}" />
				{/if}
				{job.company}</td
			>
			<td>{job.type}</td>
			<td>{job.city}</td>
			<td>{job.province}</td>
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

	table td {
		max-width: 20em;
	}
</style>
