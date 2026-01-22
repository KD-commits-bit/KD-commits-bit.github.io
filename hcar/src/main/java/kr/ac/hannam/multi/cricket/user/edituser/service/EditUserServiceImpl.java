package kr.ac.hannam.multi.cricket.user.edituser.service;

import kr.ac.hannam.multi.cricket.user.edituser.dto.UserProfileUpdateRequest; // Import the new DTO
import kr.ac.hannam.multi.cricket.user.edituser.mapper.EditUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EditUserServiceImpl implements EditUserService {
    @Autowired
    private EditUserMapper editUserMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void modifyUser(UserProfileUpdateRequest request) {
        // 1. Get userNo from userId
        String userNo = editUserMapper.findUserNoByUserId(request.getUserId());
        if (userNo == null || userNo.isEmpty()) {
            throw new IllegalArgumentException("User not found for ID: " + request.getUserId());
        }

        request.setUserNo(userNo);

        // 2. Hash password if provided
        String hashedPassword = null;
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            hashedPassword = passwordEncoder.encode(request.getPassword());
        }
        
        // 3. Update user profile
        editUserMapper.updateUser(userNo, hashedPassword, request.getEmail());

        editUserMapper.updateUserAddress(request);
    }

    @Override
    public void removeUser(String authenticatedUserId) {
        String userNo = editUserMapper.findUserNoByUserId(authenticatedUserId);
        if (userNo == null || userNo.isEmpty()) {
            throw new IllegalArgumentException("User not found for ID: " + authenticatedUserId);
        }
        editUserMapper.deleteUser(userNo);
    }
}
