<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as monaco from 'monaco-editor';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

	import { code as jsCode } from '$lib/js_code';
	import { code as tsCode } from '$lib/ts_code';
	import { code as phpCode } from '$lib/php_code';
	import { code as pyCode } from '$lib/py_code';
	import { code as htmlCode } from '$lib/html_code';

	import  Nav from '$lib/Nav.svelte';
	import Footer from '$lib/footer.svelte';

	let editorElement: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor;
	let model: monaco.editor.ITextModel;


	const seth = (height) => {
	let lay = {...editor.getLayoutInfo()}
	lay.height = height
	editor.layout(lay)

	//document.getElementById("tree").style.maxHeight = height + "px"
}
//seth=seth

const resizer = () => {
	console.log("Onresize")
	seth(window.innerHeight - 150)
}


addEventListener("resize", resizer)
//resizer()


	function loadCode(code: string, language: string) {
		model = monaco.editor.createModel(code, language);

		editor.setModel(model);
	}

	onMount(async () => {
		self.MonacoEnvironment = {
			getWorker: function (_: any, label: string) {
				if (label === 'json') {
					return new jsonWorker();
				}
				if (label === 'css' || label === 'scss' || label === 'less') {
					return new cssWorker();
				}
				if (label === 'html' || label === 'handlebars' || label === 'razor') {
					return new htmlWorker();
				}
				if (label === 'typescript' || label === 'javascript') {
					return new tsWorker();
				}
				return new editorWorker();
			}
		};

		monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

		editor = monaco.editor.create(editorElement, {
			automaticLayout: true,
			theme: 'vs-dark'
		});

		loadCode(jsCode, 'javascript');
		resizer()
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});


//*****----*/


</script>

<Nav />

<div class="columns is-fullheight">
	<div class="column is-2">
		<button class="w-fit border-2 p-1" on:click={() => loadCode(jsCode, 'javascript')}
			>JavaScript</button
		>
		<button class="w-fit border-2 p-1" on:click={() => loadCode(tsCode, 'typescript')}
			>TypeScript</button
		>
		<button class="w-fit border-2 p-1" on:click={() => loadCode(phpCode, 'php')}>PHP</button>
		<button class="w-fit border-2 p-1" on:click={() => loadCode(pyCode, 'python')}>Python</button>
		<button class="w-fit border-2 p-1" on:click={() => loadCode(htmlCode, 'html')}>HTML</button>
	</div>
	<div class="column is-8 ais-fullheight">
		<div class="hero ais-fullheight" bind:this={editorElement} />
	</div>
	<div class="column is-1 ">
		<h1 class="text-center">Hello World</h1>
	</div>

</div>
