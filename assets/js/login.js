$(function() {
    //点击注册账号的代码
    $('#link_reg').on('click', function() {
        // 点击了 去注册，登录的div隐藏，
        $('.loginbox').hide()
            //注册的div显示
        $('.regbox').show()
    })

    //点击登录账号的操作
    $('#link_login').on('click', function() {
        $('.loginbox').show()
        $('.regbox').hide()
    })

    // 从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer
        //通过 form.verify()函数自定义校验规则
    form.verify({
        //自定义了一个校验规则
        psw: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码输入一致
        repsw: function(value) {
            //通过形参拿到的确认密码框的内容，还要拿到密码框的内容
            // 进行一次判断
            // 判断失败，则return错误消息

            var psw = $('.regbox [name=password]').val()
            if (psw !== value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        //1.阻止表单的默认提交行为
        e.preventDefault()
            //2.ajax的post请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',
            // $('#form_reg [name=username]').val()====为input输入的值
            data,
            function(res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录')
                    //模拟人的点击行为
                $('#link_login').click()
            })

    })

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败')
                }
                layer.msg('登录成功')
                    // 将登陆成功得到的token值保存到 localStorage
                localStorage.setItem('token', res.token)
                    // console.log(res.token);
                    // 跳转到后台首页
                location.href = '/index.html'
            }
        })
    })
})