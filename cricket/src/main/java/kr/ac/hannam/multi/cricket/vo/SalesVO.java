package kr.ac.hannam.multi.cricket.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "saleNo")
public class SalesVO {
    @JsonProperty("imp_uid")
    private String impUid;

    @JsonProperty("merchant_uid")
    private String merchantUid;

    private String saleNo;
    private String carId;
    private String adminNo;
    private String userNo;
    private String salePrice;
    private String saleDate;
    private String zipcode;
    private String addressLine1;
    private String addressLine2;
    private String recipientName;
    private String recipientPhone;
}
