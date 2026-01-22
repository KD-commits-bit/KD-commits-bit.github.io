package kr.ac.hannam.multi.cricket.common.controller;

import kr.ac.hannam.multi.cricket.common.service.CarsService;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/car")
public class CarsController {
    @Autowired
    private CarsService carsService;

    @GetMapping("/all")
    public ResponseEntity<List<CarsVO>> selectAllCars() {
        List<CarsVO> cars = carsService.selectAllCars();

        return ResponseEntity.ok(cars);
    }
}
