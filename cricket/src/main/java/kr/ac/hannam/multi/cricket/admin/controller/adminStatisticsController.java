package kr.ac.hannam.multi.cricket.admin.controller;

import kr.ac.hannam.multi.cricket.admin.service.UserService;
import kr.ac.hannam.multi.cricket.common.service.CarsService;
import kr.ac.hannam.multi.cricket.user.purchase.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/statistics")
public class adminStatisticsController {
    private final SaleService saleService;
    private final CarsService carsService;
    private final UserService userService;

    @GetMapping("/count_car")
    public int getCarsCount() {
        return carsService.getCountCars();
    }

    @GetMapping("/count_sales")
    public int getSalesCount() {
        return saleService.getSalesCount();
    }

    @GetMapping("/count_user")
    public int getUsersCount() {
        return userService.getUserCount();
    }


}
