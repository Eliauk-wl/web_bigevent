$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()
        // 初始化富文本编辑器
    initEditor()
        // 定义文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败!')
                }
                layer.msg('获取文章分类列表成功!')

                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 调用 form.render() 重新渲染
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面 添加点击事件
    $('#btnchoose').on('click', function() {
        $('#btn-file').click()
    })

    // 为 btn-file 绑定change事件
    $('#btn-file').on('change', function(e) {
        var file = e.target.files

        if (file.length === 0) {
            return layer.msg('请选择文件！')
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file[0])

        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    var art_state = '已发布'


    // 为 存为草稿 绑定点击事件
    $('#btnSave').on('click', function() {
        art_state = '草稿'
    })

    // 监听 form表单的  submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
            //基于form表单，创建一个FormData对象
        var fd = new FormData($(this)[0])
            //将文章的发布状态，存到fd中
        fd.append('state', art_state)
            // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 把图片地址添加到fd
                fd.append('cover_img', blob)
                    // 发起ajax请求
                publishAricle(fd)
            })


    })

    // 定义一个发布文章方法
    function publishAricle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // formData必须添加下面两个
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                    // 发布文章后，跳转到文章列表
                location.href = '/article/art_list.html'
            }
        })
    }


    // 编辑
    // 编辑按钮
    $('tbody').on('click', '#btnwrite', function() {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                    // 发布文章后，跳转到文章列表
                location.href = '/article/art_pub.html'
            }
        })

    })
})