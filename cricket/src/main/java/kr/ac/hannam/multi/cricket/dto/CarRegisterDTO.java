package kr.ac.hannam.multi.cricket.dto;

import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import lombok.Data;

import java.util.List;

@Data
public class CarRegisterDTO {
    private CarsVO car;
    private List<String> optionIds;
}
