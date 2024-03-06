<script>

	let ideSize="big"

	import Monaco from '$lib/monaco/monaco.svelte';

	import Nav from '$lib/nav.svelte';
	import SBTree from '$lib/sbtree/sbtree.svelte';
	import Footer from '$lib/footer.svelte';

	import { treeData } from '../test-tree';


</script>

<style>
	.scrollbar::-webkit-scrollbar {
  width: 15px;
}
::-webkit-scrollbar-thumb {
  background: #444;
  border-radius:0;
}
</style>

<div class="{ideSize}">
<Nav />

<div class="columns is-fullheight">
	<div class="column is-2 is-sidebar-menu scrollbar">
		<aside class="amenu">
		file tree
		<SBTree data={treeData} />
		</aside>
	</div>
	<div class="column is-8 ais-fullheight is-main-content">
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