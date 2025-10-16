package kr.ac.hannam.multi.cricket.security.jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Stream;

@Component
public class CookieBearerTokenResolver {
    public static final String ACCESSTOKENCOOKIE = "access_token";

    public String resolve(HttpServletRequest request) {
        return Optional.ofNullable(request.getCookies())
                .map(Arrays::stream)
                .orElse(Stream.empty())
                .filter(c -> ACCESSTOKENCOOKIE.equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }
}
