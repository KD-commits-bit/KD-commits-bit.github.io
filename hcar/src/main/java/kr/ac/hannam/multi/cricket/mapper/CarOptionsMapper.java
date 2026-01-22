package kr.ac.hannam.multi.cricket.mapper;

import kr.ac.hannam.multi.cricket.vo.CarOptionsVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;
@Mapper
public interface CarOptionsMapper {
    public List<CarOptionsVO> selectOptionList();
}
