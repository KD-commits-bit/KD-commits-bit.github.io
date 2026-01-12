package kr.ac.hannam.multi.cricket.common.oauth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.ac.hannam.multi.cricket.security.jwt.JWTProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j // 로그 확인을 위해 추가 권장
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JWTProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String email = getEmail(authentication);

        log.info("SuccessHandler 추출 이메일: {}", email);

        if (email == null) {
            log.error("이메일을 추출할 수 없어 토큰 생성이 불가능합니다.");
            response.sendRedirect("http://localhost:5173/login?error=email_not_found");
            return;
        }

        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String token = jwtProvider.createTokenForOAuth2(email, role);

        Cookie cookie = new Cookie("access_token", token);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setMaxAge(3600);
        response.addCookie(cookie);

        log.info("JWT 토큰 생성 및 쿠키 저장 완료 - 리다이렉트 시작");

        String targetUrl = "http://localhost:5173/";
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private static String getEmail(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = null;

        if (attributes.containsKey("email")) {
            // 구글
            email = (String) attributes.get("email");
        } else if (attributes.containsKey("kakao_account")) {
            // 카카오
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            email = (String) kakaoAccount.get("email");
        } else if (attributes.containsKey("response")) {
            // 네이버
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            email = (String) response.get("email");
        }

        return email;
    }
}