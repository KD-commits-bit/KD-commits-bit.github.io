package kr.ac.hannam.multi.cricket.register.controller;

import jakarta.validation.Valid;
import kr.ac.hannam.multi.cricket.register.service.RegisterService;
import kr.ac.hannam.multi.cricket.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/register")
public class RegisterController {
    @Autowired
    private RegisterService registerService;

    @PostMapping
    public ResponseEntity<String> register(@Valid @RequestBody UserVO userVO) {
        registerService.createUser(userVO);
        return new ResponseEntity<>("회원가입 성공", HttpStatus.CREATED);
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean isDuplicated = registerService.isEmailDuplicated(email);

        return ResponseEntity.ok(Collections.singletonMap("isDuplicated", isDuplicated));
    }
}
