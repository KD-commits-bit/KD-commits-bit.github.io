package kr.ac.hannam.multi.cricket.common.oauth;

import kr.ac.hannam.multi.cricket.common.mapper.UserMapper;
import kr.ac.hannam.multi.cricket.register.mapper.RegisterMapper;
import kr.ac.hannam.multi.cricket.vo.UserVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@Slf4j
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RegisterMapper registerMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("=== OAuth2 loadUser 시작! ===");

        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // 1. 서비스 공급자 구분 (google, kakao)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // 2. 유저 정보 attributes 가져오기
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = "";
        String name = "";

        // 3. 공급자별 데이터 추출 로직 분기
        if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            Map<String, Object> kakaoProfile = (Map<String, Object>) kakaoAccount.get("profile");

            email = (String) kakaoAccount.get("email");
            name = (String) kakaoProfile.get("nickname");

            log.info("카카오 유저 정보 추출 - 이메일: {}, 이름: {}", email, name);
        } else if ("naver".equals(registrationId)) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            email = (String) response.get("email");
            name = (String) response.get("nickname");
        } else {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");

            log.info("구글 유저 정보 추출 - 이메일: {}, 이름: {}", email, name);
        }

        // 4. DB 확인 및 저장
        UserVO user = saveOrUpdate(email, name, registrationId);

        String role = (email != null && email.equals("admin@example.com")) ? "ROLE_ADMIN" : "ROLE_USER";


        String userNameAttributeName = getAttributeName(userRequest, registrationId);

        log.info("최종 결정된 userNameAttributeName: {}", userNameAttributeName);


        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(role)),
                attributes,
                userNameAttributeName
        );
    }

    private static String getAttributeName(OAuth2UserRequest userRequest, String registrationId) {
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        if (userNameAttributeName == null) {
            if ("naver".equals(registrationId)) {
                userNameAttributeName = "response";
            } else if ("kakao".equals(registrationId)) {
                userNameAttributeName = "id";
            } else {
                userNameAttributeName = "sub"; // 구글 기본값
            }
        }
        return userNameAttributeName;
    }

    private UserVO saveOrUpdate(String email, String name, String provider) {
        try {
            return userMapper.findByEmail(email)
                    .orElseGet(() -> {
                        log.info("신규 {} 유저 등록 시작: {}", provider, email);
                        UserVO newUser = new UserVO();
                        newUser.setUserEmail(email);
                        newUser.setUserName(name);
                        newUser.setUserPassword("{noop}OAUTH2_" + java.util.UUID.randomUUID());
                        newUser.setUserPhone("010-0000-0000");
                        newUser.setUserRegion("미지정");

                        registerMapper.insertUser(newUser);
                        log.info("신규 {} 유저 등록 완료: {}", provider, email);

                        return newUser;
                    });
        } catch (Exception e) {
            log.error("DB 저장 중 에러 발생!!! : ", e);
            throw new OAuth2AuthenticationException("데이터베이스 저장 실패");
        }
    }
}