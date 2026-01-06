package kr.ac.hannam.multi.cricket.user.edituser.dto;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String userId;
    private String password; // New password, can be null
    private String email;    // New email

    private String userNo;
    private String zipcode;
    private String sido;
    private String sigungu;
    private String eupmyundong;
    private String roadName;
    private String addressLine1;
    private String addressLine2;
}
