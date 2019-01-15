"use strict";
/**
 * 使用原生js实现目录生成
 */
const I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
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
        this.nodeList = [];
        if (location['type'] == 'id') {
            //准备一个div放目录
            let item = document.getElementById(location['data']);
            if (item == null) {
                throw new Error(`此${location['value']}无法生成目录`);
            }
            this.container = item;
        }
        else {
            this.container = document.createElement('div');
            this.container.setAttribute('id', 'menuList');
        }
    }
    build() {
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
                this.addToList(list, children[i]);
            }
        }
        //构建dom
        this.createDom(list);
    }
    createDom(list) {
        let str = '';
        let container = document.createElement("<div id='idContainer'></div>");
        for (let i = 0; i < list.length; i++) {
            str += `<div id="${list[i].titleId}">${list[i].label}</div>`;
            let node = document.createElement(str);
            container.appendChild(node);
            this.nodeList.push(node);
        }
    }
    addToList(list, node) {
        //id计算hash值作为id
        let id = this.hash(node.textContent || '');
        node.setAttribute('id', id);
        let item = {
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
        }
        else {
            item.level = index;
            this.tagList.slice(index);
        }
        list.push(item);
    }
    hash(input) {
        var hash = 5381;
        var i = input.length - 1;
        if (typeof input == 'string') {
            for (; i > -1; i--)
                hash += (hash << 5) + input.charCodeAt(i);
        }
        else {
            for (; i > -1; i--)
                hash += (hash << 5) + input[i];
        }
        var value = hash & 0x7fffffff;
        var retValue = '';
        do {
            retValue += I64BIT_TABLE[value & 0x3f];
        } while ((value >>= 6));
        return retValue;
    }
}
