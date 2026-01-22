package kr.ac.hannam.multi.cricket.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "adminNo")
public class AdminVO {
    private String adminNo;
    private String adminEmail;
    private String adminPassword;
    private String adminName;
    private String adminPhone;
}
