import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { FaChevronDown } from "react-icons/fa";
import './CarouselComponent.css'; // 반응형 스타일 분리

function CarouselComponent({ onScrollDown }) {
  const navbarHeight = 80;

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000",
      title: "Drive Your Dream",
      desc: "프리미엄 인증 중고차를 가장 안전하게 만나는 방법"
    },
    {
      img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000",
      title: "Quality Guaranteed",
      desc: "전문가들이 직접 검수한 무사고 차량만을 엄선합니다"
    },
    {
      img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=2000",
      title: "Safety First, Detail Always",
      desc: "당신과 가족의 소중한 일상을 위해, 가장 엄격한 안전 기준을 제안합니다"
    }
  ];

  return (
    <div style={{ width: '100%', height: `calc(100vh - ${navbarHeight}px)`, overflow: 'hidden' }}>
      <Carousel fade interval={5000} indicators={true} className="main-carousel">
        {slides.map((slide, idx) => (
          <Carousel.Item key={idx}>
            <div style={{ position: 'relative' }}>
              {/* 어두운 오버레이 */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
                zIndex: 1
              }} />
              <img
                className="d-block w-100"
                style={{
                  height: `calc(100vh - ${navbarHeight}px)`,
                  objectFit: 'cover',
                }}
                src={slide.img}
                alt={slide.title}
              />
              <Carousel.Caption style={{ zIndex: 2, marginBottom: '120px' }}>
                <h1 style={{
                  fontWeight: '800',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)', // 화면 크기에 따라 폰트 조절
                  textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
                  letterSpacing: '-1px'
                }}>
                  {slide.title}
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: '0.9', fontWeight: '400' }}>
                  {slide.desc}
                </p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <div
        className="scroll-down-indicator"
        onClick={onScrollDown}
        style={{ cursor: 'pointer' }} // 마우스를 올리면 손가락 모양으로 변경
      >
        <p className="mb-1">SCROLL DOWN</p>
        <FaChevronDown size={20} className="bounce-arrow" />
      </div>
    </div>
  );
}

export default CarouselComponent;
