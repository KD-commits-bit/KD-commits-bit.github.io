package kr.ac.hannam.multi.cricket.common.service;

import kr.ac.hannam.multi.cricket.common.mapper.CarsMapper;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarsServiceImpl implements  CarsService {
    @Autowired
    private CarsMapper carsMapper;

    @Override
    public List<CarsVO> selectAllCars() {

        return carsMapper.selectAllCars();
    }
}
