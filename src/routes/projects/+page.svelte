<script>


	import { page } from "$app/stores"


	import ProjectSelector from '$lib/projectSelector/projectSelector.svelte';
	import SwitchLayout from '$lib/switchLayout.svelte';

	import { onMount } from 'svelte';
	import {recountOrders} from "$util/tabs.js"

	import { get } from 'svelte/store';

	import * as TOML from '@ltd/j-toml';


	import { projectStore } from "$lib/shared/stores/project.js"



	onMount(async () => {
		//console.log("Mounted")

	})




</script>
	<div class="column is-10 is-main-content">
		<h1 class="title">Project selector</h1>
		{JSON.stringify($page.data)}
		<ProjectSelector session={$page.data.session?.user}/>
		<SwitchLayout/>
	</div>
