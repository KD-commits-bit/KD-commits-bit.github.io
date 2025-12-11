package kr.ac.hannam.multi.cricket.user.edituser.service;

import kr.ac.hannam.multi.cricket.user.edituser.dto.UserProfileUpdateRequest; // Import the new DTO

public interface EditUserService {
    public void modifyUser(UserProfileUpdateRequest request);
}
