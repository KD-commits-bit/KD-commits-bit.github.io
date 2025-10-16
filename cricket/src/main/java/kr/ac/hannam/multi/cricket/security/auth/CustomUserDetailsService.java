package kr.ac.hannam.multi.cricket.security.auth;

import kr.ac.hannam.multi.cricket.common.mapper.UserMapper;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomUserDetailsService {
    private final UserMapper mapper;
}
