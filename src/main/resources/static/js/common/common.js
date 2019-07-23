function tAjax(url, params, method) {
    // var tokenId = $("#fx").val();
    var tokenId = 'Bearer ' + window.localStorage.getItem('token');
    var successRequire; // 成功回调
    this.success = function (fn) {
        successRequire = fn;
    };
    $.ajax({
        type: method,
        contentType: "application/json; charset=utf-8",
        url: url,
        dataType: "json",
        async: true,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", tokenId);
        },
        data: JSON.stringify(params),
        success: function (result) {
            var code = result.code;
            if (code === 501) {
                window.location.href="/";
            }
            if (code === 502) {
                window.localStorage.setItem("token",result.result);
                tAjax(url,params);
            } else if(code === 511) {
                window.location.href="/";
            }
            // console.log(code);
            successRequire(result);
        },
        error: function (errorRes) {
            console.log('请求发生error' + errorRes.message);
            if (errorRes.readyState === 0) {
                console.log('请求地址初始化失败！请检查url是否正确');
            } else if (errorRes.readyState === 4) {
                if (errorRes.status === 404) {
                    console.log('404：找不到这个请求！')
                } else if (errorRes.status === 403) {
                    layer.msg('权限错误！');
                } else if (errorRes.status === 401) {
                    layer.msg('登录超时或账号已在其他地方登录');
                    // logout();
                }
            }
        }
    });
    return this;
}

