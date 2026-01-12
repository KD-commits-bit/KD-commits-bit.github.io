package kr.ac.hannam.multi.cricket.common.mapper;

import kr.ac.hannam.multi.cricket.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface UserMapper {
    public UserVO selectUser(String username);
    public Optional<UserVO> findByEmail(String userEmail);
    public int selectUserCount();
    public int selectTodayUserCount();
}
