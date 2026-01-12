package kr.ac.hannam.multi.cricket.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.ac.hannam.multi.cricket.security.jwt.CookieBearerTokenResolver;
import kr.ac.hannam.multi.cricket.security.jwt.JWTProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
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
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/login/oauth2/") || path.startsWith("/oauth2/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request);

        if (token != null) {
            try {
                Authentication authentication = jwtProvider.tokenToAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                logger.debug("인증 실패 또는 미가입 사용자 접근: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return tokenResolver.resolve(request);
    }
}
