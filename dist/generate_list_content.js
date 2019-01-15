"use strict";
/**
 * 使用原生js实现目录生成
 */
// import * as $ from 'jquery';
class CreateListContent {
    /**
     * @param {string} blogId  要生成目录的快id
     * @param {object} location  目录生成位置 type:fixed,blockId
     */
    constructor(blogId, location) {
        this.tagList = new Array();
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
        }
        else {
            this.container = $(`<div id="menuList"></div>`);
            $('body').append(this.container);
        }
        this.container.addClass('list-content-main');
    }
    /**
     * 开始构建
     */
    build() {
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
                this.addToList(children[i]);
            }
        }
        //构建dom
        this.createDom();
    }
    /**
     * 创建dom节点
     * @param list 标题列表
     */
    createDom() {
        this.list.forEach(item => {
            let str = '';
            for (let j = 1; j < item.level; j++) {
                str += '&emsp;';
            }
            item.node = $(`<div id="${item.titleId}" class="item">${str + item.label}</div>`);
            this.container.append(item.node);
        });
    }
    /**
     * 插入一个标题到标题信息列表中
     * @param node 待插入节点
     */
    addToList(node) {
        //id计算hash值作为id
        let id = Date.now().toString();
        node.setAttribute('id', id);
        let item = {
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
        }
        else {
            item.level = index + 1;
            this.tagList.splice(index + 1);
        }
        this.list.push(item);
    }
}
//# sourceMappingURL=generate_list_content.js.map