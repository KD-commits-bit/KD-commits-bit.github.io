package kr.ac.hannam.multi.cricket.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "brandId")
public class CarBrandsVO {
    private String brandId;
    private String brandName;
}
