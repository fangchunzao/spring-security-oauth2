package com.fcz.oauth.config.security;

import com.fcz.oauth.controller.api.TokenController;
import com.fcz.oauth.model.constant.ResponseConstant;
import com.fcz.oauth.wrapper.Wrapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 登录成功处理
 * @author Mr.F
 * @since 2019/7/8 09:19
 **/
@Component
public class AuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private static Logger logger = LogManager.getLogger(AuthenticationSuccessHandler.class.getName());
    @Autowired
    private TokenController tokenController;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
//        username = getURLEncoderString(username);

        Wrapper result = tokenController.loadToken(username,password);
        response.setStatus(HttpStatus.OK.value());
        response.setHeader("Content-Type", "application/json;charset=UTF-8");
        if (result == null) {
            response.getWriter().println(Wrapper.error().toJsonString());
            return;
        }
        if (result.getCode() != ResponseConstant.SUCCESS_CODE) {
            response.getWriter().println(Wrapper.error().toJsonString());
            return;
        }
        // 跳转到首页
        response.sendRedirect("/page/test/test?token=" + result.getResult());
    }
}
