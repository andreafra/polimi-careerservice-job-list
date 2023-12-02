<script lang="ts">
	import { page } from '$app/stores';
	import type { Job } from '$lib/model/job';
	import { Accordion, AccordionItem, Avatar } from '@skeletonlabs/skeleton';
	import Jobs from './Jobs.svelte';
	import { ChevronUp, ChevronDown, Search } from '@steeze-ui/octicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { getInitials } from '$lib/utils/initials';
	import { Fzf } from 'fzf';
	import type { Field } from '$lib/model/field';
	import { goto } from '$app/navigation';

	const SortOrder = {
		asc: 1,
		desc: -1
	};
	type SortOrder = keyof typeof SortOrder;

	const sorts: { [key: string]: { name: string } } = {
		company: { name: 'Company Name' },
		date: { name: 'Date' },
		name: { name: 'Name' },
		numberOfApplicants: { name: 'Applicants' }
	};
	type SortKeys = keyof typeof sorts & string;

	const groupBy = (key: string, data: Job[]): { [key: string]: Job[] } =>
		data.reduce((acc, curr) => {
			// instance a new list if needed
			const keyValue = curr[key];
			(acc[keyValue] || (acc[keyValue] = [])).push(curr);
			return acc;
		}, {});

	const sortBy = (key: string, dir: SortOrder, data: Job[]) => {
		if (key === 'company') return data;
		if (key === 'date') {
			return data.sort(
				(a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime()) * SortOrder[dir]
			);
		} else {
			return data.sort(
				(a, b) =>
					a[key].toString().localeCompare(b[key].toString(), 'en', { numeric: true }) *
					SortOrder[dir]
			);
		}
	};

	const getJobsByCompany = (jobs: Job[], dir: SortOrder) =>
		Object.entries(groupBy('company', jobs)).sort(
			([a, _a], [b, _b]) => a.localeCompare(b, 'en', { numeric: true }) * SortOrder[dir]
		);

	const fields: Field[] = $page.data.fields;
	let activeField = $page.params.fieldId ?? 'all';
	let jobs: Job[] = $page.data.jobs;
	let jobsByCompany = [];
	let filterJob = false;
	let filterStage = false;
	let activeSort: SortKeys = 'date';
	let activeSortOrder: SortOrder = 'desc';
	let searchInput = '';

	const fzf = new Fzf($page.data.jobs as Job[], {
		selector: (item) => `${item.name} ${item.company} ${item.city} ${item.province} ${item.type}`
	});

	$: {
		if (searchInput.length === 0) {
			const allJobs: Job[] = $page.data.jobs;
			const filteredJobs = allJobs.filter(
				(e) =>
					(filterJob && e.type === 'Job') ||
					(filterStage && e.type === 'Stage') ||
					(!filterJob && !filterStage)
			);
			if (activeSort !== 'company') {
				jobs = sortBy(activeSort, activeSortOrder, filteredJobs);
			} else {
				jobsByCompany = getJobsByCompany(filteredJobs, activeSortOrder);
			}
		} else {
			jobs = fzf.find(searchInput).map(({ item }) => item);
			if (activeSort === 'company') {
				jobsByCompany = getJobsByCompany(jobs, activeSortOrder);
			}
		}
	}
</script>

<h2 class="h2 py-2">{fields.find((a) => a.fieldId === activeField)?.fieldName ?? 'All'}</h2>
<section class="grid grid-cols-1 md:grid-cols-2 gap-2">
	<select
		class="select col-span-1 bg-neutral-100/50"
		bind:value={activeField}
		on:change={() => {
			goto(`/fields/${activeField}`);
		}}
	>
		<option value="all">All</option>
		{#each fields as field}
			<option value={field.fieldId}>{field.fieldName} [{field.subscriptions}]</option>
		{/each}
	</select>
	<!-- Search -->
	<div
		class="col-span-1 input-group input-group-divider grid-cols-[auto_1fr_auto] bg-neutral-100/50 rounded-md"
	>
		<div class="input-group-shim"><Icon src={Search} class="h-4 w-4" /></div>
		<input type="search" placeholder="Search..." bind:value={searchInput} />
	</div>
</section>
<!-- Filter Job/Stage -->

<!-- Filters -->
<div class="flex justify-start flex-wrap gap-2 my-2">
	<button
		class="chip {filterStage ? 'variant-filled' : 'variant-soft'}"
		on:click={() => {
			filterStage = !filterStage;
		}}
		on:keypress>Stage</button
	>
	<button
		class="chip {filterJob ? 'variant-filled' : 'variant-soft'}"
		on:click={() => {
			filterJob = !filterJob;
		}}
		on:keypress>Jobs</button
	>
	<span class="divider-vertical h-8 mx-1 border-black/20" />
	{#each Object.entries(sorts) as [key, options]}
		<button
			class="chip {key === activeSort ? 'variant-filled' : 'variant-soft'}"
			on:click={() => {
				if (activeSort === key) {
					activeSortOrder = activeSortOrder === 'asc' ? 'desc' : 'asc';
				} else {
					activeSort = key;
					activeSortOrder = 'asc';
				}
				if (key === 'company') {
					jobsByCompany = getJobsByCompany(jobs, activeSortOrder);
				} else {
					jobs = sortBy(key, activeSortOrder, jobs);
				}
			}}
			on:keypress
		>
			Sort by {options.name}
			{#if key !== activeSort || activeSortOrder === 'asc'}
				<Icon src={ChevronUp} class="h-4 w-4 ml-2" />
			{:else}
				<Icon src={ChevronDown} class="h-4 w-4 ml-2" />
			{/if}
		</button>
	{/each}
</div>

<!-- List -->
{#if activeSort === 'company'}
	<ul class="w-full flex flex-col gap-2 my-2">
		{#each jobsByCompany as [company, jobs]}
			<li class="">
				<Accordion>
					<AccordionItem>
						<svelte:fragment slot="lead">
							<Avatar
								src={jobs[0].pictureUrl}
								initials={getInitials(company)}
								class="h-8 w-8 rounded-sm"
							/>
						</svelte:fragment>
						<svelte:fragment slot="summary">
							<h3 class="h4 font-bold">
								<span class="align-middle">
									{company}
								</span>
								<span
									class="chip variant-filled-tertiary align-middle w-8 h-8 text-center rounded-full ml-2"
									>{jobs.length}</span
								>
							</h3>
						</svelte:fragment>
						<svelte:fragment slot="content">
							<Jobs {jobs} />
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
			</li>
		{/each}
	</ul>
{:else}
	<Jobs {jobs} />
{/if}
