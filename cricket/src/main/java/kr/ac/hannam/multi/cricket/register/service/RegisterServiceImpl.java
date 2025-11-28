package kr.ac.hannam.multi.cricket.register.service;

import kr.ac.hannam.multi.cricket.common.exception.EmailAlreadyExistsException;
import kr.ac.hannam.multi.cricket.register.mapper.RegisterMapper;
import kr.ac.hannam.multi.cricket.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterServiceImpl implements RegisterService {

    private final RegisterMapper registerMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public RegisterServiceImpl(RegisterMapper registerMapper, PasswordEncoder passwordEncoder) {
        this.registerMapper = registerMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void createUser(UserVO user) {
        if (isEmailDuplicated(user.getUserEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + user.getUserEmail());
        }
        user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
        registerMapper.insertUser(user);
    }

    @Override
    public boolean isEmailDuplicated(String userEmail) {
        return registerMapper.countByUserEmail(userEmail) > 0;
    }
}
