package kr.ac.hannam.multi.cricket.user.purchase.controller;

import kr.ac.hannam.multi.cricket.user.purchase.service.SaleService;
import kr.ac.hannam.multi.cricket.vo.SalesVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/purchase")
public class PurchaseController {
    @Autowired
    private SaleService saleService;

    @PostMapping("/success")
    public ResponseEntity<?> purchaseCar(@RequestBody SalesVO salesVO) {
        System.out.println("받은 데이터: " + salesVO);

        try {
            saleService.createSale(salesVO);

            return ResponseEntity.ok("구매 처리가 정상적으로 완료되었습니다.");
        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }
}
