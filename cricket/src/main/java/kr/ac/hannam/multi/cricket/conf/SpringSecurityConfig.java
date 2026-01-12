package kr.ac.hannam.multi.cricket.conf;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import kr.ac.hannam.multi.cricket.common.oauth.CustomOAuth2UserService;
import kr.ac.hannam.multi.cricket.common.oauth.OAuth2AuthenticationSuccessHandler;
import kr.ac.hannam.multi.cricket.filter.JwtAuthenticationFilter;
import kr.ac.hannam.multi.cricket.security.jwt.JWTProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {

    private final JWTProvider jwtProvider;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    public SpringSecurityConfig(JWTProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
        throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS 설정 추가
            .cors(Customizer.withDefaults())
            // 1. CSRF 보호 비활성화
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

            // 3. HTTP Basic 및 formLogin 인증 방식 비활성화
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())

            // 4-1. 인증되지 않은 사용자가 보호된 리소스에 접근할 때 리디렉션 대신 401 에러를 반환하도록 설정
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                }))

            // 4-2. 우리가 만든 JwtAuthenticationFilter를 UsernamePasswordAuthenticationFilter 앞에 추가
            .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class)

            // 5. 경로별 접근 권한 설정
            .authorizeHttpRequests(authorize -> authorize
                // React 빌드 파일 및 정적 자원들은 모두 허용
                .requestMatchers("/", "/index.html", "/static/**", "/assets/**", "/vite.svg", "/manifest.json").permitAll()
                .requestMatchers("/api/auth/login", "/api/register", "/api/register/**", "/oauth2/**", "/login/oauth2/**").permitAll()
                .requestMatchers("/api/car/**").permitAll()
                .requestMatchers("/api/search/**").permitAll()
                .requestMatchers("/api/favorites/check").permitAll()
                .requestMatchers("/api/purchase/**").permitAll()
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN")
                .requestMatchers("/api/auth/me").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/**").authenticated()
                //파일 업로드 엔드포인트 허용
                .requestMatchers("/file/**").permitAll()
                // 그 외 모든 요청은 인증된 사용자만 접근 가능
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                    .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                    .successHandler(oAuth2AuthenticationSuccessHandler)
            )
            // 6. 로그아웃 설정
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .deleteCookies("access_token") // 직접 쿠키를 지우는 대신 이 메소드를 사용
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK);
                })
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // React 개발 서버의 주소입니다. (사용하시는 포트에 맞게 변경하세요)
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}