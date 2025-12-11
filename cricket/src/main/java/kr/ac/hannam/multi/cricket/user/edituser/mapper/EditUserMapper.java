package kr.ac.hannam.multi.cricket.user.edituser.mapper;

import kr.ac.hannam.multi.cricket.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface EditUserMapper {
    public int updateUser(@Param("userNo") String userNo,
                          @Param("hashedPassword") String hashedPassword,
                          @Param("email") String email
    );

    String findUserNoByUserId(@Param("userId") String userId);
}
