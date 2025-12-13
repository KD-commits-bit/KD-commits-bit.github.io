package kr.ac.hannam.multi.cricket.car.carRegistration.service;

import kr.ac.hannam.multi.cricket.dto.CarRegisterDTO;
import kr.ac.hannam.multi.cricket.vo.CarBrandsVO;
import kr.ac.hannam.multi.cricket.vo.CarModelsVO;
import kr.ac.hannam.multi.cricket.vo.CarOptionsVO;
import kr.ac.hannam.multi.cricket.vo.CarsVO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CarRegistrationService {
    public void createCarData(CarRegisterDTO data,  List<MultipartFile> images);
    public List<CarOptionsVO> getOptionList();
    public List<CarBrandsVO> getBrandList();
    public List<CarModelsVO> getModelList();
}
