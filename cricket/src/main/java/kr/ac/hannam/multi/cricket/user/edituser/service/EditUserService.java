package kr.ac.hannam.multi.cricket.user.edituser.service;

import kr.ac.hannam.multi.cricket.user.edituser.dto.UserProfileUpdateRequest; // Import the new DTO
import org.apache.ibatis.annotations.Param;

public interface EditUserService {
    public void modifyUser(UserProfileUpdateRequest request);

    public void removeUser(String authenticatedUserId);
}
