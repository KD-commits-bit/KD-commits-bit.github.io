import React, {useEffect, useState, forwardRef} from 'react';
import {Container, Row, Col, Form, Button, InputGroup} from "react-bootstrap";
import {FaSearch, FaCheck} from "react-icons/fa";
import axios from "axios";
import "../css/SearchSection.css";

// 컴포넌트 전체를 forwardRef로 감싸야 합니다.
const SearchSection = forwardRef(({setCars, resultSectionRef}, ref) => {
  const hashtags = ["더 뉴 그랜저", "G80 (RG3)", "GV80", "그랜저 IG", "K5 3세대"];
  const [activeTab, setActiveTab] = useState("wanted");
  const [origin, setOrigin] = useState("국산");
  const [allBrands, setAllBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("9999");

  useEffect(() => {
    axios.get("/api/search/brandList")
      .then((res) => setAllBrands(res.data))
      .catch((err) => console.error("브랜드 목록 로딩 실패:", err));
  }, []);

  useEffect(() => {
    const filtered = origin === "국산"
      ? allBrands.filter(b => b.brandId.startsWith("KR"))
      : allBrands.filter(b => !b.brandId.startsWith("KR"));
    setFilteredBrands(filtered);
    setSelectedBrand("");
    setModels([]);
  }, [origin, allBrands]);

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    if (brandId) {
      axios.get(`/api/search/modelList/${brandId}`)
        .then((res) => setModels(res.data))
        .catch((err) => console.error("모델 목록 로딩 실패:", err));
    } else {
      setModels([]);
    }
  };

  const handleModelChange = (e) => {
    const brandId = e.target.value;

    setSelectedModel(brandId);
  }

  const getTabStyle = (tabName) => ({
    cursor: "pointer",
    color: activeTab === tabName ? "#3677a6" : "#adb5bd",
    fontWeight: activeTab === tabName ? "700" : "500",
    paddingBottom: "10px",
    borderBottom: activeTab === tabName ? "3px solid #3677a6" : "3px solid transparent",
    transition: "all 0.3s ease"
  });

  const handleSearch = () => {
    if (activeTab === "wanted") {
      if (!selectedModel) {
        alert("모델을 선택해주세요.");
        return;
      }

      axios.get(`/api/search/${selectedModel}`)
        .then((res) => {
          setCars(res.data);
          scrollToResult();
        })
        .catch((err) => console.error("모델 검색 실패", err));
    } else {
      if (!selectedBrand) {
        alert("브랜드를 선택해주세요");
        return;
      }

      axios.get(`/api/search/budget`, {
        params: {
          minPrice: minPrice,
          maxPrice: maxPrice,
          brandId: selectedBrand
        }
      })
        .then((res) => {
          console.log(res.data);
          setCars(res.data);
          scrollToResult();
        })
        .catch((err) => console.error("가격 검색 실패", err));
    }
  }

  const scrollToResult = () => {
    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <section
      ref={ref}
      style={{
        padding: "100px 0 80px 0",
        backgroundColor: "#fcfcfc",
        scrollMarginTop: "70px"
      }}
    >
      <Container>
        {/* 상단 타이틀 섹션 */}
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-4" style={{letterSpacing: "-1px", color: "#222"}}>어떤 차를 찾으세요?</h2>
          <div style={{maxWidth: "650px", margin: "0 auto"}}>
            <InputGroup className="mb-3 shadow-sm rounded-pill"
                        style={{overflow: "hidden", border: "1px solid #eee", backgroundColor: "#fff"}}>
              <Form.Control
                placeholder="모델명을 입력해주세요. 예) 아이오닉5"
                style={{border: "none", boxShadow: "none", padding: "15px 25px", fontSize: "1rem"}}
              />
              <Button variant="white" style={{border: "none", paddingRight: "20px", color: "#3677a6"}}>
                <FaSearch size={20}/>
              </Button>
            </InputGroup>

            <div className="d-flex justify-content-center flex-wrap gap-2 mt-4">
              {hashtags.map((tag, idx) => (
                <Button
                  key={idx}
                  variant="light"
                  className="rounded-pill px-3 py-1 border-0 shadow-sm"
                  style={{fontSize: "13px", backgroundColor: "#fff", color: "#666", transition: "all 0.2s"}}
                >
                  #{tag}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 검색 박스 */}
        <div className="border-0 rounded-4 p-4 p-lg-5 mt-5 shadow" style={{
          backgroundColor: "#fff",
          maxWidth: "1200px",
          margin: "0 auto",
          border: "1px solid rgba(0,0,0,0.05)"
        }}>
          <div className="d-flex justify-content-center gap-5 mb-5 position-relative flex-wrap">
            <div style={getTabStyle("wanted")} onClick={() => setActiveTab("wanted")}>
              {activeTab === "wanted" && <FaCheck className="me-2" size={14}/>}
              원하는 차가 있어요
            </div>
            <p style={{color: 'lightgray'}}>|</p>
            <div style={getTabStyle("budget")} onClick={() => setActiveTab("budget")}>
              {activeTab === "budget" && <FaCheck className="me-2" size={14}/>}
              예산이 정해져 있어요
            </div>
          </div>

          <Row className="g-3 align-items-center">
            <Col lg={3} md={6}>
              <Form.Label className="small fw-bold text-muted ms-1">구분</Form.Label>
              <Form.Select className="py-2 border-light shadow-sm"
                           style={{borderRadius: "10px", backgroundColor: "#f8f9fa"}} value={origin}
                           onChange={(e) => setOrigin(e.target.value)}>
                <option value="국산">국산차</option>
                <option value="수입">수입차</option>
              </Form.Select>
            </Col>

            <Col lg={3} md={6}>
              <Form.Label className="small fw-bold text-muted ms-1">제조사</Form.Label>
              <Form.Select className="py-2 border-light shadow-sm" style={{borderRadius: "10px"}} value={selectedBrand}
                           onChange={handleBrandChange}>
                <option value="">브랜드 선택</option>
                {filteredBrands.map((brand) => (
                  <option key={brand.brandId} value={brand.brandId}>{brand.brandName}</option>
                ))}
              </Form.Select>
            </Col>

            {activeTab === "wanted" ? (
              <Col lg={3} md={6}>
                <Form.Label className="small fw-bold text-muted ms-1">모델</Form.Label>
                <Form.Select className="py-2 border-light shadow-sm" style={{borderRadius: "10px"}}
                             value={selectedModel} onChange={handleModelChange}>
                  <option value="">모델 선택</option>
                  {models.map((m) => (
                    <option key={m.modelId} value={m.modelId}>{m.modelName}</option>
                  ))}
                </Form.Select>
              </Col>
            ) : (
              <Col lg={3} md={6}>
                <Form.Label className="small fw-bold text-muted ms-1">가격 범위</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Form.Select
                    className="py-2 border-light shadow-sm"
                    style={{borderRadius: "10px"}}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  >
                    <option value="">최소 금액</option>
                    <option value="0">0원</option>
                    <option value="3000">3,000만원</option>
                    <option value="4000">4,000만원</option>
                    <option value="5000">5,000만원</option>
                    <option value="6000">6,000만원</option>
                    <option value="7000">7,000만원</option>
                    <option value="8000">8,000만원</option>
                  </Form.Select>
                  <span className="text-muted">~</span>
                  <Form.Select
                    className="py-2 border-light shadow-sm"
                    style={{borderRadius: "10px"}}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  >
                    <option value="">최대 금액</option>
                    <option value="3000">3,000만원</option>
                    <option value="4000">4,000만원</option>
                    <option value="5000">5,000만원</option>
                    <option value="6000">6,000만원</option>
                    <option value="7000">7,000만원</option>
                    <option value="8000">8,000만원</option>
                    <option value="9999">무제한</option>
                  </Form.Select>
                </div>
              </Col>
            )}

            <Col lg={3} md={12} className="mt-lg-auto">
              <Button
                className="w-100 py-2 fw-bold shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #3677a6 0%, #2a5d82 100%)",
                  border: "none",
                  borderRadius: "10px",
                  height: "50px", // 높이 살짝 키움
                  fontSize: "1.1rem",
                  transition: "transform 0.2s ease"
                }}
                onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
                onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                onClick={() => handleSearch()}
              >
                차량 검색
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
});

export default SearchSection;