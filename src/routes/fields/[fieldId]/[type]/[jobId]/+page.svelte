<script lang="ts">
	import { page } from '$app/stores';
	import type { Details } from '$lib/model/details';
	import { getInitials } from '$lib/utils/initials';
	import { Avatar } from '@skeletonlabs/skeleton';
	import {
		ArrowLeft,
		Briefcase,
		Clock,
		CreditCard,
		Globe,
		IdBadge,
		LinkExternal,
		ListOrdered,
		MortarBoard,
		Organization
	} from '@steeze-ui/octicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	const { fieldId } = $page.params;

	const job: Details = $page.data.job;
</script>

<article class="max-w-[70ch] px-4 py-2 rounded-xl mx-auto bg-surface-100 dark:bg-surface-800">
	<a href={`/fields/${fieldId}`} class="inline-flex gap-2 py-2">
		<Icon src={ArrowLeft} class="h-4 w-4 self-center" />
		<span class="self-center"> Back to jobs </span>
	</a>
	<h1 class="h3">{job.name}</h1>
	<div class="grid grid-cols-[4rem_auto] gap-2 py-2">
		<Avatar
			src={job.logoUrl}
			initials={getInitials(job.companyName)}
			class="h-16 w-16 col-span-1"
		/>
		<div class="flex flex-col justify-center">
			<a href={job.companyLink}>
				{job.companyName}
			</a>
			<span class="text-ellipsis">
				{job.location}
			</span>
		</div>
	</div>
	<p class="flex gap-2">
		<span>{new Date(job.date).toLocaleDateString('it')}</span>
		<span>•</span>
		<span>{job.stored} applicants</span>
		<span>•</span>
		<span>{job.positions} open positions</span>
	</p>
	<hr class="my-2" />
	<div class="grid gap-y-1 gap-x-2 grid-cols-[1rem_auto]">
		<Icon src={Briefcase} class="h-4 w-4 self-center" />
		<span>
			{job.contractType ?? ''}
		</span>
		<Icon src={Organization} class="h-4 w-4 self-center" />
		<span>
			{job.employees} employees<br />
			{job.sector}
		</span>
		<Icon src={Globe} class="h-4 w-4 self-center" />
		<span>
			<a href={`//${job.website}`} class="underline">Website</a> •
			<a href={`//${job.careerWebsite}`} class="underline"> Careers Website</a>
		</span>
		<Icon src={IdBadge} class="h-4 w-4 self-center" />
		<span>
			Area: {job.companyArea}
		</span>
		<Icon src={ListOrdered} class="h-4 w-4 self-center" />
		<span>
			Esperienza: {job.experience}
		</span>
		<Icon src={MortarBoard} class="h-4 w-4 self-center" />
		<span>
			Laurea: {job.degreeType}
		</span>
		{#if job.durationInHour}
			<Icon src={Clock} class="h-4 w-4 self-center" />
			<span>
				Durata: {job.durationInMonth} mesi ({job.durationInHour} ore)
			</span>
		{/if}
		{#if job.hasRefound}
			<Icon src={CreditCard} class="h-4 w-4 self-center" />
			<span>
				Indennità: {job.refoundAmount} €
			</span>
		{/if}
	</div>
	<div class="py-4 space-x-2">
		<a
			class="btn variant-filled-primary"
			href={`https://www.careerservice.polimi.it/it-IT/Announcements/Home/Index/?announcementId=${$page.params.id}&type=${$page.params.type}`}
		>
			<span>Apply</span>
			<span>
				<Icon src={LinkExternal} class="h-4 w-4" />
			</span>
		</a>
	</div>
	<section>
		<h2>About the job</h2>
		<p class="whitespace-pre-wrap">{job.offerDescription}</p>
		<p class="whitespace-pre-wrap">{job.description}</p>
		<h3>Requisiti</h3>
		<p class="whitespace-pre-wrap">{job.requestedSkills}</p>
		{#if job.informaticSkills}
			<h3>Competenze Informatiche</h3>
			<p class="whitespace-pre-wrap">{job.informaticSkills}</p>
		{/if}
		<h3>Competenze Linguistiche</h3>
		<p class="whitespace-pre-wrap">{job.languageSkills}</p>
		<h3>Area Disciplinare</h3>
		<p>{job.relevantDegrees}</p>
	</section>
</article>
