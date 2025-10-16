package kr.ac.hannam.multi.cricket.vo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserVO {
    private String userNo;
    private String userEmail;
    private String userPassword;
    private String userName;
    private String userNickname;
    private String userRegion;
    private String userProfileImg;
    private String userPhone;
    private String userCreatedAt;
}
