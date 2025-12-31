package kr.ac.hannam.multi.cricket.search.service;

import kr.ac.hannam.multi.cricket.search.mapper.SearchMapper;
import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchServiceImpl implements SearchService {
    @Autowired
    private SearchMapper searchMapper;

    @Override
    public List<CarBrandsVO> readCarBrandsList() {
        List<CarBrandsVO> carBrandsList = searchMapper.selectCarBrandsList();

        return carBrandsList;
    }

    @Override
    public List<CarModelsVO> readCarModelsList(String brandId) {
        List<CarModelsVO> carModelsList = searchMapper.selectCarModelsList(brandId);

        return carModelsList;
    }
}
