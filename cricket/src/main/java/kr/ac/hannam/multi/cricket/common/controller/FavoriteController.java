package kr.ac.hannam.multi.cricket.common.controller;

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

    /**
     * 현재 로그인된 사용자의 찜 목록을 조회합니다.
     * @param authentication Spring Security가 제공하는 인증 정보
     * @return 찜한 차량 정보 리스트
     */
    @GetMapping
    public ResponseEntity<List<CarsVO>> getFavorites(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userId = userDetails.getUsername();
        List<CarsVO> favoriteCars = favoriteService.getFavoriteCarsByUserId(userId);
        return ResponseEntity.ok(favoriteCars);
    }

    /**
     * 차량을 찜 목록에 추가합니다.
     * @param payload 요청 본문 ({"carId": "123"})
     * @param authentication Spring Security가 제공하는 인증 정보
     * @return 성공 시 200 OK
     */
    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestBody Map<String, Object> payload, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userId = userDetails.getUsername();
        Object carIdObj = payload.get("carId");

        if (carIdObj == null) {
            return ResponseEntity.badRequest().body("carId is required.");
        }
        String carId = carIdObj.toString();

        favoriteService.addFavorite(userId, carId);
        return ResponseEntity.ok().build();
    }

    /**
     * 차량을 찜 목록에서 제거합니다.
     * @param carId 찜 취소할 차량 ID
     * @param authentication Spring Security가 제공하는 인증 정보
     * @return 성공 시 204 No Content
     */
    @DeleteMapping("/{carId}")
    public ResponseEntity<?> removeFavorite(@PathVariable String carId, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userId = userDetails.getUsername();
        
        favoriteService.removeFavorite(userId, carId);
        return ResponseEntity.noContent().build();
    }
}