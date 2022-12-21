<script>
	import { ArrowDown, ArrowUp } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { onMount } from 'svelte';
	import { catURL, jobsURL } from './fetchJobs';

	const DEFAULT_IMG_URL = 'https://app.careerservice.polimi.it/upload/immagine_default_piccola.png';

	const TABLE_HEADERS = [
		{ title: 'Jobs', attr: 'job' },
		{ title: 'Company', attr: 'company' },
		{ title: 'Type', attr: 'type' },
		{ title: 'City', attr: 'city' },
		{ title: 'Province/State', attr: 'province' }
	];

	const FILTERED_COLS = ['company', 'type', 'city', 'province'];
	const CSS_COLS_SIZE = ['', '', 'w-28', 'w-48', 'w-48'];

	let totalPages = 0;
	let selectedCat = '';
	let categories = [];
	let jobs = [];
	let filteredJobs = [];
	let sortState = {};
	let filterValues = {};
	let filters = {};

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
						city: (loc[1] || 'N/A').toUpperCase(),
						province: (loc[2].length >= 2 ? loc[2] : 'N/A').toUpperCase(),
						numberOfApplicants: job.stored
					};
				});

				filteredJobs = jobs;

				filterValues = createFilters(FILTERED_COLS, jobs);

				filterValues['province'] = sortProvinceAndState(filterValues['province']);
			}
		}
	}

	function compareString(a, b) {
		a = a.toUpperCase();
		b = b.toUpperCase();
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	}

	function sortBy(attr) {
		sortState[attr] = !sortState[attr];
		filteredJobs = filteredJobs.sort((a, b) => compareString(a[attr], b[attr]));
		if (!sortState[attr]) filteredJobs = filteredJobs.reverse();
	}

	function createFilters(headers, values) {
		const _filters = {};
		for (const header of headers) {
			_filters[header] = new Set();
		}
		for (const value of values) {
			for (const header of headers) {
				_filters[header].add(value[header]);
			}
		}
		for (const header of headers) {
			_filters[header] = [..._filters[header]].sort(compareString);
		}
		return _filters;
	}

	function applyFilters() {
		filteredJobs = jobs.filter(
			(elem) =>
				(elem.company === filters.company || !filters.company) &&
				(elem.type === filters.type || !filters.type) &&
				(elem.city === filters.city || !filters.city) &&
				(elem.province === filters.province || !filters.province)
		);
	}

	function sortProvinceAndState(elems) {
		let provinces = elems.filter((el) => el.length <= 2).sort(compareString);
		let states = elems.filter((el) => el.length > 2).sort(compareString);
		return ['--- Provinces ---', ...provinces, '--- States ---', ...states];
	}

	const getJobUrl = (id, type) =>
		'https://www.careerservice.polimi.it/it-IT/Announcements/Home/Index/?announcementId=' +
		id +
		'&type=' +
		type;
</script>

<h1 class="text-3xl font-bold py-4">Polimi CareerService Jobs</h1>

<label for="categoty" class="block font-bold">Category:</label>
<select
	id="category"
	class="border-2 border-slate-300 bg-slate-100 rounded-md px-2 text-lg"
	bind:value={selectedCat}
	on:change={async () => fetchJobs()}
>
	<option value="" selected>All</option>
	{#each categories as cat}
		<option value={cat.fieldId}>
			{cat.fieldName} [{cat.subscriptions}]
		</option>
	{/each}
</select>

<p class="my-4"><i>Entries:</i> {jobs.length}</p>
<p class="my-4">
	Click on a job to open it on the official CareerService page (you'll have to login!)
</p>

<div class="rounded-lg my-2 border-2 border-slate-100 overflow-auto">
	<table class="relative table-fixed w-full text-sm border-collapse border-slate-300 border-2">
		<thead class="">
			<tr class="job-header bg-slate-300 cursor-pointer">
				{#each TABLE_HEADERS as col, index}
					<th
						on:click={() => sortBy(col.attr)}
						class="text-left border-slate-300 px-2 py-1 text-xl text-slate-700 {CSS_COLS_SIZE[
							index
						]}"
					>
						<span>
							<Icon src={sortState[col.attr] ? ArrowUp : ArrowDown} class="w-6 h-6 inline" />
							{col.title}
						</span></th
					>
				{/each}
			</tr>
			<tr class="bg-slate-300">
				{#each TABLE_HEADERS as col}
					<th class="sticky top-0">
						{#if FILTERED_COLS.includes(col.attr) && Object.entries(filterValues).length > 0}
							<select
								class="w-full border-2 border-slate-400 bg-slate-100 rounded-md px-2 text-lg"
								bind:value={filters[col.attr]}
								on:change={() => applyFilters()}
							>
								<option value="" selected>All</option>
								{#each filterValues[col.attr] as entry}
									<option value={entry} disabled={entry.startsWith('---')}>{entry}</option>
								{/each}
							</select>
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each filteredJobs as job}
				<tr
					class="job odd:bg-slate-100 border-slate-300 border-2 hover:bg-slate-200 text-base cursor-pointer"
					on:click={() => {
						window.open(getJobUrl(job.id, job.type));
					}}
				>
					<td class="px-2 py-1">
						<a
							class="hover:underline"
							href={getJobUrl(job.id, job.type)}
							target="_blank"
							rel="noreferrer"
						>
							{job.job}
						</a>
					</td>
					<td class="px-2 py-1 ">
						{#if job.pictureUrl}
							<img src={job.pictureUrl} class="w-8 inline-block" alt="Logo of {job.company}" />
						{/if}
						{job.company}</td
					>
					<td class="px-2 py-1">{job.type}</td>
					<td class="px-2 py-1">{job.city}</td>
					<td class="px-2 py-1">{job.province}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
