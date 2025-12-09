package kr.ac.hannam.multi.cricket.car.carDetailView.controller;

import kr.ac.hannam.multi.cricket.car.carDetailView.service.CarDetailViewService;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/car/car_view")
public class CarDetailViewController {
    private final CarDetailViewService carDetailViewService;

    @GetMapping("/{carId}")
    public ResponseEntity<CarsVO> carGetInfo(@PathVariable("carId") String carId) {
        CarsVO car = carDetailViewService.readCarById(carId);
        return ResponseEntity.ok(car);
    }

    @GetMapping("/option/{carId}")
    public List<Map<String, Object>> getOptionsData(@PathVariable("carId") String carId) {
        return carDetailViewService.getOptionListByCarId(carId);
    }

}
