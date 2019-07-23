package com.fcz.oauth.config.security.encrypt;

import com.fcz.oauth.utils.EncryptUtiles;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 用户密码加密
 * @author Mr.F
 * @since 2019/7/5 15:41
 **/
@Component
public class SecurityPasswordEncoder implements PasswordEncoder {
    @Override
    public String encode(CharSequence charSequence) {
        return EncryptUtiles.MD5(charSequence.toString());
    }

    @Override
    public boolean matches(CharSequence charSequence, String s) {
        return s.equals(EncryptUtiles.MD5(charSequence.toString()));
    }
}
