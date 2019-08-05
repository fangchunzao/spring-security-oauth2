package com.fcz.oauth.config.security;

import com.fcz.oauth.config.security.encrypt.SecurityPasswordEncoder;
import com.fcz.oauth.controller.api.TokenController;
import com.fcz.oauth.model.constant.ResponseConstant;
import com.fcz.oauth.utils.EncryptUtiles;
import com.fcz.oauth.wrapper.Wrapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.exceptions.UnapprovedClientAuthenticationException;
import org.springframework.security.oauth2.provider.*;
import org.springframework.security.oauth2.provider.token.AuthorizationServerTokenServices;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;

/**
 * 登录成功处理
 * @author Mr.F
 * @since 2019/7/8 09:19
 **/
@Component
public class AuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private static Logger logger = LogManager.getLogger(AuthenticationSuccessHandler.class.getName());

    @Value("${authorization.client-id}")
    private String clientId;

    @Value("${authorization.client-secret}")
    private String clientSecret;

    @Resource
    private ClientDetailsService clientDetailsService;

    @Resource
    private AuthorizationServerTokenServices systemTokenServices;

    @Resource
    private PasswordEncoder securityPasswordEncoder;

    @Resource
    private TokenController tokenController;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        ClientDetails clientDetails = clientDetailsService.loadClientByClientId(clientId);

        if (clientDetails == null) {
            throw new UnapprovedClientAuthenticationException("clientId 对应的客户端不存在:" + clientId);
        } else if (!securityPasswordEncoder.matches(clientSecret, clientDetails.getClientSecret())) {
            throw new UnapprovedClientAuthenticationException("clientSecret 错误:" + clientId);
        }
        TokenRequest tokenRequest = new TokenRequest(new HashMap<>(1), clientId, clientDetails.getScope(), "password");

        OAuth2Request oAuth2Request = tokenRequest.createOAuth2Request(clientDetails);

        OAuth2Authentication oAuth2Authentication = new OAuth2Authentication(oAuth2Request, authentication);

        OAuth2AccessToken token = systemTokenServices.createAccessToken(oAuth2Authentication);

        // 跳转到首页
        response.sendRedirect("/page/test/test?token=" + token.getValue());

/*        String username = request.getParameter("username");
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

        response.sendRedirect("/page/test/test?token=" + result.getResult());*/
    }
}
