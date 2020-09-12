//每次在发起 任何 ajax请求时，都会先调用$.ajaxPrefilter()这个函数
$.ajaxPrefilter(function(options) {
    // 发起ajax时，统一拼接
    options.url = 'http://ajax.frontend.itheima.net' + options.url
        // console.log(options.url);


    //统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 全局挂载 complete函数
    options.complete = function(res) {
        // console.log('执行了complete函数');
        // console.log(res);
        // 在执行complete函数，直接拿到 res.responseJSON 从服务器响应回来的数值
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.清空内存 token
            localStorage.removeItem('token')
                // 2.强制返回登录页
            location.href = '/login.html'
        }
    }
})