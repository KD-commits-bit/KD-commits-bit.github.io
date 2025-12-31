package kr.ac.hannam.multi.cricket.security.auth;

import kr.ac.hannam.multi.cricket.vo.AdminVO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class AdminPrincipal implements UserDetails {

    private AdminVO adminVO;

    public AdminPrincipal(AdminVO adminVO) {
        this.adminVO = adminVO;
    }

    public AdminVO getAdminVO() {
        return adminVO;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    @Override
    public String getPassword() {
        return adminVO.getAdminPassword();
    }

    @Override
    public String getUsername() {
        return adminVO.getAdminEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
