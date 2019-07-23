package com.fcz.oauth.utils;

import com.fcz.oauth.config.security.user.SystemUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;


/**
 *
 */
public final class SecurityUtils {

	/**
	 * 当前登录用户
	 * @return the current login name
	 */
	public static SystemUserDetails getCurrentLoginName() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		if (principal instanceof SystemUserDetails) {

			return ((SystemUserDetails) principal);

		}
		return null;

	}

}
