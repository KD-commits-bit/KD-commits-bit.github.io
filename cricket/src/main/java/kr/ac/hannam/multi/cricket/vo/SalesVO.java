package kr.ac.hannam.multi.cricket.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "saleNo")
public class SalesVO {
    private String saleNo;
    private String carId;
    private String adminNo;
    private String userNo;
    private String salePrice;
    private String saleDate;
}
