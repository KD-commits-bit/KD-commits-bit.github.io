package kr.ac.hannam.multi.cricket.common.service;

import kr.ac.hannam.multi.cricket.vo.CarsVO;

import java.util.List;

public interface CarsService {
    public List<CarsVO> selectAllCars();
    public int getCountCars();
}
