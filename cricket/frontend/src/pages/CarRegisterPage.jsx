// src/pages/CarRegisterPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import "../css/CarRegisterPage.css";
import apiClient from "../api/axios";

function CarRegisterPage() {
  const navigate = useNavigate();

  // ✅ 목록 데이터
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  // ✅ 차량 정보 폼 (DB 맞춤: modelId 사용)
  const [carForm, setCarForm] = useState({
    brandId: "",
    modelId: "",
    carYear: "",
    carMileage: "",
    carPrice: "",
    carDescription: "",
    carStatus: 1,
  });

  // ✅ 옵션
  const [optionsByCategory, setOptionsByCategory] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);

  // ✅ 이미지(여러 장)
  const [imageFiles, setImageFiles] = useState([]); // File[]
  const [primaryIndex, setPrimaryIndex] = useState(0); // 대표 이미지(0번째 기본)

  const [submitting, setSubmitting] = useState(false);

  // 공통 인풋 핸들러
  const handleCarChange = (e) => {
    const { name, value } = e.target;

    // 브랜드 변경 시 모델 초기화
    if (name === "brandId") {
      setCarForm((prev) => ({ ...prev, brandId: value, modelId: "" }));
      return;
    }

     setCarForm((prev) => ({
    ...prev,
    [name]: name === "carStatus" ? Number(value) : value
  }));
  };

  // ✅ 브랜드에 해당하는 모델만 필터
  const filteredModels = useMemo(() => {
    if (!carForm.brandId) return [];
    return models.filter((m) => m.brandId === carForm.brandId);
  }, [models, carForm.brandId]);

  // 옵션 체크박스 변경
  const handleOptionToggle = (optionId) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  // ✅ 이미지 선택
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 최대 10장 (원하면 변경)
    const next = [...imageFiles, ...files].slice(0, 10);
    setImageFiles(next);

    // 대표 인덱스 보정
    if (primaryIndex >= next.length) setPrimaryIndex(0);

    // 같은 파일 다시 선택 가능하게
    e.target.value = "";
  };

  // ✅ 이미지 삭제
  const removeImageAt = (idx) => {
    const next = imageFiles.filter((_, i) => i !== idx);
    setImageFiles(next);

    if (next.length === 0) {
      setPrimaryIndex(0);
      return;
    }
    if (idx === primaryIndex) setPrimaryIndex(0);
    else if (idx < primaryIndex) setPrimaryIndex((p) => Math.max(0, p - 1));
  };

  // ✅ 초기 로딩: 브랜드/모델/옵션
  useEffect(() => {
    apiClient
      .get("/api/admin/car_register/brands")
      .then((res) => setBrands(res.data))
      .catch((err) => {
        console.error("브랜드 목록 불러오기 실패:", err);
        alert("브랜드 목록을 불러오는데 실패했습니다.");
      });

    apiClient
      .get("/api/admin/car_register/models")
      .then((res) => setModels(res.data))
      .catch((err) => {
        console.error("모델 목록 불러오기 실패:", err);
        alert("모델 목록을 불러오는데 실패했습니다.");
      });

    apiClient
      .get("/api/admin/car_register/options")
      .then((res) => {
        const list = res.data;
        const grouped = list.reduce((acc, opt) => {
          const cat = opt.optionCategory || "기타";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(opt);
          return acc;
        }, {});
        setOptionsByCategory(grouped);
      })
      .catch((err) => {
        console.error("옵션 목록 불러오기 실패:", err);
        alert("옵션 목록을 불러오는데 실패했습니다.");
      });
  }, []);

  // 폼 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!carForm.brandId) return alert("브랜드를 선택하세요.");
    if (!carForm.modelId) return alert("모델을 선택하세요.");

    setSubmitting(true);

      console.log("📌 carForm =", carForm);
  console.log("📌 selectedOptions =", selectedOptions);
  console.log("📌 imageFiles =", imageFiles);

    try {
      // ✅ 백엔드 @RequestPart("data")에 들어갈 DTO 형태
      const payload = {
        car: {
          modelId: carForm.modelId,
          carYear: carForm.carYear,
          carMileage: carForm.carMileage,
          carPrice: carForm.carPrice,
          carDescription: carForm.carDescription,
          carStatus: carForm.carStatus,
        },
        optionIds: selectedOptions,
      };

       console.log("📌 payload(JSON) =", payload);

      // ✅ multipart/form-data로 전송 (data + images)
      const formData = new FormData();

      // data 파트는 JSON Blob로 넣어야 @RequestPart로 바인딩 잘 됨
      formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));

      // images 파트 (선택된 파일들)
      // 서버는 @RequestPart("images") List<MultipartFile> 로 받으므로 key는 반드시 "images"
      imageFiles.forEach((file) => formData.append("images", file));

      for (let pair of formData.entries()) {
    console.log("📌 formData:", pair[0], pair[1]);
  }

      // 대표이미지 isPrimary는 지금 백엔드가 images만 받고 있어서
      // (서비스에서 i==0을 Y로 잡고 있음) 프론트는 순서만 맞추면 됨.
      // 대표를 바꾸려면: primaryIndex 파일을 0번째로 재배치해서 보내자.
      if (imageFiles.length > 0 && primaryIndex !== 0) {
        const reordered = [...imageFiles];
        const [picked] = reordered.splice(primaryIndex, 1);
        reordered.unshift(picked);

        // FormData 다시 구성
        const fd2 = new FormData();
        fd2.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
        reordered.forEach((file) => fd2.append("images", file));

        await apiClient.post("/api/admin/car_register", fd2, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await apiClient.post("/api/admin/car_register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("차량이 성공적으로 등록되었습니다.");
      navigate("/admin");
    } catch (err) {
      console.error("차량 등록 실패:", err);
      alert("차량 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용을 취소하고 돌아가시겠습니까?")) {
      navigate(-1);
    }
  };

  return (
    <>
      <NavbarComponent />

      <main className="car-reg-page">
        <form className="car-reg-container" onSubmit={handleSubmit}>
          <header className="car-reg-header">
            <h1>차량 등록</h1>
            <p>브랜드/모델을 선택하고 차량 정보와 옵션을 입력하세요.</p>
          </header>

          <div className="car-reg-grid">
            {/* 왼쪽: 차량 정보 */}
            <section className="card car-info-card">
              <h2 className="card-title">차량 정보</h2>

              <div className="form-row">
                <label>브랜드</label>
                <select name="brandId" value={carForm.brandId} onChange={handleCarChange} required>
                  <option value="">브랜드 선택</option>
                  {brands.map((b) => (
                    <option key={b.brandId} value={b.brandId}>
                      {b.brandName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label>모델</label>
                <select
                  name="modelId"
                  value={carForm.modelId}
                  onChange={handleCarChange}
                  required
                  disabled={!carForm.brandId}
                >
                  <option value="">
                    {carForm.brandId ? "모델 선택" : "브랜드를 먼저 선택하세요"}
                  </option>
                  {filteredModels.map((m) => (
                    <option key={m.modelId} value={m.modelId}>
                      {m.modelName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row-inline">
                <div className="form-row">
                  <label>연식</label>
                  <input
                    
                    name="carYear"
                    value={carForm.carYear}
                    onChange={handleCarChange}
                    placeholder="예: 2021"
                    required
                  />
                </div>
                <div className="form-row">
                  <label>주행거리 (km)</label>
                  <input
                    
                    name="carMileage"
                    value={carForm.carMileage}
                    onChange={handleCarChange}
                    placeholder="예: 35000"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <label>가격 (만원)</label>
                <input
                  
                  name="carPrice"
                  value={carForm.carPrice}
                  onChange={handleCarChange}
                  placeholder="예: 1950"
                  required
                />
              </div>

              <div className="form-row">
                <label>차량 상태</label>
                <select name="carStatus" value={carForm.carStatus} onChange={handleCarChange}>
                    <option value={1}>최상</option>
                    <option value={2}>우수</option>
                    <option value={3}>양호</option>
                    <option value={4}>보통</option>
                </select>
              </div>

              <div className="form-row">
                <label>차량 설명</label>
                <textarea
                  name="carDescription"
                  value={carForm.carDescription}
                  onChange={handleCarChange}
                  rows={5}
                  placeholder="차량의 특징, 관리 상태, 사고 여부 등을 상세히 작성해주세요."
                />
              </div>

              {/* ✅ 이미지 업로드 UI */}
              <div className="form-row">
                <label>차량 이미지</label>
                <input type="file" accept="image/*" multiple onChange={handleImagesChange} />
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                  최대 10장. 대표 이미지를 선택하면 업로드 시 대표로 저장됩니다.
                </p>

                {imageFiles.length > 0 && (
                  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                    {imageFiles.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                          padding: "10px 12px",
                          border: "1px solid #e5e7eb",
                          borderRadius: 10,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <input
                            type="radio"
                            name="primaryImage"
                            checked={primaryIndex === idx}
                            onChange={() => setPrimaryIndex(idx)}
                            title="대표 이미지"
                          />
                          <div style={{ fontSize: 14 }}>
                            <div style={{ fontWeight: 600 }}>{file.name}</div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => removeImageAt(idx)}
                          style={{ padding: "8px 10px" }}
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* 오른쪽: 옵션 */}
            <section className="card option-card">
              <h2 className="card-title">옵션 선택</h2>
              <p className="option-desc">
                차량에 포함된 옵션을 선택하세요. (카테고리별로 분류되어 있습니다)
              </p>

              <div className="option-category-list">
                {Object.entries(optionsByCategory).map(([category, options]) => (
                  <div key={category} className="option-category-block">
                    <div className="option-category-title">{category}</div>
                    <div className="option-list">
                      {options.map((opt) => (
                        <label key={opt.optionId} className="option-item">
                          <input
                            type="checkbox"
                            checked={selectedOptions.includes(opt.optionId)}
                            onChange={() => handleOptionToggle(opt.optionId)}
                          />
                          <div className="option-texts">
                            <span className="option-name">{opt.optionName}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {Object.keys(optionsByCategory).length === 0 && (
                  <p style={{ fontSize: 13, color: "#9ca3af" }}>
                    옵션 정보를 불러오는 중이거나, 등록된 옵션이 없습니다.
                  </p>
                )}
              </div>
            </section>
          </div>

          <footer className="car-reg-actions">
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "등록 중..." : "차량 등록하기"}
            </button>
          </footer>
        </form>
      </main>
    </>
  );
}

export default CarRegisterPage;
