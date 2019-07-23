package com.fcz.oauth.controller.page;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

/**
 * @author Mr.F
 * @since 2019/7/11 10:40
 **/
@Controller
@RequestMapping("/page/test")
public class TestPageController {

    @RequestMapping("/test")
    public String test(@RequestParam("token") String token, Map<String, Object> map){
        map.put("token", token);
        return "test";
    }

}
