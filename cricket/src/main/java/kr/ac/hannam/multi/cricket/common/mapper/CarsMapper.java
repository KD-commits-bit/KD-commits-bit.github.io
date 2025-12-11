package kr.ac.hannam.multi.cricket.common.mapper;

import kr.ac.hannam.multi.cricket.vo.CarsVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CarsMapper {
    public List<CarsVO> selectAllCars();
    public List<CarsVO> findCarsByIds(@Param("carIds") List<String> carIds);
    public CarsVO selectCarById(String carId);
    public int insertCar(CarsVO carsVO);
}
