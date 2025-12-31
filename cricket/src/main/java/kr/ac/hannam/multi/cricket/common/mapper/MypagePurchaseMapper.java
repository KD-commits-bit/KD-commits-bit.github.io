package kr.ac.hannam.multi.cricket.common.mapper;

import kr.ac.hannam.multi.cricket.vo.FavoriteVO;
import kr.ac.hannam.multi.cricket.vo.SalesVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MypagePurchaseMapper {
    public List<SalesVO> selectPurchaseList(String userNo);
}
