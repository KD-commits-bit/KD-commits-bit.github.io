package kr.ac.hannam.multi.cricket.security.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JWTProvider {
    @Value("${jwt.secret-key}")
    private byte[] secretKey;
    public static final long VALID_TERM = 1000 * 60 * 30 * 5; // 5 hours

    public String authenticationToToken(Authentication authentication) {
        try {
            JWSSigner signer = new MACSigner(secretKey);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(authentication.getName())
                .issuer("http://www.part8.com")
                .issueTime(new Date())
                .expirationTime(new Date(System.currentTimeMillis() + VALID_TERM))
                .claim("scope", authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()))
                .build();

            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException("Token creation failed", e);
        }
    }

    public Authentication tokenToAuthentication(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(secretKey);

            if (!signedJWT.verify(verifier)) {
                throw new RuntimeException("Token signature verification failed");
            }

            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

            if (new Date().after(claimsSet.getExpirationTime())) {
                throw new RuntimeException("Token has expired");
            }

            String username = claimsSet.getSubject();
            List<String> roles = claimsSet.getStringListClaim("scope");
            List<GrantedAuthority> authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

            return new UsernamePasswordAuthenticationToken(username, null, authorities);

        } catch (ParseException | JOSEException e) {
            throw new RuntimeException("Token parsing or verification failed", e);
        }
    }
}
