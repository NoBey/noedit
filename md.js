const marked = require('marked')

console.log(marked.lexer(`
| sd | sd |
|---|---|
| ds | sdd |
| ds | sdd |
`))

console.log(marked.parse(`
| sd | sd |
|---|---|
| ds | sdd |
| ds | sdd |
`))