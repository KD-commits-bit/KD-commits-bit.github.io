package kr.ac.hannam.multi.cricket.search.mapper;

import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SearchMapper {
    public List<CarBrandsVO> selectCarBrandsList();

    public List<CarModelsVO> selectCarModelsList(String brandId);
}
