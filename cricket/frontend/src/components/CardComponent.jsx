import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import React, { useMemo } from "react";

function CardComponent({ car }) { // Destructure 'car' directly from props
  console.log("CardComponent received car:", car);

  const navigate = useNavigate();

  const images = useMemo(() => car?.carImages || [], [car]);

  const mainImageUrl =
    images.find((img) => img.isPrimary === "Y")?.carImageId ||
    images[0]?.carImageId ||
    "https://via.placeholder.com/300x180?text=No+Image";

  const handleDetailClick = () => {
    navigate(`/cars/${car.carId}`);
  };
  return (
    <Card style={{width: '18rem', margin: '30px'}}>
      <Card.Img variant="top" src={mainImageUrl} alt={car.carModels?.modelName || "Car Image"} style={{height: '180px', objectFit: 'cover'}} />
      <Card.Body>
        <Card.Title>{car.carBrands?.brandName} {car.carModels?.modelName}</Card.Title> {/* Display brandName and modelName */}
        <Card.Text>
          {car.carDescription || "No description available."} <br/><br/>
          {car.carPrice || "Price not available"} <br/>
          {car.carYear || "Year not available"}년 <br/>
        </Card.Text>
        <Button variant="primary" onClick={handleDetailClick}>상세보기</Button>
      </Card.Body>
    </Card>
  );
}

export default CardComponent;
