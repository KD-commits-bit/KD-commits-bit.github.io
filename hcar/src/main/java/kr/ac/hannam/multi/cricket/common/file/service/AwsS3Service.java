package kr.ac.hannam.multi.cricket.common.file.service;

import jakarta.annotation.PostConstruct;
import kr.ac.hannam.multi.cricket.common.mapper.FileMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AwsS3Service {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    private final S3Client s3Client;
    private final FileMapper fileMapper;

    public String uploadFile(MultipartFile multipartFile) {
        String fileName = createFileName(multipartFile.getOriginalFilename());
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileName)
                    .contentType(multipartFile.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(multipartFile.getBytes()));

            String fileUrl = String.format("https://%s.s3.ap-northeast-2.amazonaws.com/%s", bucket, fileName);
            log.info("fileUrl: {}", fileUrl);
            return fileUrl;

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드 실패: " + multipartFile.getOriginalFilename());
        }
    }

    public String uploadCarImage(MultipartFile multipartFile, String carId, String isPrimary) {
        String fileName = createFileName(multipartFile.getOriginalFilename());
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileName)
                    .contentType(multipartFile.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(multipartFile.getBytes()));

            String fileUrl = String.format("https://%s.s3.ap-northeast-2.amazonaws.com/%s", bucket, fileName);

            fileMapper.insertCarImage(fileUrl, carId, isPrimary);
            log.info("차량 이미지 업로드 및 DB 저장 완료: {}", fileUrl);

            return fileUrl;

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "파일 업로드 실패: " + multipartFile.getOriginalFilename());
        } catch (Exception e) {
            log.error("DB 저장 실패", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "DB 저장 실패");
        }
    }

    private String createFileName(String fileName) {
        return UUID.randomUUID().toString().concat(getFileExtension(fileName));
    }

    private String getFileExtension(String fileName) {
        try {
            return fileName.substring(fileName.lastIndexOf("."));
        } catch (StringIndexOutOfBoundsException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 파일 형식: " + fileName);
        }
    }


    public List<Map<String, Object>> getCarImages(String carId) {
        if (carId != null && !carId.isEmpty()) {
            return fileMapper.selectCarImagesByCarId(carId);
        } else {
            return fileMapper.selectCarImages();
        }
    }
    public void deleteFile(String fileName) {
        try {

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileName)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
            log.info("S3 파일 삭제 완료: {}", fileName);


            String fileUrl = String.format("https://%s.s3.ap-northeast-2.amazonaws.com/%s", bucket, fileName);
            fileMapper.deleteCarImage(fileUrl);
            log.info("DB 기록 삭제 완료: {}", fileUrl);

        } catch (Exception e) {
            log.error("파일 삭제 실패", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 삭제 실패");
        }
    }

    @PostConstruct
    public void testS3Access() {
        try {
            s3Client.listBuckets().buckets().forEach(b -> log.info("Bucket: {}", b.name()));
        } catch (Exception e) {
            log.error("S3 접근 실패", e);
        }
    }
}

