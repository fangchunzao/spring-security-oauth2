package com.fcz.oauth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.OAuthBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger.web.SecurityConfiguration;
import springfox.documentation.swagger.web.SecurityConfigurationBuilder;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Arrays;
import java.util.Collections;


/**
 * @ Api：修饰整个类，描述Controller的作用
 * @ ApiOperation：描述一个类的一个方法，或者说一个接口
 * @ ApiParam：单个参数描述
 *
 * @ ApiModel：用对象来接收参数
 * @ ApiProperty：用对象接收参数时，描述对象的一个字段
 *
 * @ ApiResponse：HTTP响应其中1个描述
 * @ ApiResponses：HTTP响应整体描述
 *
 * @ ApiIgnore：使用该注解忽略这个API
 * @ ApiError ：发生错误返回的信息
 *
 * @ ApiImplicitParam：一个请求参数
 * @ ApiImplicitParams：多个请求参数
 */
@Configuration
@EnableSwagger2
public class Swagger2Config {

    @Value("${authorization.uri}")
    private String authorizationUri;

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.fcz.oauth.controller.api"))
                .paths(PathSelectors.any())
                .build()
                .securitySchemes(Collections.singletonList(securityScheme()))
                .securityContexts(Collections.singletonList(securityContext()));
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("")
                .version("0.0.1")
                .build();
    }

    /**
     * 使用密码模式认证方式
     */
    private SecurityScheme securityScheme() {
        GrantType grantType = new ResourceOwnerPasswordCredentialsGrant(authorizationUri + "/oauth/token");

        return new OAuthBuilder()
                .name("oauth2")
                .grantTypes(Collections.singletonList(grantType))
                .scopes(Arrays.asList(scopes()))
                .build();
    }

    /**
     * swagger2 认证安全上下文
     */

    private SecurityContext securityContext() {
        return SecurityContext.builder()
                .securityReferences(Collections.singletonList(new SecurityReference("oauth2", scopes())))
                .forPaths(PathSelectors.any())
                .build();
    }

    /**
     * 允许认证的scope
     */
    private AuthorizationScope[] scopes() {
        return new AuthorizationScope[]{
                new AuthorizationScope("all", "All scope is trusted!")
        };
    }


    @Bean
    SecurityConfiguration security() {
        return SecurityConfigurationBuilder.builder()
                .clientId("client")
                .clientSecret("123456")
                .realm("*")
                .appName("")
                .scopeSeparator(",")
                .additionalQueryStringParams(null)
                .useBasicAuthenticationWithAccessCodeGrant(false)
                .build();
    }
}
