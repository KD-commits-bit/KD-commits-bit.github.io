package kr.ac.hannam.multi.cricket.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "carImageId")
public class CarImagesVO {
    private String carImageId;
    private String carId;
    private String carImageContent;
    private String isPrimary;
}
