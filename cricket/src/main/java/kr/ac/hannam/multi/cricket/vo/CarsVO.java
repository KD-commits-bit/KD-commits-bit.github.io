package kr.ac.hannam.multi.cricket.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "carId")
public class CarsVO {
    private String carId;
    private String modelId;
    private String adminNo;
    private String carYear;
    private String carMileage;
    private String carPrice;
    private String carDescription;
    private String carStatus;
    private String carCreatedAt;
}
