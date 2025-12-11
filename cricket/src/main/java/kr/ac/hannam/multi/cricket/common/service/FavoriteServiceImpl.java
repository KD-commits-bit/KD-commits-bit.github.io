package kr.ac.hannam.multi.cricket.common.service;

import kr.ac.hannam.multi.cricket.common.mapper.CarsMapper;
import kr.ac.hannam.multi.cricket.common.mapper.FavoriteMapper;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import kr.ac.hannam.multi.cricket.vo.FavoriteVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    @Autowired
    private FavoriteMapper favoriteMapper;

    @Autowired
    private CarsMapper carsMapper;

    @Override
    public void addFavorite(String userId, String carId) {
        // 이미 찜했는지 확인
        if (favoriteMapper.countByUserIdAndCarId(userId, carId) == 0) {
            FavoriteVO favorite = new FavoriteVO();
            favorite.setUserNo(userId); // Mapper와 일관성을 위해 setUserId 사용
            favorite.setCarId(carId);
            favoriteMapper.insertFavorite(favorite);
        }
        // 이미 찜한 경우, 여기서 예외를 발생시키거나 그냥 무시할 수 있습니다.
        // 현재는 아무 작업도 하지 않습니다.
    }

    @Override
    public void removeFavorite(String userId, String carId) {
        favoriteMapper.deleteFavorite(userId, carId);
    }

    @Override
    public List<CarsVO> getFavoriteCarsByUserId(String userId) {
        List<FavoriteVO> favorites = favoriteMapper.findFavoritesByUserId(userId);
        
        if (favorites.isEmpty()) {
            return Collections.emptyList(); // 빈 리스트 반환
        }

        List<String> carIds = favorites.stream()
                                     .map(FavoriteVO::getCarId)
                                     .collect(Collectors.toList());
        
        return carsMapper.findCarsByIds(carIds);
    }
}