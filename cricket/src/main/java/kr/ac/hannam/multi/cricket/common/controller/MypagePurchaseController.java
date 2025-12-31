package kr.ac.hannam.multi.cricket.common.controller;

import kr.ac.hannam.multi.cricket.common.service.MypagePurchaseService;
import kr.ac.hannam.multi.cricket.vo.SalesVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mypage-purchase")
public class MypagePurchaseController {
    @Autowired
    private MypagePurchaseService mypagePurchaseService;

    @GetMapping()
    public ResponseEntity<List<SalesVO>> selectPurchaseList(@RequestParam String userNo)  {
        List<SalesVO> purchaseList = mypagePurchaseService.readPurchaseList(userNo);

        return ResponseEntity.ok(purchaseList);
    }
}
