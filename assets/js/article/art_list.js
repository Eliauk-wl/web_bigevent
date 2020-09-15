$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 自定义一个时间过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = zeroAdd(dt.getFullYear())
            var m = zeroAdd(dt.getMonth() + 1)
            var d = zeroAdd(dt.getDate())
            var s = zeroAdd(dt.getHours())
            var mm = zeroAdd(dt.getMinutes())
            var ss = zeroAdd(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + s + ':' + mm + ':' + ss
        }
        //补0
    function zeroAdd(n) {
        return n > 9 ? n : '0' + n
    }
    //定义一个 q对象，以后请求数据，将该对象提交到服务器
    var q = {
        pagenum: 1, //默认页码 第一页
        pagesize: 3, //默认每一页 显示多少数据
        cate_id: '', //文章分类
        state: '' //文章的状态
    }


    initTable()
    initCate()


    // 获取文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                layer.msg('获取文章列表成功！')
                    // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 渲染分页
                renderPage(res.total)
            }
        })
    }


    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                // layer.msg('获取文章列表成功!')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 通知layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    // 为 筛选按钮 绑定submit事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                // 获取表单中选中项的值
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                // 为查询参数对象 q 中对应的属性赋值
            q.cate_id = cate_id
            q.state = state
                // 根据最新的筛选条件，重新渲染表格的数据
            initTable()
        })
        // 实现分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器
            count: total,
            limit: q.pagesize, //每页显示的数量
            curr: q.pagenum, // 默认页码
            layout: ['count', 'limit', 'prev', 'page', 'skip', 'next'],
            limits: [2, 3, 5, 10],
            // jump函数执行
            // 1.点击页码
            // 2.调用laypage.render()函数 ！！！
            jump: function(obj, first) {
                // 把最新的页码值赋值给 对象参数
                // console.log(first);
                q.pagenum = obj.curr
                    //把最新的条目数，赋值给 参数对象，之后再调用
                q.pagesize = obj.limit
                    // 如果first  为true，则是第二种方式触发jump
                    // 否则就是第一种方式，所以要first为undefine时触发
                if (!first) {
                    initTable()

                }
            }
        })
    }

    // 为 删除按钮 绑定 点击事件处理函数
    // 事件代理
    $('tbody').on('click', '.btn-delate', function() {
        // 自定义id
        var id = $(this).attr('data-id')
        console.log(id);
        // 获取 页面的 删除按钮个数
        var len = $('.btn-delate').length
            // console.log(len);
            // 点击之后弹出确认框
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!')
                    if (len === 1) {
                        //页码值 -1再调用
                        // 先判断页码值是否=1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })


})