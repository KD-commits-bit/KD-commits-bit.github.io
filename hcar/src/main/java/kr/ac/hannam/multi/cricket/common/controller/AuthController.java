package kr.ac.hannam.multi.cricket.common.controller;

import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, ServletResponse servletResponse, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getId(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.authenticationToToken(authentication);


        ;
        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // https면 true
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 5); // 5시간
        response.addCookie(cookie);


        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getId());

        String no = null;
        String id = null;
        String name = null;
        String phone = null;
        String zipcode = null;
        String addressLine1 = null;
        String addressLine2 = null;

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        if (userDetails instanceof UserPrincipal) {
            UserVO user = ((UserPrincipal) userDetails).getUserVO();

            no = user.getUserNo();
            id = user.getUserEmail();
            name = user.getUserName();
            phone = user.getUserPhone();
            zipcode = user.getZipcode();
            addressLine1 = user.getAddressLine1();
            addressLine2 = user.getAddressLine2();

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
                        "phone", phone,
                        "zipcode", zipcode != null ? zipcode : "",
                        "addressLine1", addressLine1 != null ? addressLine1 : "",
                        "addressLine2", addressLine2 != null ? addressLine2 : ""
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
        String zipcode = null;
        String addressLine1 = null;
        String addressLine2 = null;

        if (fullUserDetails instanceof UserPrincipal) {
            no = ((UserPrincipal) fullUserDetails).getUserVO().getUserNo();
            name = ((UserPrincipal) fullUserDetails).getUserVO().getUserName();
            phone = ((UserPrincipal) fullUserDetails).getUserVO().getUserPhone();
            zipcode = ((UserPrincipal) fullUserDetails).getUserVO().getZipcode();
            addressLine1 = ((UserPrincipal) fullUserDetails).getUserVO().getAddressLine1();
            addressLine2 = ((UserPrincipal) fullUserDetails).getUserVO().getAddressLine2();
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
            "phone", phone,
            "zipcode", zipcode != null ? zipcode : "",
            "addressLine1", addressLine1 != null ? addressLine1 : "",
            "addressLine2", addressLine2 != null ? addressLine2 : ""
        ));
    }
}
