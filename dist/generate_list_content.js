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
        /**
         *
         */
        this.currentTitle = null;
        this.tagList = new Array();
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
        }
        else {
            //贴在左边或者右边
            let dirction = location['data']['position'];
            this.container = $(`<div id="menuList"></div>`)
                .css(dirction, '-15.4em')
                .css('top', location['data']['top'])
                .css(`border-bottom-${dirction}-radius`, '0')
                .addClass('fixed');
            let titleNode = $('<div class="menu-list-title menu-fixed-title">目录</div>')
                .css(`border-top-${dirction}-radius`, 0)
                .css(`border-bottom-${dirction}-radius`, 0)
                .css(dirction == 'left' ? 'right' : 'left', '-1.7em')
                .click(() => {
                if (this.container.css(dirction).startsWith('0')) {
                    this.container.css(dirction, '-15.4em');
                }
                else {
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
    createDom() {
        this.list.forEach(item => {
            let str = '';
            for (let j = 1; j < item.level; j++) {
                str += '&emsp;';
            }
            item.node = $(`<div id="${item.titleId}" class="item">${str + item.label}</div>`);
            item.node.click(function (event) {
                location.href = '#' + item.nodeId;
            });
            if (item.level === 1) {
                item.node.css('font-weight', 700);
                item.node.css('color', '#555');
            }
            else {
                item.node.css('font-weight', 400);
                item.node.css('color', '#666');
            }
            this.container.append(item.node);
        });
        this.container.append('<div class="fork"><a target="_black" href="https://github.com/FleyX/generate_contents">GenerateContents</a></div>');
    }
    /**
     * 插入一个标题到标题信息列表中
     * @param node 待插入节点
     */
    addToList(node) {
        //id计算hash值作为id
        let id = Math.random().toString();
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
    checkLocation() {
        let scrollTop = $('body').scrollTop() || 0;
        for (let i = 0; i < this.list.length; i++) {
            if (scrollTop <= this.list[i].height) {
                if (this.list[i].node == this.currentTitle) {
                    break;
                }
                if (this.currentTitle != null)
                    this.currentTitle.removeClass('checked');
                this.currentTitle = this.list[i].node;
                this.currentTitle.addClass('checked');
                break;
            }
        }
    }
}
//# sourceMappingURL=generate_list_content.js.map