package kr.ac.hannam.multi.cricket.car.carDetailView.service;

import kr.ac.hannam.multi.cricket.vo.CarsVO;

import java.util.List;
import java.util.Map;

public interface CarDetailViewService {
    public CarsVO readCarById(String carId);
    public List<Map<String, Object>> getOptionListByCarId(String carId);
}
