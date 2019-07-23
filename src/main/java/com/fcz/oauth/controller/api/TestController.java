package com.fcz.oauth.controller.api;

import com.fcz.oauth.utils.SecurityUtils;
import com.fcz.oauth.wrapper.Wrapper;
import io.swagger.annotations.Api;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Mr.F
 * @since 2019/7/8 15:51
 **/
@Api(value="/api/bus", tags="通用测试接口")
@RestController
@RequestMapping(value = "/api/test")
public class TestController {

    @Secured({"ROLE_SFE"})
    @GetMapping(value = "/test01", produces = "application/json")
    public Wrapper test01() {
        return Wrapper.success(SecurityUtils.getCurrentLoginName());
    }

    @Secured({"ROLE_BUS"})
    @GetMapping(value = "/test02", produces = "application/json")
    public Wrapper test02() {
        return Wrapper.success(SecurityUtils.getCurrentLoginName());
    }

    @Secured({"ROLE_BUS","ROLE_SFE"})
    @GetMapping(value = "/test03", produces = "application/json")
    public Wrapper test03() {
        return Wrapper.success(SecurityUtils.getCurrentLoginName());
    }
}
