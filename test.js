const md = require('markdown').markdown

let text = `
# 欢迎使用 Cmd Markdown 编辑阅读器
# 323

`



console.time(1)
var tree = md.parse( text );
console.timeEnd(1)
console.log(tree)
