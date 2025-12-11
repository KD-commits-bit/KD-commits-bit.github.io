package kr.ac.hannam.multi.cricket.car.carRegistration.controller;

import kr.ac.hannam.multi.cricket.car.carRegistration.service.CarRegistrationService;
import kr.ac.hannam.multi.cricket.security.auth.AdminPrincipal;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/car_register")
public class CarRegistrationController {
    private final CarRegistrationService carRegistrationService;

    @GetMapping()
    ResponseEntity<?> registerCarData(CarsVO carsVO) {
        carRegistrationService.createCarData(carsVO);
        return ResponseEntity.ok().build();
    }

    public static String getAdminId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof AdminPrincipal adminPrincipal) {
            return adminPrincipal.getAdminVO().getAdminEmail();
        }

        return null; // 관리자 아님
    }
}
