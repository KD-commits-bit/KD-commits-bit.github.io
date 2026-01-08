package kr.ac.hannam.multi.cricket.search.mapper;

import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SearchMapper {
    public List<CarsVO> selectCarListByKeyword(@Param("keyword") String keyword);

    public List<CarsVO> selectSearchedCarList(String modelId);

    public List<CarsVO> selectCarListByBudget(@Param("minPrice") int minPrice, @Param("maxPrice") int maxPrice, @Param("brandId") String brandId);

    public List<CarBrandsVO> selectCarBrandsList();

    public List<CarModelsVO> selectCarModelsList(String brandId);
}
