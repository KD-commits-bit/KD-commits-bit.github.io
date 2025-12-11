package kr.ac.hannam.multi.cricket.mapper;

import kr.ac.hannam.multi.cricket.vo.CarModelsVO;

import java.util.List;

public interface CarModelsMapper {
    List<CarModelsVO> selectAllModels();
    List<CarModelsVO> selectAllModelsByBrand(String brand);
    CarModelsVO selectModelById(int id);
    int insertModel(CarModelsVO model);
    int updateModel(CarModelsVO model);
    int deleteModelById(int id);
}
