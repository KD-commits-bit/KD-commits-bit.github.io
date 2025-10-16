package kr.ac.hannam.multi.cricket.conf;

import javax.sql.DataSource;

import kr.ac.hannam.multi.cricket.common.mapper.UserMapper;
import kr.ac.hannam.multi.cricket.filter.JwtSessionInvalidateFilter;
import kr.ac.hannam.multi.cricket.security.auth.CustomUserDetailsService;
import kr.ac.hannam.multi.cricket.security.jwt.CookieBearerTokenResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.AntPathMatcher;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
@ConfigurationProperties(prefix = "myapp")
@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {
    // java bean의 규약으로 getter setter로 입력하면 application.properties에 있는
    // myapp.login-url=/login
    // myapp.logout-url=/logout
    // myapp.register-url=/member/memberInsert.do
    // 이 값들을 인식함
    private String loginUrl;
    private String logoutUrl;
    private String registerUrl;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Autowired
    private UserMapper mapper;

    /**
     * 일반 form 로그인 사용자의 정보 조회 UserMapper 만듦
     *
     * @return
     */
    @Bean
    public CustomUserDetailsService userDetailsService() {
        CustomUserDetailsService service = new CustomUserDetailsService(mapper);
        return service;
    }

    @Autowired
    private DataSource dataSource;

    /**
     * password encrypt
     *
     * @return
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    private final String[] WHITE_LIST = new String[]{
            "/",
            "/js/**",
            "/html/**",
            "/css/**",
            "/dist/**",
            "/error/**",
            "/meeting/**", // web socket front side
            "/ws/**", // web socket back side
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/v3/api-docs.yaml",
            "/oauth2/**",
    };

//  @Bean
//  public HttpSessionEventPublisher sessionEventPublisher() {
//    return new HttpSessionEventPublisher();
//  }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new DelegatingSecurityContextRepository(
                new HttpSessionSecurityContextRepository()
                , new RequestAttributeSecurityContextRepository()
        );
    }

    @Bean
    public LogoutHandler logoutHandler() {
        SecurityContextLogoutHandler handler = new SecurityContextLogoutHandler();
        handler.setClearAuthentication(true);
        handler.setInvalidateHttpSession(true);
        return handler;
    }


    /**
     * 공개형과 폐쇄형을 다룸
     *
     * @param http
     * @return
     * @throws Exception
     */
    @Bean
    @Order(2) // /ajax/**를 제외한 /** 밑의 요청들을 filtering
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // 폐쇄형 구조
        http.securityMatcher("/**") // / 밑에 있는 모든 요청들에 filter 작동
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                )
                .addFilterBefore(new JwtSessionInvalidateFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize ->
                                authorize.dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll()
                                        .requestMatchers(WHITE_LIST).permitAll()
                                        .requestMatchers(loginUrl).permitAll()
                                        .requestMatchers(registerUrl).permitAll()
                                        .requestMatchers("/common/auth/**").permitAll()
                                        .requestMatchers("/student/certificate/kakaopay/**").permitAll()
                                        .requestMatchers("/student/certificate/downloadPdf").permitAll()
                                        .requestMatchers(new AntPathRequestMatcher("/mypage")).authenticated()
// 					  .requestMatchers(new AntPathRequestMatcher("/staff/**")).hasRole("STAFF")
//						.requestMatchers(new AntPathRequestMatcher("/professor/**")).hasRole("PROF")
//						.requestMatchers(new AntPathRequestMatcher("/buyer/**")).hasRole("ADMIN").anyRequest()
//						.authenticated()
                                        .requestMatchers("/**").authenticated()
                ).sessionManagement(session ->
                        session.sessionFixation(fixation ->
                                        fixation.newSession()) // 주의* 세션 속성이
                                // 유지되지 않음
                                .maximumSessions(1)
                                .maxSessionsPreventsLogin(false) // false면 새롭게 로그인 하는 사람이 우선권을 가짊
                                .expiredUrl(loginUrl + "?expired"))
                .formLogin(login ->
                                login
                                        .loginPage(loginUrl)
//                    				              .loginProcessingUrl(loginUrl)
//                    				              .failureUrl(loginUrl + "?error")
//                    				              .defaultSuccessUrl("/", false)
                )
                .requestCache(requestCache -> requestCache.requestCache(requestCache()))
                .logout(logout -> logout
                        .logoutUrl(logoutUrl)
                        .deleteCookies(CookieBearerTokenResolver.ACCESSTOKENCOOKIE));

        return http.build();
    }

    @Bean
    public AntPathMatcher antPathMatcher() {
        return new AntPathMatcher();
    }

    @Bean
    public RequestCache requestCache() {
        HttpSessionRequestCache cache = new HttpSessionRequestCache() {
            @Override
            public void saveRequest(HttpServletRequest request, HttpServletResponse response) {
                if (!antPathMatcher().match("/.well-known/**", request.getRequestURI())) {
                    super.saveRequest(request, response); // /.well-known/** <- 이 주소는 cache를 저장안 함
                }
            }
        };
        return cache;
    }
}
