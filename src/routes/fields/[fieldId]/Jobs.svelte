<script lang="ts">
	import type { Job } from '$lib/model/job';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Thumbsup, Organization, Calendar, Location } from '@steeze-ui/octicons';
	import { getInitials } from '$lib/utils/initials';

	import { page } from '$app/stores';

	export let jobs: Job[] = [];
</script>

<ul class="grid grid-cols-1 md:grid-cols-3 gap-2 py-2">
	{#each jobs as job}
		<li class="card rounded-xl">
			<a href={`${$page.url.pathname}/${job.type}/${job.id}`} class="block p-0">
				<div class="flex gap-2 p-2">
					<div class="shrink-0 grow-0 flex flex-col h-min gap-2">
						<div class="flex-col bg-tertiary-200 h-min rounded-md">
							<Avatar
								src={job.pictureUrl}
								class="h-16 w-16 rounded-md border-2 border-tertiary-200"
								initials={getInitials(job.company)}
							/>
							<div class="flex content-baseline gap-1 justify-center py-1 text-black">
								<Icon src={Thumbsup} class="h-4 w-4 block self-center" />
								<span class="self-center">
									{job.numberOfApplicants}
								</span>
							</div>
						</div>
						<div
							class={`${
								job.type === 'Stage' ? 'bg-orange-400' : 'bg-emerald-400'
							} text-center uppercase text-sm font-bold py-1 tracking-wider rounded-md`}
						>
							{job.type}
						</div>
					</div>
					<div class="block flex-grow">
						<h3 class="font-bold">
							{job.name.replaceAll('&amp;', '&')}
						</h3>
						<div class="flex gap-2">
							<Icon src={Organization} class="h-4 w-4 self-center shrink-0" />
							{job.company}
						</div>
						<div class="flex gap-2">
							<Icon src={Calendar} class="h-4 w-4 self-center shrink-0" />
							{new Date(job.date).toLocaleDateString('it')}
						</div>
						<div class="flex gap-2">
							<Icon src={Location} class="h-4 w-4 self-center  shrink-0" />
							<div class="capitalize grow">
								{job.city.toLocaleLowerCase()}
								{#if job.province}
									({job.province.toLocaleLowerCase()})
								{/if}
							</div>
						</div>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
