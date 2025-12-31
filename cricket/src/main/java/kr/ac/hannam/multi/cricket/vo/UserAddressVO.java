package kr.ac.hannam.multi.cricket.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "addressId")
public class UserAddressVO {
    private Integer addressId;
    private String userNo;
    private String zipcode;
    private String sido;
    private String sigungu;
    private String eupmyundong;
    private String roadName;
    private String addressLine1;
    private String addressLine2;
    private Integer isDefault;
    private String createdAt;
}
