package kr.ac.hannam.multi.cricket.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "modelId")
public class CarModelsVO {
    private String modelId;
    private String brandId;
    private String modelName;
}
