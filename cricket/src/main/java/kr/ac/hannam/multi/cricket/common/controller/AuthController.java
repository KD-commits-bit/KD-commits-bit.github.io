package kr.ac.hannam.multi.cricket.common.controller;

import kr.ac.hannam.multi.cricket.common.controller.dto.LoginRequest;
import kr.ac.hannam.multi.cricket.security.auth.AdminPrincipal;
import kr.ac.hannam.multi.cricket.security.auth.CustomUserDetailsService;
import kr.ac.hannam.multi.cricket.security.auth.UserPrincipal;
import kr.ac.hannam.multi.cricket.security.jwt.JWTProvider;
import kr.ac.hannam.multi.cricket.vo.AdminVO;
import kr.ac.hannam.multi.cricket.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
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

        String no = null;
        String id = null;
        String name = null;
        String phone = null;

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        if (userDetails instanceof UserPrincipal) {
            UserVO user = ((UserPrincipal) userDetails).getUserVO();

            no = user.getUserNo();
            id = user.getUserEmail();
            name = user.getUserName();
            phone = user.getUserPhone();
        } else if (userDetails instanceof AdminPrincipal) {
            AdminVO admin = ((AdminPrincipal) userDetails).getAdminVO();

            no = admin.getAdminNo();
            id = admin.getAdminEmail();
            name = admin.getAdminName();
            phone = admin.getAdminPhone();
        }

        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "no", no,
                "id", id,
                "name", name,
                "roles", roles,
                "phone", phone
            )
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String id = userDetails.getUsername();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // DB에서 전체 사용자 정보를 다시 로드하여 이름을 가져옵니다.
        UserDetails fullUserDetails = userDetailsService.loadUserByUsername(id);
        String no = null;
        String name = null;
        String phone = null;

        if (fullUserDetails instanceof UserPrincipal) {
            no = ((UserPrincipal) fullUserDetails).getUserVO().getUserNo();
            name = ((UserPrincipal) fullUserDetails).getUserVO().getUserName();
            phone = ((UserPrincipal) fullUserDetails).getUserVO().getUserPhone();
        } else if (fullUserDetails instanceof AdminPrincipal) {
            no = ((AdminPrincipal) fullUserDetails).getAdminVO().getAdminNo();
            name = ((AdminPrincipal) fullUserDetails).getAdminVO().getAdminName();
            phone = ((AdminPrincipal) fullUserDetails).getAdminVO().getAdminPhone();
        }

        return ResponseEntity.ok(Map.of(
            "no", no,
            "id", id,
            "name", name,
            "roles", roles,
            "phone", phone
        ));
    }
}
