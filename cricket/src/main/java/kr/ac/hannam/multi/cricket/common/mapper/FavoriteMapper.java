package kr.ac.hannam.multi.cricket.common.mapper;

import kr.ac.hannam.multi.cricket.vo.FavoriteVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FavoriteMapper {
    /**
     * 찜하기 추가
     * @param favoriteVO 찜하기 정보 (userId, carId)
     * @return 삽입된 행의 수
     */
    int insertFavorite(FavoriteVO favoriteVO);

    /**
     * 찜하기 삭제
     * @param userId 사용자 ID
     * @param carId 자동차 ID
     * @return 삭제된 행의 수
     */
    int deleteFavorite(@Param("userId") String userId, @Param("carId") String carId);

    /**
     * 사용자의 찜 목록 조회
     * @param userId 사용자 ID
     * @return 찜한 정보 리스트
     */
    List<FavoriteVO> findFavoritesByUserId(String userId);

    /**
     * 특정 사용자가 특정 차를 찜했는지 확인
     * @param userId 사용자 ID
     * @param carId 자동차 ID
     * @return 찜한 경우 1, 아니면 0
     */
    int countByUserIdAndCarId(@Param("userId") String userId, @Param("carId") String carId);
}
