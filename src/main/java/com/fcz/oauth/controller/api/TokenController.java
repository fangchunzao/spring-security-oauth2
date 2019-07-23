package com.fcz.oauth.controller.api;

import com.alibaba.fastjson.JSONObject;
import com.fcz.oauth.config.security.exception.SystemAuthenticationEntryPoint;
import com.fcz.oauth.model.constant.ResponseConstant;
import com.fcz.oauth.wrapper.Wrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2RefreshToken;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

/**
 * @author Mr.F
 * @since 2019/7/8 14:36
 **/
@Api(value="/api/bus", tags="TOKEN接口")
@RestController
@RequestMapping(value = "/api/token")
public class TokenController {

    private static Logger logger = LogManager.getLogger(SystemAuthenticationEntryPoint.class);

    @Value("${authorization.uri}")
    private String authorizationUri;

    @Value("${authorization.client-id}")
    private String clientId;

    @Value("${authorization.client-secret}")
    private String clientSecret;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private TokenStore jdbcTokenStore;


    /**
     * description 根据用户名与密码获取用户的token
     * @author Mr.F
     * @since 2019/7/9
     **/
    @ApiImplicitParams({
            @ApiImplicitParam(name = "username", value = "用户名", required = true, dataType = "String", defaultValue = ""),
            @ApiImplicitParam(name = "password", value = "密码", required = true, dataType = "String", defaultValue = "")
    })
    @GetMapping(value = "/loadToken/{username}/{password}", produces = "application/json")
    public Wrapper loadToken(@PathVariable("username") String username, @PathVariable("password") String password) {
        String url = authorizationUri + "/oauth/token?grant_type=password&username=" + username + "&password="
                + password + "&client_id=" + clientId + "&client_secret=" + clientSecret;
        try {
            String token = requestToken(url);
            return Wrapper.success(token);
        } catch (Exception e) {
            logger.error("申请Token失败 ", e);
            return Wrapper.error();
        }
    }

    /**
     * description 通过refreshToken刷新新的token
     * @param token 刷新token
     * @author Mr.F
     * @since 2019/7/9
     **/
    @ApiImplicitParam(name = "token", value = "刷新TOKEN", required = true, dataType = "String", defaultValue = "")
    @GetMapping(value = "/refreshToken/{token}", produces = "application/json")
    public Wrapper refreshToken(@PathVariable("token") String token) {
        // 获取token信息
        OAuth2AccessToken oAuth2AccessToken = jdbcTokenStore.readAccessToken(token);
        OAuth2RefreshToken oAuth2RefreshToken = oAuth2AccessToken.getRefreshToken();
        String refreshToken = oAuth2RefreshToken.getValue();
        String url = authorizationUri + "/oauth/token?grant_type=refresh_token&refresh_token=" + refreshToken
                + "&client_id=" + clientId + "&client_secret=" + clientSecret;
        try {
            String newToken = requestToken(url);
            return Wrapper.info(ResponseConstant.TOKEN_EXPIRED_CODE, ResponseConstant.TOKEN_EXPIRED_MESSAGE, newToken);
        } catch (Exception e) {
            logger.debug("access_token 和 refresh_token 都失效,需要重新登录  access_token:[{}], refresh_token: [{}]", token, refreshToken);
            return Wrapper.info(ResponseConstant.USER_LOGIN_EXPIRED_CODE, ResponseConstant.USER_LOGIN_EXPIRED_MESSAGE);
        }
    }

    /**
     * description  请求url获取token
     * @param url
     * @author Mr.F
     * @since 2019/7/9
     **/
    private String requestToken(String url) {
        String token;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        HttpEntity<String> entity = new HttpEntity<>("", headers);
        ResponseEntity<String> response = null;
        response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        JSONObject tokenJson = JSONObject.parseObject(response.getBody());
        token = tokenJson.getString("access_token");
        return token;
    }

}
