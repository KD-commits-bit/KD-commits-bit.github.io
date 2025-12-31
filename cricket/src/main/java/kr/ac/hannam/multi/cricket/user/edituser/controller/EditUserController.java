package kr.ac.hannam.multi.cricket.user.edituser.controller;

import kr.ac.hannam.multi.cricket.user.edituser.dto.UserProfileUpdateRequest;
import kr.ac.hannam.multi.cricket.user.edituser.service.EditUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Add this import
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class EditUserController {

    @Autowired
    private EditUserService editUserService;

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfileUpdateRequest request) {
        // In a real application, you would also perform authentication and authorization checks here
        // to ensure the user is authorized to modify this profile.
        // For example, retrieve user ID from JWT or session and compare with request.getUserId()

        try {
            editUserService.modifyUser(request);

            return ResponseEntity.ok().body("User profile updated successfully.");
        } catch (IllegalArgumentException e) { // Catch specific exception for user not found
            System.err.println("Error updating user profile: " + e.getMessage());
            return ResponseEntity.status(404).body("User not found: " + e.getMessage());
        } catch (Exception e) {
            // Log the exception for debugging purposes
            System.err.println("Error updating user profile: " + e.getMessage());

            return ResponseEntity.badRequest().body("Failed to update user profile: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(Authentication authentication) { // Changed parameter
        try {
            // Get the authenticated user's ID (e.g., username, which is email in this context)
            String authenticatedUserId = authentication.getName();
            
            editUserService.removeUser(authenticatedUserId); // Pass the authenticated user's ID

            return ResponseEntity.ok().body("User deleted successfully.");
        } catch (IllegalArgumentException e) { // Catch specific exception for user not found
            System.err.println("Error deleting user profile: " + e.getMessage());
            return ResponseEntity.status(404).body("User not found: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error deleting user profile: " + e.getMessage());
            return ResponseEntity.badRequest().body("Failed to delete user profile: " + e.getMessage());
        }
    }
}