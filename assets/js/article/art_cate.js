$(function() {
    var layer = layui.layer
    var form = layui.form
    initArticleList()
        // 获取文章列表
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    // 为添加类别添加弹出层
    var index = null
    $('#btnAddCate').on('click', function() {
        index = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#add').html()
        });
    })

    // 新增分类，使用事件代理，因为弹出层是通过js拼接
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                // 重新刷新列表
                initArticleList()
                layer.close(index)
                layer.msg('新增文章分类成功!')
                    //新增之后关闭弹出层
            }
        })
    })


    // 点击 编辑 弹出弹出层
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#edit').html()
        })
        var id = $(this).attr('data-id')
            // console.log(id);
        $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    // console.log(res);
                    form.val('form-edit', res.data)
                }
            })
            // 
        $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类信息失败！')
                    }
                    layer.msg('更新分类信息成功！')
                    layer.close(indexEdit)
                    initArticleList()

                }
            })
        })
    })

    //点击删除
    $('tbody').on('click', '#btndelate', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功!')
                    layer.close(index);
                    initArticleList()
                }
            })
        })

    })
})