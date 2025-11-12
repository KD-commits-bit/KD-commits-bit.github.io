package kr.ac.hannam.multi.cricket.common.file.controller;

import kr.ac.hannam.multi.cricket.common.file.service.AwsS3Service;
import lombok.RequiredArgsConstructor;
import oracle.ucp.proxy.annotation.Post;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class AwsS3Controller {
    private final AwsS3Service awsS3Service;



    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("multipartFile") MultipartFile multipartFile) {
        String fileUrl = awsS3Service.uploadFile(multipartFile);
        return ResponseEntity.ok(fileUrl);
    }


    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> listFiles(
            @RequestParam(required = false) String carId
    ) {
        List<Map<String, Object>> images = awsS3Service.getCarImages(carId);
        return ResponseEntity.ok(images);
    }


    @DeleteMapping
    public ResponseEntity<String> deleteFile(@RequestParam String fileName) {
        awsS3Service.deleteFile(fileName);
        return ResponseEntity.ok("삭제 완료: " + fileName);
    }




}
