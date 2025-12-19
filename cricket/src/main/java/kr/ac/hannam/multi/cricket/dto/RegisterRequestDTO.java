package kr.ac.hannam.multi.cricket.dto;

import lombok.Data;

@Data
public class RegisterRequestDTO {
    // UserVO 관련 필드
    private String userEmail;
    private String userPassword;
    private String userName;
    private String userNickname;
    private String userPhone;

    // UserAddressVO 관련 필드
    private String zipcode;
    private String sido;
    private String sigungu;
    private String eupmyundong;
    private String roadName;
    private String addressLine1;
    private String addressLine2;
    private Integer isDefault;
}
