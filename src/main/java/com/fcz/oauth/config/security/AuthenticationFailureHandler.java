package com.fcz.oauth.config.security;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 登录失败处理
 * @author Mr.F
 * @since 2019/7/8 09:27
 **/
@Component
public class AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static Logger logger = LogManager.getLogger(AuthenticationSuccessHandler.class);

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {
        // 跳转到登录失败处理
        response.sendRedirect("/loginFail");
    }
}
