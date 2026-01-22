package kr.ac.hannam.multi.cricket.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "optionId")
public class CarOptionsVO {
    private String optionId;
    private String optionName;
    private String optionCategory;
}
