package kr.ac.hannam.multi.cricket.common.controller;

import kr.ac.hannam.multi.cricket.common.controller.dto.LoginRequest;
import kr.ac.hannam.multi.cricket.security.auth.AdminPrincipal;
import kr.ac.hannam.multi.cricket.security.auth.CustomUserDetailsService;
import kr.ac.hannam.multi.cricket.security.auth.UserPrincipal;
import kr.ac.hannam.multi.cricket.security.jwt.JWTProvider;
import kr.ac.hannam.multi.cricket.vo.AdminVO;
import kr.ac.hannam.multi.cricket.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JWTProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getId(),
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.authenticationToToken(authentication);

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getId());
        
        String id = null;
        String name = null;

        if (userDetails instanceof UserPrincipal) {
            UserVO user = ((UserPrincipal) userDetails).getUserVO();

            id = user.getUserEmail();
            name = user.getUserName();
        } else if (userDetails instanceof AdminPrincipal) {
            AdminVO admin = ((AdminPrincipal) userDetails).getAdminVO();

            id = admin.getAdminEmail();
            name = admin.getAdminName();
        }

        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "id", id,
                "name", name
            )
        ));
    }
}
