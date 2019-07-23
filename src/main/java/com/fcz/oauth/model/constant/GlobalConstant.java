package com.fcz.oauth.model.constant;

/**
 * 全局常量
 */
public class GlobalConstant {

	public static final long FILE_MAX_SIZE = 5 * 1024 * 1024;

	public static final String DEV_PROFILE = "dev";
	public static final String TEST_PROFILE = "test";
	public static final String PRO_PROFILE = "pro";

	public interface Number {
		int THOUSAND_INT = 1000;
		int HUNDRED_INT = 100;
		int ONE_INT = 1;
		int TWO_INT = 2;
		int THREE_INT = 3;
		int FOUR_INT = 4;
		int FIVE_INT = 5;
		int SIX_INT = 6;
		int SEVEN_INT = 7;
		int EIGHT_INT = 8;
		int NINE_INT = 9;
		int TEN_INT = 10;
	}

	/**
	 * 符号常量
	 */
	public static final class Symbol {
		private Symbol() {
		}

		public static final String COMMA = ",";

		public static final String SPOT = ".";

		public final static String UNDER_LINE = "_";

		public final static String PER_CENT = "%";

		public final static String AT = "@";

		public final static String PIPE = "||";

		public final static String SHORT_LINE = "-";

		public final static String SPACE = " ";

		public final static  String SLASH = "/";

		public final static  String MH = ":";
	}

	/**
	 * 用户角色
	 */
	public static final class UserRole {

		// SFE
		public final static String USER_ROLE_SFE = "SFE";

		// 商务
		public final static String USER_ROLE_BUSINESS = "BUS";

		// 销售
		public final static String USER_ROLE_SALE = "SALE";

	}
}
