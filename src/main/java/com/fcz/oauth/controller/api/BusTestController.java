package com.fcz.oauth.controller.api;

import com.fcz.oauth.utils.SecurityUtils;
import com.fcz.oauth.wrapper.Wrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Mr.F
 * @since 2019/7/12 14:27
 **/
@Api(value="/api/bus", tags="商务角色测试接口")
@RestController
@RequestMapping(value = "/api/bus")
public class BusTestController {

    @ApiOperation(value = "测试接口1",notes = "商务角色")
    @Secured({"ROLE_BUS"})
    @GetMapping(value = "/test01", produces = "application/json")
    public Wrapper test01() {
        return Wrapper.success(SecurityUtils.getCurrentLoginName());
    }

}
