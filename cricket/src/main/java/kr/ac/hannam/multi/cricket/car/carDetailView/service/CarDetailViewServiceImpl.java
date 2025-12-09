package kr.ac.hannam.multi.cricket.car.carDetailView.service;

import kr.ac.hannam.multi.cricket.common.mapper.CarsMapper;
import kr.ac.hannam.multi.cricket.mapper.CarOptionMapMapper;
import kr.ac.hannam.multi.cricket.mapper.CarOptionsMapper;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class CarDetailViewServiceImpl implements CarDetailViewService {
    private final CarsMapper carsMapper;
    private final CarOptionMapMapper carOptionMapMapper;

    @Override
    public CarsVO readCarById(String carId) {
        return carsMapper.selectCarById(carId);
    }

    @Override
    public List<Map<String, Object>> getOptionListByCarId(String carId) {
           return carOptionMapMapper.selectOptionListById(carId);
    }
}
