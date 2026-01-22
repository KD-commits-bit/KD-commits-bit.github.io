package kr.ac.hannam.multi.cricket.common.service;

import kr.ac.hannam.multi.cricket.common.exception.AlreadyFavoriteException;
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
    public void addFavorite(String userNo, String carId) {
        // 이미 찜했는지 확인
        if (favoriteMapper.countByUserIdAndCarId(userNo, carId) == 0) {
            FavoriteVO favorite = new FavoriteVO();
            favorite.setUserNo(userNo); // Mapper와 일관성을 위해 setUserId 사용
            favorite.setCarId(carId);
            favoriteMapper.insertFavorite(favorite);
        } else {
            throw new AlreadyFavoriteException("이미 찜한 차량입니다.");
        }
    }

    @Override
    public void removeFavorite(String userNo, String carId) {

        favoriteMapper.deleteFavorite(userNo, carId);
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