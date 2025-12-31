package kr.ac.hannam.multi.cricket.search.service;

import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;

import java.util.List;

public interface SearchService {
    public List<CarBrandsVO> readCarBrandsList();

    public List<CarModelsVO> readCarModelsList(String brandId);
}
