package com.fcz.oauth.config.security.exception;

import com.fcz.oauth.controller.api.TokenController;
import com.fcz.oauth.model.constant.ResponseConstant;
import com.fcz.oauth.wrapper.Wrapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 自定义认证异常处理
 * @author Mr.F
 * @since 2019/7/10 10:00
 **/
@Component
public class SystemAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static Logger logger = LogManager.getLogger(SystemAuthenticationEntryPoint.class.getName());

    @Autowired
    private TokenStore jdbcTokenStore;

    @Autowired
    private TokenController tokenController;

    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse response,
                         AuthenticationException authException) {

        Throwable cause = authException.getCause();
        response.setStatus(HttpStatus.OK.value());
        response.setHeader("Content-Type", "application/json;charset=UTF-8");
        try {
            if(cause instanceof InvalidTokenException) {
                // TOKEN 验证失败异常
                tokenThrowableHandle(cause,response);
            }else{
                logger.info("TOKEN 解析失败 请求头无TOKEN");
                response.getWriter().println(Wrapper.error().toJsonString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    /**
     * description 对异常类型进行判断 进行不同的处理
     * @param cause 异常
     * @author Mr.F
     * @since 2019/7/10
     **/
    private static final  String  TOKEN_EXPIRED = "Access token expired"; // token 过期
    private static final  String  TOKEN_INVALID = "Invalid access token"; // token 无效

    private void tokenThrowableHandle(Throwable cause, HttpServletResponse response) throws IOException {
        String errorMessage = cause.getMessage();
        if (errorMessage.contains(TOKEN_INVALID)) {
            response.getWriter().println(
                    Wrapper.info(ResponseConstant.TOKEN_INVALID_CODE, ResponseConstant.TOKEN_INVALID_MESSAGE).toJsonString());
        } else if (errorMessage.contains(TOKEN_EXPIRED)) {
            // token 过期 刷新token
            String token = errorMessage.substring(errorMessage.indexOf(":") + 2);
            Wrapper wrapper = tokenController.refreshToken(token);
            // 判断刷新token是否成功
            if (wrapper.getCode() != ResponseConstant.TOKEN_EXPIRED_CODE) {
                response.getWriter().println(Wrapper.error().toJsonString());
                return;
            }
            response.getWriter().println(wrapper.toJsonString());
        } else {
            // 没有token 需要登录
            response.getWriter().println(
                    Wrapper.info(ResponseConstant.USER_LOGIN_EXPIRED_CODE, ResponseConstant.USER_LOGIN_EXPIRED_MESSAGE).toJsonString()
            );
        }
    }
}
