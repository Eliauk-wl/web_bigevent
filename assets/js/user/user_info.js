$(function() {
    var form = layui.form
    var layer = layui.layer
        // 创建自己的验证规则
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '用户昵称必须是1-6个字符长度！'
            }
        }
    })

    //  获取用户信息
    initUser_info()

    function initUser_info() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                form.val('formUserInfo', res.data)
            }
        })
    }


    // 重置功能的实现
    $('#btnReset').on('click', function(e) {
        // 阻止默认重置行为
        e.preventDefault()
        initUser_info()
            // console.log(111);

    })

    //提交更改信息
    $('.layui-form').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault()
            // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            //快速拿到表单内容
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功')
                    // 调用父页面的方法渲染

                window.parent.getUserInfo()

            }
        })
    })
})