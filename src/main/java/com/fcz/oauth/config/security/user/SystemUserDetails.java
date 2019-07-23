package com.fcz.oauth.config.security.user;

import com.fcz.oauth.model.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

/**
 * @author Mr.F
 * @since 2019/7/5 17:01
 **/
public class SystemUserDetails implements UserDetails{

    private User user;

    private Set<GrantedAuthority> authorityList;

    public SystemUserDetails(User user, Set<GrantedAuthority> authorityList) {
        this.user = user;
        this.authorityList = authorityList;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorityList;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    // 账号到期
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 账号锁定
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 账号启用
    @Override
    public boolean isEnabled() {
        return true;
    }
}
