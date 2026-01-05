package kr.ac.hannam.multi.cricket.search.service;

import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import kr.ac.hannam.multi.cricket.vo.CarsVO;

import java.util.List;

public interface SearchService {
    public List<CarsVO> readSearchedCarList(String modelId);

    public List<CarBrandsVO> readCarBrandsList();

    public List<CarModelsVO> readCarModelsList(String brandId);

    public List<CarsVO> readCarListByBudget(int minPrice, int maxPrice, String brandId);
}
