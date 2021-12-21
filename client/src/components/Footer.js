
import { Card, Col, Row } from '@themesberg/react-bootstrap';
import React from "react";

export default (props) => {

  const toggleSettings = (toggle) => {
    props.toggleSettings(toggle);
  }

  return (
    <div>
      
      <footer className="footer section py-5">
        <Row>
          <Col xs={12} lg={6} className="mb-4 mb-lg-0">
            <p className="mb-0 text-center text-xl-left">
              Copyright © 2021
              <Card.Link target="_blank" className="text-black text-decoration-none fw-normal">
                
              </Card.Link>
            </p>
          </Col>
          <Col xs={12} lg={6}>
            
          </Col>
        </Row>
      </footer>
    </div>
  );
};
