package kr.ac.hannam.multi.cricket.register.mapper;

import kr.ac.hannam.multi.cricket.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RegisterMapper {
    public int insertUser(UserVO user);
    public int countByUserEmail(String userEmail);
}
