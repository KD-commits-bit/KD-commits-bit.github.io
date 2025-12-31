package kr.ac.hannam.multi.cricket.mapper;

import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface CarBrandsMapper {
    List<CarBrandsVO> selectAllCarBrands();
    CarBrandsVO selectCarBrandById(int id);
    int insertCarBrand(CarBrandsVO carBrandsVO);
    int updateCarBrand(CarBrandsVO carBrandsVO);
    int deleteCarBrandById(int id);
}
