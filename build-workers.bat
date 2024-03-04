set ROOT ./node_modules/monaco-editor/esm/vs
set OPTS=--no-source-maps --log-level 1

call parcel build ./node_modules/monaco-editor/esm/vs/language/json/json.worker.js --no-source-maps --log-level error
call parcel build ./node_modules/monaco-editor/esm/vs/language/css/css.worker.js --no-source-maps --log-level error
call parcel build ./node_modules/monaco-editor/esm/vs/language/html/html.worker.js --no-source-maps --log-level error
call parcel build ./node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js --no-source-maps --log-level error
call parcel build ./node_modules/monaco-editor/esm/vs/editor/editor.worker.js --no-source-maps --log-level error