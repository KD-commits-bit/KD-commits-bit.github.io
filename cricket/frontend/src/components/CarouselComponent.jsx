import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './CarouselComponent.css'; // 반응형 스타일 분리

function CarouselComponent() {
  const navbarHeight = 80;

  return (
    <div style={{width: '100%', height: `calc(100vh - ${navbarHeight}px)`, overflow: 'hidden'}}>
      <Carousel fade>
        <Carousel.Item>
          <img
            className="carousel-img"
            style={{
              height: `calc(100vh - ${navbarHeight}px)`,
              objectFit: 'cover',
            }}
            src="https://cdn.bhdw.net/im/shooting-karina-from-aespa-live-my-life-mv-shoot-wallpaper-126222_w635.webp"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="carousel-img"
            style={{
              height: `calc(100vh - ${navbarHeight}px)`,
              objectFit: 'cover',
            }}
            src="https://mblogthumb-phinf.pstatic.net/MjAyMzA0MDJfMTMz/MDAxNjgwNDM3MzIxOTE5.01zPmuJ-1JTBkdmjXEPQ2rPZhZB7WAIBxkgi2PXjx98g.sKKe0zyTfNSOtUb2skx6x6qKf9nBnXaqlCJ12nCyT3cg.JPEG.niceguy00/Seul컴_틋_카리나388.jpg?type=w800"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="carousel-img"
            style={{
              height: `calc(100vh - ${navbarHeight}px)`,
              objectFit: 'cover',
            }}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiZF6HD-YkmaIvryiUGWhHFQz4mkCeLcempg&s"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default CarouselComponent;
