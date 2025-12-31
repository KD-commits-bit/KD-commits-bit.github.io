package kr.ac.hannam.multi.cricket.common.service;

import kr.ac.hannam.multi.cricket.common.mapper.MypagePurchaseMapper;
import kr.ac.hannam.multi.cricket.vo.SalesVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MypagePurchaseServiceImpl implements MypagePurchaseService {
    @Autowired
    private MypagePurchaseMapper mypagePurchaseMapper;

    @Override
    public List<SalesVO> readPurchaseList(String userNo) {

        return mypagePurchaseMapper.selectPurchaseList(userNo);
    }
}
