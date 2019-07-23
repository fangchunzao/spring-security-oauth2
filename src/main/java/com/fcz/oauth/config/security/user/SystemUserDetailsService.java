package com.fcz.oauth.config.security.user;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.fcz.oauth.mapper.UserMapper;
import com.fcz.oauth.model.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author Mr.F
 * @since 2019/7/5 16:59
 **/
// own system
@Service
public class SystemUserDetailsService implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        User user = userMapper.selectOne(new QueryWrapper<User>().eq("username",userName));
        if (user == null) {
            throw new BadCredentialsException("user: " + userName + " not found.");
        }
        List<String> roleCodeList = userMapper.queryUserOwnedRoleCodes(userName);

        Set<GrantedAuthority> authorities =
                roleCodeList.stream().map(e -> new SimpleGrantedAuthority(e)).collect(Collectors.toSet());

        return new SystemUserDetails(user,authorities);
    }
}
