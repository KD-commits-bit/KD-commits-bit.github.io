package kr.ac.hannam.multi.cricket.car.carRegistration.controller;

import kr.ac.hannam.multi.cricket.car.carRegistration.service.CarRegistrationService;
import kr.ac.hannam.multi.cricket.dto.CarRegisterDTO;
import kr.ac.hannam.multi.cricket.security.auth.AdminPrincipal;
import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import kr.ac.hannam.multi.cricket.vo.CarOptionsVO;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/car_register")
public class CarRegistrationController {
    private final CarRegistrationService carRegistrationService;


    @PostMapping(consumes = "multipart/form-data")
    ResponseEntity<?> registerCarData(
            @RequestPart("data") CarRegisterDTO data,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        carRegistrationService.createCarData(data, images);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/options")
    List<CarOptionsVO> getOptionList() {
        return carRegistrationService.getOptionList();
    }

    @GetMapping("/brands")
    List<CarBrandsVO> getBrandList() {
        return carRegistrationService.getBrandList();
    }

    @GetMapping("/models")
    List<CarModelsVO> getModelList() {
        return carRegistrationService.getModelList();
    }




}
