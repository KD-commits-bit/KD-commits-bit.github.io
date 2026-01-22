package kr.ac.hannam.multi.cricket.mapper;

import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface CarModelsMapper {
    List<CarModelsVO> selectAllModels();
    List<CarModelsVO> selectAllModelsByBrand(String brand);
    CarModelsVO selectModelById(int id);
    int insertModel(CarModelsVO model);
    int updateModel(CarModelsVO model);
    int deleteModelById(int id);
}
