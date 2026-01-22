package kr.ac.hannam.multi.cricket.car.carRegistration.service;

import kr.ac.hannam.multi.cricket.common.file.service.AwsS3Service;
import kr.ac.hannam.multi.cricket.common.mapper.CarsMapper;
import kr.ac.hannam.multi.cricket.dto.CarRegisterDTO;
import kr.ac.hannam.multi.cricket.mapper.CarBrandsMapper;
import kr.ac.hannam.multi.cricket.mapper.CarModelsMapper;
import kr.ac.hannam.multi.cricket.mapper.CarOptionMapMapper;
import kr.ac.hannam.multi.cricket.mapper.CarOptionsMapper;
import kr.ac.hannam.multi.cricket.security.auth.AdminAuthUtil;
import kr.ac.hannam.multi.cricket.security.auth.AdminPrincipal;
import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import kr.ac.hannam.multi.cricket.vo.CarOptionsVO;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class CarRegistrationServiceImpl  implements CarRegistrationService {
    private final CarsMapper carsMapper;
    private final CarOptionsMapper carOptionsMapper;
    private final CarOptionMapMapper carOptionMapMapper;
    private final CarBrandsMapper carBrandsMapper;
    private final CarModelsMapper carModelsMapper;
    private final AwsS3Service awsS3Service;

    @Transactional
    @Override
    public void createCarData(CarRegisterDTO data, List<MultipartFile>  images) {

        CarsVO car = data.getCar();
        String adminNo = AdminAuthUtil.getAdminNo(); //여기에 로그인한 관리자의 adminNO들어감
        log.info(adminNo);
        car.setAdminNo(adminNo);
        if (adminNo == null) {
            throw new IllegalStateException("관리자 인증 정보가 없습니다.");
        }
        car.setAdminNo(adminNo);
        carsMapper.insertCar(car);

        if(data.getOptionIds() != null && !data.getOptionIds().isEmpty()) {
           List<String> uniqueOptionIds = data.getOptionIds().stream()
                   .filter(id -> id != null && !id.isBlank())
                   .distinct()
                   .toList();

           for(String optionId : uniqueOptionIds) {
               carOptionMapMapper.insertCarOptions(car.getCarId(), optionId);
           }
        }

        // 3) 이미지 업로드 + CAR_IMAGES 저장
        //    ⚠ S3는 롤백 안 되므로, 업로드된 키/파일명 기록 후 실패 시 삭제
        if (images == null || images.isEmpty()) return;

        List<String> uploadedKeys = new java.util.ArrayList<>();

        try {
            for (int i = 0; i < images.size(); i++) {
                MultipartFile file = images.get(i);

                // 대표 이미지 1장 지정(예: 첫 번째)
                String isPrimary = (i == 0) ? "Y" : "N";

                // 업로드 후 URL 리턴 + DB 저장까지 awsS3Service가 처리중이므로
                // "삭제용 key"를 얻으려면 uploadCarImage가 key를 반환하거나,
                // url에서 key를 파싱해야 함.
                String url = awsS3Service.uploadCarImage(file, car.getCarId(), isPrimary);

                // url에서 key 추출해서 기록 (삭제 시 필요)
                // https://bucket.s3.ap-northeast-2.amazonaws.com/{key}
                String key = url.substring(url.lastIndexOf("/") + 1);
                uploadedKeys.add(key);
            }
        } catch (Exception e) {
            // ✅ 보상 삭제: 업로드된 S3 객체 삭제 (DB는 @Transactional로 롤백)
            for (String key : uploadedKeys) {
                try {
                    awsS3Service.deleteFile(key);
                } catch (Exception ignore) {}
            }
            throw e;
        }

    }



    @Override
    public List<CarOptionsVO> getOptionList() {
       return carOptionsMapper.selectOptionList();
    }

    @Override
    public List<CarBrandsVO> getBrandList() {
        return carBrandsMapper.selectAllCarBrands();
    }

    @Override
    public List<CarModelsVO> getModelList() {
        return carModelsMapper.selectAllModels();
    }

}
