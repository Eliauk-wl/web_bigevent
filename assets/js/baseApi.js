//每次在发起 请求时，都会先调用$.ajaxPrefilter()这个函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);
})