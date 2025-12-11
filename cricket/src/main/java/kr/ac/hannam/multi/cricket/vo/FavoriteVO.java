package kr.ac.hannam.multi.cricket.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "favoriteId")
public class FavoriteVO {
    private String favoriteId;
    private String userNo;
    private String carId;
    private String createdAt;
}
