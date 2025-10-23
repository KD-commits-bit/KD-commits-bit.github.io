package kr.ac.hannam.multi.cricket.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.ac.hannam.multi.cricket.security.jwt.CookieBearerTokenResolver;
import kr.ac.hannam.multi.cricket.security.jwt.JWTProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTProvider jwtProvider;
    private final CookieBearerTokenResolver tokenResolver;

    public JwtAuthenticationFilter(JWTProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
        this.tokenResolver = new CookieBearerTokenResolver();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1. 쿠키에서 토큰을 가져옵니다.
        String token = tokenResolver.resolve(request);

        // 2. 토큰이 존재하고 유효하다면
        if (token != null) {
            try {
                // 3. JWTProvider를 사용해 토큰을 검증하고 Authentication 객체를 생성합니다.
                Authentication authentication = jwtProvider.tokenToAuthentication(token);
                // 4. SecurityContextHolder에 인증 정보를 등록합니다.
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                // 토큰이 유효하지 않은 경우, 컨텍스트를 비웁니다.
                SecurityContextHolder.clearContext();
                logger.warn("JWT token processing error: " + e.getMessage());
            }
        }

        // 5. 다음 필터로 체인을 계속 진행합니다.
        filterChain.doFilter(request, response);
    }
}
