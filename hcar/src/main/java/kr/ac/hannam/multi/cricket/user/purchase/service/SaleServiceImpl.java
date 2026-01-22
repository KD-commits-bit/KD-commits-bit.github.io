package kr.ac.hannam.multi.cricket.user.purchase.service;

import kr.ac.hannam.multi.cricket.common.mapper.CarsMapper;
import kr.ac.hannam.multi.cricket.user.purchase.mapper.SaleMapper;
import kr.ac.hannam.multi.cricket.vo.SalesVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SaleServiceImpl implements SaleService {
    @Autowired
    private SaleMapper saleMapper;

    @Autowired
    private CarsMapper carsMapper;

    @Override
    public void createSale(SalesVO salesVO) {
        final int STATUS_AVAILABLE = 0;
        final int STATUS_SOLD = 1;

        int result = carsMapper.updateCarStatus(salesVO.getCarId(), STATUS_SOLD);

        if (result == 0) {
            throw new RuntimeException("이미 판매되었거나 구매할 수 없는 차량입니다.");
        }

        saleMapper.insertSale(salesVO);
    }

    @Override
    public int getSalesCount() {
       return saleMapper.selectSalesCount();
    }
}
