package kr.ac.hannam.multi.cricket.common.mapper;

import kr.ac.hannam.multi.cricket.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    public UserVO selectUser(String username);
}
