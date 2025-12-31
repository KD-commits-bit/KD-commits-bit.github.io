package kr.ac.hannam.multi.cricket.common.controller;

import kr.ac.hannam.multi.cricket.common.mapper.FavoriteMapper;
import kr.ac.hannam.multi.cricket.common.service.FavoriteService;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private FavoriteMapper favoriteMapper;

    /**
     * 현재 로그인된 사용자의 찜 목록을 조회합니다.
     * @return 찜한 차량 정보 리스트
     */
    @GetMapping
    public ResponseEntity<List<CarsVO>> getFavorites(@RequestParam String userNo) {
        List<CarsVO> favoriteCars = favoriteService.getFavoriteCarsByUserId(userNo);

        return ResponseEntity.ok(favoriteCars);
    }

    /**
     * 차량을 찜 목록에 추가합니다.
     * @param payload 요청 본문 ({"carId": "123", "userNo": "user001"})
     * @return 성공 시 200 OK
     */
    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestBody Map<String, Object> payload) {

        String userNo = payload.get("userNo").toString();
        Object carIdObj = payload.get("carId");

        if (carIdObj == null) {
            return ResponseEntity.badRequest().body("carId is required.");
        }
        String carId = carIdObj.toString();

        favoriteService.addFavorite(userNo, carId);
        return ResponseEntity.ok().build();
    }

    /**
     * 차량을 찜 목록에서 제거합니다.
     * @param carId 찜 취소할 차량 ID
     * @return 성공 시 204 No Content
     */
    @DeleteMapping("/{carId}")
    public ResponseEntity<?> removeFavorite(@PathVariable String carId, @RequestParam String userNo) {
        favoriteService.removeFavorite(userNo, carId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkFavorite(@RequestParam String userNo,
                                                 @RequestParam String carId) {
        boolean isFavorite = favoriteMapper.countByUserIdAndCarId(userNo, carId) > 0;
        return ResponseEntity.ok(isFavorite);
    }
}