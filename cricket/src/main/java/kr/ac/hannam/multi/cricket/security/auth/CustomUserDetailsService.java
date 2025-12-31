package kr.ac.hannam.multi.cricket.security.auth;

import kr.ac.hannam.multi.cricket.common.mapper.AdminMapper;
import kr.ac.hannam.multi.cricket.common.mapper.UserMapper;
import kr.ac.hannam.multi.cricket.vo.AdminVO;
import kr.ac.hannam.multi.cricket.vo.UserVO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;
    private final AdminMapper adminMapper;

    public CustomUserDetailsService(UserMapper userMapper, AdminMapper adminMapper) {
        this.userMapper = userMapper;
        this.adminMapper = adminMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserVO user = userMapper.selectUser(username);
        if (user != null) {
            return new UserPrincipal(user);
        }

        AdminVO admin = adminMapper.selectAdmin(username);
        if (admin != null) {
            return new AdminPrincipal(admin);
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}