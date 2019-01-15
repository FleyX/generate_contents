/**
 * 使用原生js实现目录生成
 */

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
}

const I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split(
  ''
);

class CreateListContent {
  blogId: string;
  location: object;
  list: Array<TitleItem>;
  nodeList: Array<HTMLElement>;
  //呈现目录的容器
  container: HTMLElement;

  /**
   * @param {string} blogId  要生成目录的快id
   * @param {object} location  目录生成位置 type:fixed,blockId
   */
  constructor(blogId: string, location: object) {
    this.blogId = blogId;
    this.location = location;
    this.list = [];
    this.nodeList = [];
    if (location['type'] == 'id') {
      //准备一个div放目录
      let item = document.getElementById(location['data']);
      if (item == null) {
        throw new Error(`此${location['value']}无法生成目录`);
      }
      this.container = item;
    } else {
      this.container = document.createElement('div');
      this.container.setAttribute('id','menuList');
    }
  }

  public build(): void {
    let blogNode = document.getElementById(this.blogId);
    if (blogNode == null) {
      return;
    }
    let children = blogNode.children;
    //标题列表
    let list = [];
    for (let i = 0; i < children.length; i++) {
      //非h标签不作处理
      if (/h\d/.test(children[i].nodeName)) {
        //强制类型转换
        this.addToList(list, children[i] as HTMLElement);
      }
    }
    //构建dom
    this.createDom(list);
  }

  private createDom(list: Array<TitleItem>): void {
    let str = '';
    let container = document.createElement("<div id='idContainer'></div>");
    for (let i = 0; i < list.length; i++) {
      str += `<div id="${list[i].titleId}">${list[i].label}</div>`;
      let node = document.createElement(str);
      container.appendChild(node);
      this.nodeList.push(node);
    }
  }

  tagList: Array<string> = new Array();
  private addToList(list: Array<TitleItem>, node: HTMLElement): void {
    //id计算hash值作为id
    let id = this.hash(node.textContent || '');
    node.setAttribute('id', id);
    let item: TitleItem = {
      label: node.textContent || '',
      nodeId: id,
      titleId: 'title_' + id,
      tag: node.tagName,
      level: 0,
      height: node.offsetTop
    };
    let index = this.tagList.indexOf(item.tag);
    if (index == -1) {
      this.tagList.push(item.tag);
    } else {
      item.level = index;
      this.tagList.slice(index);
    }
    list.push(item);
  }

  private hash(input: string): string {
    var hash = 5381;
    var i = input.length - 1;
    if (typeof input == 'string') {
      for (; i > -1; i--) hash += (hash << 5) + input.charCodeAt(i);
    } else {
      for (; i > -1; i--) hash += (hash << 5) + input[i];
    }
    var value = hash & 0x7fffffff;
    var retValue = '';
    do {
      retValue += I64BIT_TABLE[value & 0x3f];
    } while ((value >>= 6));
    return retValue;
  }
}
