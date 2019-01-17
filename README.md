本仓库，用来自动给博客生成目录，无需手动做任何配置。但是标题标签需要遵循如下的要求：

- 同级标题不能混用 h 标签，否则会导致目录层级出错。
- 下级标题只需比上级标题 h 号大即可。比如 h2 的下级标题只能为 h3 及以上。

想要查看效果可下载本仓库后,浏览器打开 `test/demo.html`

# 如何引入

&emsp;&emsp;注意需要有 jquery 环境。。。。。

1. 下载两个依赖文件,引入到页面中。`generate_list_content.css(src目录下),generate_list.content.js(dist目录下)`

# 如何使用

&emsp;&emsp;目前支持两种使用方法。

- 指定 div 存放

  使用如下 js 代码生成目录：

  ```javascript
  new CreateListContent('博文id', {
    type: 'id',
    data: '指定div的id'
  }).build();
  ```

  目录将会在指定 div 中生成。

- 贴边存放

  目录贴在浏览器窗口左边或者右边，点击展开，再次点击收起。js 代码如下：

  ```javascript
  new CreateListContent('博文id', {
    type: 'fixed',
    data: {
      position: 'left', //left，right可选,
      top: '20%' //距离窗口顶部距离,支持百分比，px,em,rem
    }
  }).build();
  ```
