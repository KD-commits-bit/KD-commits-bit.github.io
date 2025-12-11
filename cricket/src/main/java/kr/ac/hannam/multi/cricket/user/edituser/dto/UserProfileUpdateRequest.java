package kr.ac.hannam.multi.cricket.user.edituser.dto;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String userId;
    private String password; // New password, can be null
    private String email;    // New email
}
