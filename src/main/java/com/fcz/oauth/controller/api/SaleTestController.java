package com.fcz.oauth.controller.api;

import com.fcz.oauth.utils.SecurityUtils;
import com.fcz.oauth.wrapper.Wrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Mr.F
 * @since 2019/7/12 14:27
 **/
@Api(value="/api/bus", tags="销售角色测试接口")
@RestController
@RequestMapping(value = "/api/sale")
public class SaleTestController {

    @ApiOperation(value = "测试接口1",notes = "销售角色")
    @GetMapping(value = "/test01", produces = "application/json")
    public Wrapper test01() {
        return Wrapper.success(SecurityUtils.getCurrentLoginName());
    }

}
