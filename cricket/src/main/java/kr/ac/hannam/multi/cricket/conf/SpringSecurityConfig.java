package kr.ac.hannam.multi.cricket.conf;

import kr.ac.hannam.multi.cricket.filter.JwtAuthenticationFilter;
import kr.ac.hannam.multi.cricket.security.jwt.JWTProvider;
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

            // 2. 세션 관리 정책을 STATELESS로 설정 (세션을 사용하지 않음)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 3. HTTP Basic 및 formLogin 인증 방식 비활성화
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())

            // 4. 우리가 만든 JwtAuthenticationFilter를 UsernamePasswordAuthenticationFilter 앞에 추가
            .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class)

            // 5. 경로별 접근 권한 설정
            .authorizeHttpRequests(authorize -> authorize
                // React 빌드 파일 및 정적 자원들은 모두 허용
                .requestMatchers("/", "/index.html", "/static/**", "/assets/**", "/vite.svg", "/manifest.json").permitAll()
                // 로그인, 회원가입 API는 모두 허용
                .requestMatchers("/api/login", "/api/register").permitAll()
                // 그 외 모든 요청은 인증된 사용자만 접근 가능
                .anyRequest().authenticated()
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
