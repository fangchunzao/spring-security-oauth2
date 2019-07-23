package com.fcz.oauth.controller.page;

import com.fcz.oauth.model.constant.ResponseConstant;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;


/**
 * Created by hp on 2018/3/14.
 */
@Controller
public class LoginPageController {

    @RequestMapping("/")
    public String rootFile() {
        return "login";
    }

    @RequestMapping("/loginFail")
    public String loginFail(Map<String, Object> map) {
        map.put("code",ResponseConstant.USER_LOGIN_ERROR_CODE);
        map.put("message",ResponseConstant.USER_LOGIN_ERROR_MESSAGE);
        return "login";
    }

}
