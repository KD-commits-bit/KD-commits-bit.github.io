package kr.ac.hannam.multi.cricket.common.controller.dto;

// Java 17의 record를 사용하여 불변 데이터 객체를 간결하게 정의합니다.
public record LoginRequest(String id, String password) {
    public String getId() {
        return this.id;
    }

    public Object getPassword() {
        return this.password;
    }
}
