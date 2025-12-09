package kr.ac.hannam.multi.cricket.common.mapper;

import kr.ac.hannam.multi.cricket.vo.CarsVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CarsMapper {
    public List<CarsVO> selectAllCars();
    public CarsVO selectCarById(String carId);
}
