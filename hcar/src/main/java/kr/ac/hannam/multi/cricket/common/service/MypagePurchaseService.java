package kr.ac.hannam.multi.cricket.common.service;

import kr.ac.hannam.multi.cricket.vo.FavoriteVO;
import kr.ac.hannam.multi.cricket.vo.SalesVO;

import java.util.List;

public interface MypagePurchaseService {
    public List<SalesVO> readPurchaseList(String userNo);
}
