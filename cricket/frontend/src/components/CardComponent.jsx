import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function CardComponent() {
  return (
    <Card style={{ width: '18rem', margin: '30px' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>무슨무슨 자동차</Card.Title>
        <Card.Text>
          상세 설명 <br></br>
          1000만원 <br></br>
          데이터베이스에서 사진이랑 차 이름 꺼내와야됨 ㅋㅋ <br></br>
          이 컴포넌트를 db에 있는 자동차 갯수만큼 반복하면 되겠죠 ?
        </Card.Text>
        <Button variant="primary">상세보기</Button>
      </Card.Body>
    </Card>
  );
}

export default CardComponent;
