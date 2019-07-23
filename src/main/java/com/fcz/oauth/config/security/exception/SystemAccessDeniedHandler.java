package com.fcz.oauth.config.security.exception;

import com.fcz.oauth.model.constant.ResponseConstant;
import com.fcz.oauth.wrapper.Wrapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 权限异常类
 * @author Mr.F
 * @since 2019/7/10 10:07
 **/
@Component
public class SystemAccessDeniedHandler implements AccessDeniedHandler {

    private static Logger logger = LogManager.getLogger(SystemAccessDeniedHandler.class.getName());

    @Override
    public void handle(HttpServletRequest httpServletRequest, HttpServletResponse response,
                       AccessDeniedException ae){
        logger.info("用户访问 权限异常", ae);
        response.setStatus(HttpStatus.OK.value());
        response.setHeader("Content-Type", "application/json;charset=UTF-8");
        try {
            // 用户无权限异常
            response.getWriter().println(
                    Wrapper.info(ResponseConstant.USER_NO_ACCESS_CODE,ResponseConstant.USER_NO_ACCESS_MESSAGE).toJsonString()
            );
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
