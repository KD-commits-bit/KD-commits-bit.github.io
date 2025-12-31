package kr.ac.hannam.multi.cricket.search.controller;

import kr.ac.hannam.multi.cricket.search.service.SearchService;
import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    @Autowired
    private SearchService searchService;

    @GetMapping("brandList")
    public ResponseEntity<List<CarBrandsVO>> selectCarBrandsList() {
        List<CarBrandsVO> carBrandsList = searchService.readCarBrandsList();

        return ResponseEntity.ok(carBrandsList);
    }

    @GetMapping("modelList/{brandId}")
    public ResponseEntity<List<CarModelsVO>> selectCarModelsList(@PathVariable String brandId) {
        List<CarModelsVO> carModelsList = searchService.readCarModelsList(brandId);

        return ResponseEntity.ok(carModelsList);
    }
}
