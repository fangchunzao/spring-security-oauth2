package com.fcz.oauth.wrapper;

import com.alibaba.fastjson.JSONObject;
import com.fcz.oauth.model.constant.ResponseConstant;
import lombok.Data;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.io.Serializable;

/**
 * description 包装类 返回结果进行统一封装
 * @author Mr.F
 * @since 2019/7/9
 **/
@Data
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class Wrapper<T> implements Serializable {

	private static final long serialVersionUID = 4893280118017319089L;
	// 编码
	private int code;

	// 信息
	private String message;

	// 数据
	private T result;


	Wrapper(int code, String message) {
		this(code, message, null);
	}

	Wrapper(int code, String message, T result) {
		super();
		this.code(code).message(message).result(result);
	}

	/**
	 * 返回成功消息
	 * @return
	 */
	public static <E> Wrapper<E> success(E o) {
		return new Wrapper<>(ResponseConstant.SUCCESS_CODE, ResponseConstant.SUCCESS_MESSAGE, o);
	}

	/**
	 * 返回系统异常消息
	 * @return
	 */
	public static <E> Wrapper<E> error() {
		return new Wrapper<>(ResponseConstant.ERROR_CODE, ResponseConstant.ERROR_MESSAGE);
	}

	public static <E> Wrapper<E> info(int code, String message) {
		return new Wrapper<>(code, message);
	}

	public static <E> Wrapper<E> info(int code, String message, E result) {
		return new Wrapper<>(code, message, result);
	}

	private Wrapper<T> code(int code) {
		this.setCode(code);
		return this;
	}

	private Wrapper<T> message(String message) {
		this.setMessage(message);
		return this;
	}

	private Wrapper<T> result(T result) {
		this.setResult(result);
		return this;
	}

	public String toJsonString() {
		JSONObject json = new JSONObject();
		json.put("code", code);
		json.put("message", message);
		json.put("result", result);
		return json.toString();
	}
}
