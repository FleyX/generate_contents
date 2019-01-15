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
   * @param {string} blogId  要生成目录的快id
   * @param {object} location  目录生成位置 type:fixed,blockId
   */
  constructor(blogId: string, location: object) {
    this.blogId = blogId;
    this.location = location;
    this.list = [];
    if (location['type'] == 'id') {
      //准备一个div放目录
      let item = $(`#${location['data']}`);
      if (item == null) {
        throw new Error(`此${location['value']}无法生成目录`);
      }
      this.container = item;
    } else {
      this.container = $(`<div id="menuList"></div>`);
      $('body').append(this.container);
    }
    this.container.addClass('list-content-main');
  }

  /**
   * 开始构建
   */
  public build(): void {
    let blogNode = document.getElementById(this.blogId);
    if (blogNode == null) {
      return;
    }
    let children = blogNode.children;
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
      this.container.append(item.node);
    });
  }

  tagList: Array<string> = new Array();
  /**
   * 插入一个标题到标题信息列表中
   * @param node 待插入节点
   */
  private addToList(node: HTMLElement): void {
    //id计算hash值作为id
    let id = Date.now().toString();
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
}
