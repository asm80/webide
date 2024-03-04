import EditorWorker from 'url:monaco-editor/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		return EditorWorker;
	}
};

window.editor=monaco.editor.create(document.getElementById('container'), {
	value: ['function x() {', '\tconsole.log("Hello world!");', '}',"\n\n\n\n\n\n\n"].join('\n'),
	language: 'assembler',
    automaticLayout: true,
    theme: "vs-dark",
	fontSize: 16
});

const seth = (height) => {
	let lay = window.editor.getLayoutInfo()
	lay.height = height
	window.editor.layout(lay)

	document.getElementById("tree").style.maxHeight = height + "px"
}
window.seth=seth

const resizer = (event) => {
	console.log("Onresize")
	seth(window.innerHeight - 150)
}


addEventListener("resize", resizer)
resizer()
