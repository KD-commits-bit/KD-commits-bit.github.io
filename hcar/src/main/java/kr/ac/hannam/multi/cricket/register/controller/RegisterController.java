package kr.ac.hannam.multi.cricket.register.controller;

import jakarta.validation.Valid;
import kr.ac.hannam.multi.cricket.dto.RegisterRequestDTO;
import kr.ac.hannam.multi.cricket.register.service.RegisterService;
import kr.ac.hannam.multi.cricket.vo.UserAddressVO;
import kr.ac.hannam.multi.cricket.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/register")
public class RegisterController {
    @Autowired
    private RegisterService registerService;

    @PostMapping
    @Transactional
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO dto) {
        UserVO userVO = getUserVO(dto);

        registerService.createUser(userVO);

        UserAddressVO userAddressVO = getUserAddressVO(dto, userVO);

        registerService.createUserAddress(userAddressVO);

        return new ResponseEntity<>("회원가입 성공", HttpStatus.CREATED);
    }

    private static UserVO getUserVO(RegisterRequestDTO dto) {
        UserVO userVO = new UserVO();

        userVO.setUserName(dto.getUserName());
        userVO.setUserPassword(dto.getUserPassword());
        userVO.setUserEmail(dto.getUserEmail());
        userVO.setUserPhone(dto.getUserPhone());

        return userVO;
    }

    private static UserAddressVO getUserAddressVO(RegisterRequestDTO dto, UserVO userVO) {
        String userNo = userVO.getUserNo();

        UserAddressVO userAddressVO = new UserAddressVO();

        userAddressVO.setUserNo(userNo);
        userAddressVO.setZipcode(dto.getZipcode());
        userAddressVO.setSido(dto.getSido());
        userAddressVO.setSigungu(dto.getSigungu());
        userAddressVO.setEupmyundong(dto.getEupmyundong());
        userAddressVO.setRoadName(dto.getRoadName());
        userAddressVO.setAddressLine1(dto.getAddressLine1());
        userAddressVO.setAddressLine2(dto.getAddressLine2());
        userAddressVO.setIsDefault(dto.getIsDefault());

        return userAddressVO;
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean isDuplicated = registerService.isEmailDuplicated(email);

        return ResponseEntity.ok(Collections.singletonMap("isDuplicated", isDuplicated));
    }
}
