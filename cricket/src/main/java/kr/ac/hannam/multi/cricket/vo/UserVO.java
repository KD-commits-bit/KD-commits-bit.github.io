package kr.ac.hannam.multi.cricket.vo;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserVO {
    private String userNo;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String userEmail;

    @NotBlank(message = "Password is required")
    @Size(min = 4, max = 20, message = "Password must be between 4 and 20 characters")
    private String userPassword;

    @NotBlank(message = "Name is required")
    private String userName;

    private String userRegion;
    private byte[] userProfileImg;
    private String userPhone;
    private String userCreatedAt;
}
