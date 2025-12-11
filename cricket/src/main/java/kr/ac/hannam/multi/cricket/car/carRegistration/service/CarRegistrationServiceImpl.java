package kr.ac.hannam.multi.cricket.car.carRegistration.service;

import kr.ac.hannam.multi.cricket.common.mapper.CarsMapper;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CarRegistrationServiceImpl  implements CarRegistrationService {
    private final CarsMapper carsMapper;

    @Override
    public void createCarData(CarsVO carsVO) {
        carsMapper.insertCar(carsVO);

    }
}
