/**
 * 使用原生js实现目录生成
 */
// import * as $ from 'jquery';

interface TitleItem {
  //标题内容
  label: string;
  //标题节点id
  nodeId: string;
  //目录上标题节点id
  titleId: string;
  //h几
  tag: string;
  //第几级目录
  level: number;
  //距离顶部多长
  height: number;
  node: JQuery<HTMLElement> | null;
}

class CreateListContent {
  /**
   * 正文id
   */
  blogId: string;
  /**
   * 位置参数
   */
  location: object;
  /**
   * 标题列表
   */
  list: Array<TitleItem>;
  /**
   * 呈现目录的容器
   */
  container: JQuery<HTMLElement>;

  /**
   *
   */
  currentTitle: JQuery<HTMLElement> | null = null;

  /**
   * @param {string} blogId  要生成目录的快id
   * @param {object} location  目录生成位置 type:fixed,blockId
   */
  constructor(blogId: string, location: object) {
    //判断目标是否存在
    if (document.getElementById(blogId) == null) {
      throw new Error('目标不存在');
    }
    window['createListContent'] = this;
    this.blogId = blogId;
    this.location = location;
    this.list = [];
    if (location['type'] == 'id') {
      //放在一个div中
      let item = $(`#${location['data']}`);
      if (item == null) {
        throw new Error(`此${location['value']}无法生成目录`);
      }
      this.container = item;
    } else {
      //贴在左边或者右边
      let dirction: string = location['data']['position'];
      this.container = $(`<div id="menuList"></div>`)
        .css(dirction, '-15.4em')
        .css('top', location['data']['top'])
        .css(`border-bottom-${dirction}-radius`, '0')
        .addClass('fixed');

      let titleNode = $(
        '<div class="menu-list-title menu-fixed-title">目录</div>'
      )
        .css(`border-top-${dirction}-radius`, 0)
        .css(`border-bottom-${dirction}-radius`, 0)
        .css(dirction == 'left' ? 'right' : 'left', '-1.7em')
        .click(() => {
          if (this.container.css(dirction) == '0px') {
            this.container.css(dirction, '-15.4em');
          } else {
            this.container.css(dirction, '0');
          }
        });
      $('body').append(this.container.append(titleNode));
    }
    this.container.addClass('list-content-main');
  }

  /**
   * 开始构建
   */
  public build(): void {
    let blogNode = $('#' + this.blogId);
    let children = blogNode.children();
    //标题列表
    for (let i = 0; i < children.length; i++) {
      //非h标签不作处理
      if (/[hH]\d/.test(children[i].nodeName)) {
        //强制类型转换
        this.addToList(children[i] as HTMLElement);
      }
    }
    //构建dom
    this.createDom();
    //定时器计算页面当前位置
    let that = this;
    setInterval(() => {
      that.checkLocation();
    }, 50);
  }

  /**
   * 创建dom节点
   * @param list 标题列表
   */
  private createDom(): void {
    this.list.forEach(item => {
      let str = '';
      for (let j = 1; j < item.level; j++) {
        str += '&emsp;';
      }
      item.node = $(
        `<div id="${item.titleId}" class="item">${str + item.label}</div>`
      );
      item.node.click(function(event) {
        location.href = '#' + item.nodeId;
      });
      if (item.level === 1) {
        item.node.css('font-weight', 700);
        item.node.css('color', '#555');
      } else {
        item.node.css('font-weight', 400);
        item.node.css('color', '#666');
      }
      this.container.append(item.node);
    });
    this.container.append(
      '<div class="fork"><a target="_black" href="https://github.com/FleyX/generate_contents">了解更多</a></div>'
    );
  }

  tagList: Array<string> = new Array();
  /**
   * 插入一个标题到标题信息列表中
   * @param node 待插入节点
   */
  private addToList(node: HTMLElement): void {
    //id计算hash值作为id
    let id = Math.random().toString();
    node.setAttribute('id', id);
    let item: TitleItem = {
      label: node.textContent || '',
      nodeId: id,
      titleId: 'title_' + id,
      tag: node.tagName,
      level: 0,
      height: node.offsetTop,
      node: null
    };
    let index = this.tagList.indexOf(item.tag);
    if (index == -1) {
      item.level = this.tagList.length + 1;
      this.tagList.push(item.tag);
    } else {
      item.level = index + 1;
      this.tagList.splice(index + 1);
    }
    this.list.push(item);
  }

  /**
   * 计算当前页面处于什么位置
   */
  private checkLocation(): void {
    let scrollTop = $(document).scrollTop() || 0;
    for (let i = 0; i < this.list.length; i++) {
      if (scrollTop <= this.list[i].height) {
        if (this.list[i].node == this.currentTitle) {
          break;
        }
        if (this.currentTitle != null)
          (this.currentTitle as JQuery<HTMLElement>).removeClass('checked');
        this.currentTitle = this.list[i].node;
        (this.currentTitle as JQuery<HTMLElement>).addClass('checked');
        break;
      }
    }
  }
}
