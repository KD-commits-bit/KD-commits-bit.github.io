package kr.ac.hannam.multi.cricket.admin.service;

import kr.ac.hannam.multi.cricket.common.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService{
    private final UserMapper userMapper;

    @Override
    public int getUserCount() {
        return userMapper.selectUserCount();
    }

    @Override
    public int getTodayUserCount() {
        return userMapper.selectTodayUserCount();
    }
}
