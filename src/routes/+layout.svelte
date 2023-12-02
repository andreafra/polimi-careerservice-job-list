<script>
	import '../app.css';

	import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<h1 class="font-bold">Unofficial Polimi CareerService Viewer</h1>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<div class="container mx-auto p-2 pb-6">
		<slot />
	</div>
</AppShell>
