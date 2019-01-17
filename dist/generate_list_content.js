"use strict";
/**
 * 使用原生js实现目录生成
 */
// import * as $ from 'jquery';
var CreateListContent = /** @class */ (function () {
    /**
     * @param {string} blogId  要生成目录的快id
     * @param {object} location  目录生成位置 type:fixed,blockId
     */
    function CreateListContent(blogId, location) {
        var _this = this;
        /**
         *
         */
        this.currentTitle = null;
        this.tagList = new Array();
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
            var item = $("#" + location['data']);
            if (item == null) {
                throw new Error("\u6B64" + location['value'] + "\u65E0\u6CD5\u751F\u6210\u76EE\u5F55");
            }
            this.container = item;
        }
        else {
            //贴在左边或者右边
            var dirction_1 = location['data']['position'];
            this.container = $("<div id=\"menuList\"></div>")
                .css(dirction_1, '-15.4em')
                .css('top', location['data']['top'])
                .css("border-bottom-" + dirction_1 + "-radius", '0')
                .addClass('fixed');
            var titleNode = $('<div class="menu-list-title menu-fixed-title">目录</div>')
                .css("border-top-" + dirction_1 + "-radius", 0)
                .css("border-bottom-" + dirction_1 + "-radius", 0)
                .css(dirction_1 == 'left' ? 'right' : 'left', '-1.7em')
                .click(function () {
                if (_this.container.css(dirction_1) == '0px') {
                    _this.container.css(dirction_1, '-15.4em');
                }
                else {
                    _this.container.css(dirction_1, '0');
                }
            });
            $('body').append(this.container.append(titleNode));
        }
        this.container.addClass('list-content-main');
    }
    /**
     * 开始构建
     */
    CreateListContent.prototype.build = function () {
        var blogNode = $('#' + this.blogId);
        var children = blogNode.children();
        //标题列表
        for (var i = 0; i < children.length; i++) {
            //非h标签不作处理
            if (/[hH]\d/.test(children[i].nodeName)) {
                //强制类型转换
                this.addToList(children[i]);
            }
        }
        //构建dom
        this.createDom();
        //定时器计算页面当前位置
        var that = this;
        setInterval(function () {
            that.checkLocation();
        }, 50);
    };
    /**
     * 创建dom节点
     * @param list 标题列表
     */
    CreateListContent.prototype.createDom = function () {
        var _this = this;
        this.list.forEach(function (item) {
            var str = '';
            for (var j = 1; j < item.level; j++) {
                str += '&emsp;';
            }
            item.node = $("<div id=\"" + item.titleId + "\" class=\"item\">" + (str + item.label) + "</div>");
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
            _this.container.append(item.node);
        });
        this.container.append('<div class="fork"><a target="_black" href="https://github.com/FleyX/generate_contents">了解更多</a></div>');
    };
    /**
     * 插入一个标题到标题信息列表中
     * @param node 待插入节点
     */
    CreateListContent.prototype.addToList = function (node) {
        //id计算hash值作为id
        var id = Math.random().toString();
        node.setAttribute('id', id);
        var item = {
            label: node.textContent || '',
            nodeId: id,
            titleId: 'title_' + id,
            tag: node.tagName,
            level: 0,
            height: node.offsetTop,
            node: null
        };
        var index = this.tagList.indexOf(item.tag);
        if (index == -1) {
            item.level = this.tagList.length + 1;
            this.tagList.push(item.tag);
        }
        else {
            item.level = index + 1;
            this.tagList.splice(index + 1);
        }
        this.list.push(item);
    };
    /**
     * 计算当前页面处于什么位置
     */
    CreateListContent.prototype.checkLocation = function () {
        var scrollTop = $(document).scrollTop() || 0;
        for (var i = 0; i < this.list.length; i++) {
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
    };
    return CreateListContent;
}());
//# sourceMappingURL=generate_list_content.js.map