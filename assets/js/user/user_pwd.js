$(function() {
    var form = layui.form
        // var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样'
            }
        },
        samePwd1: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '请输入两次一致的密码'
            }
        }
    })

    // 更改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                // 重置表单

                $('.layui-form')[0].reset()
                return layui.layer.msg('更新密码成功！')
            }
        })
    })
})