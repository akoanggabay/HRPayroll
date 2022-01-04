import { Card, Col, Form, Row } from '@themesberg/react-bootstrap';
import React, { useEffect, useState } from "react";
import { Link } from "../../link";
export default () => {
    console.log(Link)
    const [type, setType] = useState([]);
    const [inputs, setInputs] = useState({
        type: "",
        remarks:""
    });
    const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value },
    );
    
    const getleavetype = async () => {
        try {
          const res = await fetch(Link+"api/v1/dropdown/leave", {
            method: "GET",
            headers: { jwt_token: localStorage.token }
          });
          
          const parseRes = await res.json();
          console.log(parseRes);
          setType(parseRes.res);
          
        } catch (err) {
          console.error(err.message);
        }
      };

      let typelist = type.length > 0
    	&& type.map((item, i) => {
      return (
        <option key={i} value={item.leavecode}>{item.description}</option>
      )});

useEffect(() => {
    getleavetype();
}, []);
return (
        <>
            <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-xl-0">
                
                <h4>Leave</h4>
                </div>
            </div>

            <Card border="light" className="table-wrapper table-responsive shadow-sm">
                <Card.Body className="">
                    <Form>
                        <Row className="align-items-center">
                            <Col md={12} className="">
                                <Form.Group className="mb-4">
                                    <Row className="mb-4">
                                        <Col md={2} className="">
                                            <Form.Label>Leave Type</Form.Label>
                                        </Col>

                                        <Col md={4} className="">
                                            <Form.Select autoFocus required name="type" onChange={e => onChange(e)}>
                                                <option></option>
                                                {typelist}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <fieldset>
                                            <Form.Check
                                                defaultChecked
                                                type="radio"
                                                defaultValue="option1"
                                                label="Default radio"
                                                name="exampleRadios"
                                                id="radio1"
                                                htmlFor="radio1"
                                            />

                                            <Form.Check
                                                type="radio"
                                                defaultValue="option2"
                                                label="Second default radio"
                                                name="exampleRadios"
                                                id="radio2"
                                                htmlFor="radio2"
                                            />

                                        </fieldset>
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}