package kr.ac.hannam.multi.cricket.common.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface FileMapper {
    void insertCarImage(
            @Param("carImageId") String carImageId,
            @Param("carId") String carId,
            @Param("isPrimary") String isPrimary
    );

    List<Map<String, Object>> selectCarImages();
    List<Map<String, Object>> selectCarImagesByCarId(@Param("carId") String carId);
    void deleteCarImage(@Param("carImageId") String carImageId);
}
