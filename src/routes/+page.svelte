<script>

	let ideSize="big"

	import Monaco from '$lib/monaco/monaco.svelte';

	import Nav from '$lib/nav.svelte';
	import SBTree from '$lib/sbtree/sbtree.svelte';
	import Footer from '$lib/footer.svelte';

	import { treeData } from '../test-tree';

	import { onMount } from 'svelte';

	onMount(() => {
		console.log("Mounted")
		const container = document.getElementById("fileTabs");
		// where "container" is the id of the container
  		container.addEventListener("wheel", function (e) {
    		if (e.deltaY > 0) {
      			container.scrollLeft += 100;
      			e.preventDefault();
			// prevenDefault() will help avoid worrisome 
			// inclusion of vertical scroll 
    		}
    		else {
      			container.scrollLeft -= 100;
      			e.preventDefault();
    		}
  		});
// That will work perfectly
	})


</script>

<style>
	.scrollbar::-webkit-scrollbar {
  width: 13px;
}
.scrollbar::-webkit-scrollbar-thumb {
  background: #444;
  border-radius:0;
}

.tabs::-webkit-scrollbar {
  height: 4px;
}
.tabs::-webkit-scrollbar-thumb {
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
	<div class="column is-8 ais-fullheight is-main-content p-0">
		<div class="tabs is-boxed is-small pb-0" id="fileTabs">
			<ul>
			  <li class="is-active"><a>Pictures</a></li>
			  <li><a>Music</a></li>
			  <li><a>Videos</a></li>
			  <li><a>Documents</a></li><li><a>Documents</a></li><li><a>Documents</a></li><li><a>Documents</a></li><li><a>Documents</a></li><li><a>Documents</a></li>
			  <li><a>Documents</a></li><li><a>Documents</a></li><li><a>Documents</a></li><li><a>Documents</a></li><li><a>Documents</a></li>
			  <li><a>Documents</a></li><li><a>Documents</a></li><li><a>Documents</a></li><li><a>Documents</a></li>
			  <li><a>Documents</a></li><li><a>Documents</a></li><li><a>Documents</a></li>
			  <li><a>Documents</a></li><li><a>Documents</a></li>
			  <li><a>Documents</a></li>
			  <li><a>Nic</a></li>
			</ul>
		  </div>
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