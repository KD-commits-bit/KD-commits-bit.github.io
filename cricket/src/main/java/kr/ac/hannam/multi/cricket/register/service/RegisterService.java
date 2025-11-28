package kr.ac.hannam.multi.cricket.register.service;

import kr.ac.hannam.multi.cricket.vo.UserVO;

public interface RegisterService {
    public void createUser(UserVO userVO);
    public boolean isEmailDuplicated(String userEmail);
}
