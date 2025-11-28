import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function CardComponent({ car }) { // Destructure 'car' directly from props
  console.log("CardComponent received car:", car);

  // carImages is now a single object, not an array.
  // Check if car.carImages exists and has carImageId
  const imageUrl = car.carImages && car.carImages.carImageId ? car.carImages.carImageId : "https://via.placeholder.com/150"; // Placeholder image URL

  return (
    <Card style={{width: '18rem', margin: '30px'}}>
      <Card.Img variant="top" src={imageUrl} alt={car.carModels?.modelName || "Car Image"} style={{height: '180px', objectFit: 'cover'}} />
      <Card.Body>
        <Card.Title>{car.carBrands?.brandName} {car.carModels?.modelName}</Card.Title> {/* Display brandName and modelName */}
        <Card.Text>
          {car.carDescription || "No description available."} <br/><br/>
          {car.carPrice || "Price not available"} <br/>
          {car.carYear || "Year not available"}년 <br/>
        </Card.Text>
        <Button variant="primary">상세보기</Button>
      </Card.Body>
    </Card>
  );
}

export default CardComponent;
