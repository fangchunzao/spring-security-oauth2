package com.fcz.oauth.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.fcz.oauth.model.domain.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Mr.F
 * @since 2019/7/8 10:26
 **/
public interface UserMapper extends BaseMapper<User> {

    List<String> queryUserOwnedRoleCodes(@Param("userName") String userName);

}
