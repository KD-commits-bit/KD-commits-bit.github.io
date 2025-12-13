package kr.ac.hannam.multi.cricket.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CarOptionMapMapper {
    List<Map<String, Object>> selectOptionListById(String carId);
    public int insertCarOptions(String carId, String optionId);
}
