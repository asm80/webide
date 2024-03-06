<script>
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

let editorElement;
let editor;
let model;

export let ideSize


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

const setFontSize = (size) => {
    let fontSize = (size=="small"?12:size=="big"?24:16)
    console.log("Updating font size", size)
    if (editor) editor.updateOptions({fontSize: fontSize})
}

$: setFontSize(ideSize)

function loadCode(code, language) {
		model = monaco.editor.createModel(code, language);

		editor.setModel(model);
	}

	onMount(async () => {
		self.MonacoEnvironment = {
			getWorker: function (_, label) {
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
			theme: 'vs-dark',
            fontLigatures: true,
            fontSize: (ideSize=="small"?12:ideSize=="big"?24:16),
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

<div class="hero ais-fullheight" bind:this={editorElement} />