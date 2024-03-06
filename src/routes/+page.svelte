<script>

	let ideSize="big"

	import Monaco from '$lib/monaco/monaco.svelte';

	import Nav from '$lib/nav.svelte';
	import SBTree from '$lib/sbtree/sbtree.svelte';
	import Footer from '$lib/footer.svelte';

	import { treeData } from '../test-tree';


</script>

<div class="{ideSize}">
<Nav />

<div class="columns is-fullheight">
	<div class="column is-2">
		file tree
		<SBTree data={treeData} />
	</div>
	<div class="column is-8 ais-fullheight">
		<Monaco ideSize={ideSize} />
	</div>
	<div class="column is-1 ">
		<h1 class="text-center">Hello <i class="fa-solid fa-folder"></i> World</h1>
		<select class="select" bind:value={ideSize}>
			<option>small</option>
			<option>medium</option>
			<option>big</option>
		</select>
	</div>

</div>
<Footer />
</div>