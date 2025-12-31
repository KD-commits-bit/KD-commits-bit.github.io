package kr.ac.hannam.multi.cricket.common.service;

import kr.ac.hannam.multi.cricket.vo.CarsVO;
import java.util.List;

public interface FavoriteService {
    /**
     * 찜하기
     * @param userId 사용자 ID
     * @param carId 자동차 ID
     */
    void addFavorite(String userId, String carId);

    /**
     * 찜하기 취소
     * @param userNo 사용자 No
     * @param carId 자동차 ID
     */
    void removeFavorite(String userNo, String carId);

    /**
     * 찜한 차량 목록 가져오기
     * @param userId 사용자 ID
     * @return 찜한 차량 정보 리스트
     */
    List<CarsVO> getFavoriteCarsByUserId(String userId);
}
