package kr.ac.hannam.multi.cricket.user.purchase.mapper;

import kr.ac.hannam.multi.cricket.vo.SalesVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SaleMapper {
    public int insertSale(SalesVO salesVO);
    public int selectSalesCount();
}
