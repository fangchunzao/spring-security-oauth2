package com.fcz.oauth.model.domain;

import java.io.Serializable;

/**
 * @author Mr.F
 * @since 2019/7/5 16:57
 **/

public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    public User(int user_id, String username, String password) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
    }

    private int user_id;

    private String username;

    private String password;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
