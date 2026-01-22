package kr.ac.hannam.multi.cricket.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

public class JwtSessionInvalidateFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        boolean hasAccessToken = false;
        if (request.getCookies() != null) {
            hasAccessToken = Arrays.stream(request.getCookies())
                .anyMatch(cookie -> "access_token".equals(cookie.getName()) && cookie.getValue() != null
                    && !cookie.getValue().isEmpty());
        }

        if (!hasAccessToken) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
