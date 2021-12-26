
# Markdown 测试语法

---

ღ•⁂€™↑→↓⇝√∞░▲▶◀●☀☁☂☃☄★☆☉☐☑☎☚☛☜☝☞☟☠☢☣☪☮☯☸☹☺☻☼☽☾♔♕♖♗♘♚♛♜♝♞♟♡♨♩♪♫♬✈✉✍✎✓✔✘✚✞✟✠✡✦✧✩✪✮✯✹✿❀❁❂❄❅❆❝❞❣❤❥❦➤

---

### 1. 斜体和粗体

> 使用 * 和 ** 表示斜体和粗体
> 使用 _ 和 __ 表示斜体和粗体
> 使用 ~~ 删除线
> 使用 ~~ 删除线

这是 *斜体*，这是 **粗体**。

~~删除线~~
*斜体字*      _斜体字_
**粗体**  __粗体__
***粗斜体*** ___粗斜体___



### 2. 分级标题

> 你可以选择在行首加井号表示不同级别的标题 (H1-H6)，例如：# H1, ## H2, ### H3，#### H4。

# Heading 1 link [Heading link](http://github.com/nobey "Heading link")
## Heading 2 link [Heading link](http://github.com/nobey "Heading link")
### Heading 3 link [Heading link](http://github.com/nobey "Heading link")
#### Heading 4 link [Heading link](http://github.com/nobey "Heading link") Heading link [Heading link](http://github.com/nobey "Heading link")
##### Heading 5 link [Heading link](http://github.com/nobey "Heading link")
###### Heading 6 link [Heading link](http://github.com/nobey "Heading link")




### 3. 外链接
```md
使用 [描述](链接地址) 为文字增加外链接。
```
使用 [描述](链接地址) 为文字增加外链接。

示例：

这是去往 [本人](http://github.com/nobey) 的链接。

### 4. 无序列表

```md
- 无序列表项
- 无序列表项

+ 无序列表项
+ 无序列表项

- 无序列表项
- 无序列表项
```

使用 *，+，- 表示无序列表。

示例：

- 无序列表项 一
- 无序列表项 二
- 无序列表项 三
  - sdd
    dsd
  - dsdds
  - dsdds

### 5. 有序列表


```md
1. 无序列表项
2. 无序列表项
```

使用数字和点表示有序列表。

示例：

1. 有序列表项 一
2. 有序列表项 二
3. 有序列表项 三

        
- [ ] **Cmd Markdown 开发**
    - [ ] 改进 Cmd 渲染算法，使用局部渲染技术提高渲染效率
    - [ ] 支持以 PDF 格式导出文稿
    - [x] 新增Todo列表功能 [语法参考](https://github.com/blog/1375-task-lists-in-gfm-issues-pulls-comments)
    - [x] 改进 LaTex 功能
        - [x] 修复 LaTex 公式渲染问题
        - [x] 新增 LaTex 公式编号功能 [语法参考](http://docs.mathjax.org/en/latest/tex.html#tex-eq-numbers)
- [ ] **七月旅行准备**
    - [ ] 准备邮轮上需要携带的物品
    - [ ] 浏览日本免税店的物品
    - [x] 购买蓝宝石公主号七月一日的船票


### 6. 文字引用

```md
> 表示文字引用
```
使用 > 表示文字引用。

示例：

> 野火烧不尽，春风吹又生。

### 7. 行内代码块

使用 \`代码` 表示行内代码块。

示例：

让我们聊聊 `html`。

### 8. 代码块


```md
 ```js
  // 这是一个代码块，
  var html = 'js'
 ```                                        .
```
使用 三个 ` 表示代码块 后面加上高亮语言。

Python 示例：

```python
@requires_authorization
def somefunc(param1='', param2=0):
    '''A docstring'''
    if param1 > param2: # interesting
        print 'Greater'
    return (param2 - param1 + 1) or None

class SomeClass:
    pass

>>> message = '''interpreter
... prompt'''
```

JavaScript 示例：

``` javascript
/**
* nth element in the fibonacci series.
* @param n >= 0
* @return the nth element, >= 0.
*/
function fib(n) {
  var a = 1, b = 1;
  var tmp;
  while (--n >= 0) {
    tmp = a;
    a += b;
    b = tmp;
  }
  return a;
}

document.write(fib(10));
```

### 9.  插入图像

使用 \!\[描述](图片链接地址) 插入图像。

示例：

![我的头像](https://avatars.githubusercontent.com/u/10740524?v=4) 


### 10. LaTeX 公式

$ 表示行内公式： 

质能守恒方程可以用一个很简洁的方程式 $E=mc^2$ 来表达。

表示整行公式：

$$\sum_{i=1}^n a_i=0$$

$$f(x_1,x_x,\ldots,x_n) = x_1^2 + x_2^2 + \cdots + x_n^2 $$

$$\sum^{j-1}_{k=0}{\widehat{\gamma}_{kj} z_k}$$

访问 [MathJax](http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference) 参考更多使用方法。





### 11. 流程图

#### 示例

```flow
st=>start: Start:>https://www.zybuluo.com
io=>inputoutput: verification
op=>operation: Your Operation
cond=>condition: Yes or No?
sub=>subroutine: Your Subroutine
e=>end

st->io->op->cond
cond(yes)->e
cond(no)->sub->io
```

#### 更多语法参考：[流程图语法参考](http://adrai.github.io/flowchart.js/)

### 12. 表格支持

| 项目        | 价格   |  数量  |
| --------   | -----:  | :----:  |
| 计算机     | \$1600 |   5     |
| 手机        |   \$12   |   12   |
| 管线        |    \$1    |  234  |

