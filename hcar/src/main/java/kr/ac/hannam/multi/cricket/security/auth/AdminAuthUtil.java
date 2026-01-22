package kr.ac.hannam.multi.cricket.security.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AdminAuthUtil {

    private AdminAuthUtil() {}

    public static String getAdminNo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("관리자 인증 정보가 없습니다.");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof AdminPrincipal adminPrincipal)) {
            throw new IllegalStateException("관리자 계정으로 로그인되어 있지 않습니다.");
        }

        return adminPrincipal.getAdminVO().getAdminNo();
    }
}