package kr.ac.hannam.multi.cricket.search.controller;

import kr.ac.hannam.multi.cricket.search.service.SearchService;
import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    @Autowired
    private SearchService searchService;

    @GetMapping("{modelId}")
    public ResponseEntity<List<CarsVO>> selectSearchedCarList(@PathVariable String modelId){
        List<CarsVO> searchedCarList = searchService.readSearchedCarList(modelId);

        return ResponseEntity.ok(searchedCarList);
    }

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

    @GetMapping("budget")
    public ResponseEntity<List<CarsVO>> selectCarListByBudget(
            @RequestParam int minPrice,
            @RequestParam int maxPrice,
            @RequestParam(required = false) String brandId) {
        System.out.println("minPrice === " + minPrice);
        System.out.println("maxPrice === " + maxPrice);
        System.out.println("brandId === " + brandId);

        List<CarsVO> list = searchService.readCarListByBudget(minPrice, maxPrice, brandId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("keyword")
    public ResponseEntity<List<CarsVO>> readCarListByKeyword(@RequestParam(name = "q") String keyword) {
        List<CarsVO> list = searchService.readCarListByKeyword(keyword);

        return ResponseEntity.ok(list);
    }
}
