import { faCalendarAlt, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Form, InputGroup, Row } from '@themesberg/react-bootstrap';
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Datetime from "react-datetime";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { Link } from "../../link";
export default () => {

    const user = useSelector(state => state.users.info);
    const [start, setStart] = useState(moment().format("YYYY-MM-01"));
    const [end, setEnd] = useState(moment().format("YYYY-MM-")+ moment().daysInMonth());
    const [transtype, setTransType] = useState("");
    const [type, setType] = useState([]);

    async function print() {

        if(moment(start).format("YYYY-MM-DD") > moment(end).format("YYYY-MM-DD"))
        {
            toast.error("Start Date is greater than End Date.",{
                position: toast.POSITION.TOP_CENTER
            });
            return false;
        }
        
        if(transtype === '' || transtype === null)
        {
            toast.error('Please select form type',{
            position: toast.POSITION.TOP_CENTER
            });
            return false;
        }

        const res = await fetch(Link+"api/v1/user/getprofile", {
        
            method: "GET",
            headers: { jwt_token: localStorage.token }
        });

        const parseRes = await res.json();
        //console.log(parseRes.res[0][0])
        if(parseRes.res[0].length === 0)
        {
            toast.error('No data from Biometrics.',{
                position: toast.POSITION.TOP_CENTER
            });
            return false;
        }
        
        if((parseRes.res[0][0].NAME === '' || parseRes.res[0][0].NAME === null) || (parseRes.res[0][0].BADGENUMBER === '' || parseRes.res[0][0].BADGENUMBER === null) || (parseRes.res[0][0].HIREDDAY === '' || parseRes.res[0][0].HIREDDAY === null) || (parseRes.res[0][0].DEPT === '' || parseRes.res[0][0].DEPT === null) || (parseRes.res[0][0].TITLE === '' || parseRes.res[0][0].TITLE === null))
        {
            toast.error('Please complete User Profile under "User" tab!',{
            position: toast.POSITION.TOP_CENTER
            });
            return false;
        }

        window.open('http://10.168.2.8/hr/print/form.php?idno='+user.idno+'&start='+moment(start).format("YYYY-MM-DD")+'&end='+moment(end).format("YYYY-MM-DD")+"&ccode="+user.com+"&type="+transtype);
    }

    const onChange = e =>
        setTransType(e.target.value
    );

    const gettype = async () => {
        try {
          const res = await fetch(Link+"api/v1/dropdown/form", {
            method: "GET",
            headers: { jwt_token: localStorage.token }
          });
          
          const parseRes = await res.json();
          //console.log(parseRes);
          setType(parseRes.res);
          
        } catch (err) {
          console.error(err.message);
        }
      };
    
      let typelist = type.length > 0
        && type.map((item, i) => {
      return (
        <option key={i} value={item.type}>{item.description}</option>
      )});

useEffect(() => {
    gettype();
}, []);
return (
        <>
            <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-xl-0">
                
                <h4>Leave Application Form</h4>
                </div>
            </div>

            <Card border="light" className="table-wrapper table-responsive shadow-sm" style={{height:"600px"}}>
                <Card.Body className="">
                    <Form>
                        <Row className="align-items-center">
                            <Col md={12} className="">
                                <Form.Group className="mb-4">
                                    <Row className="mb-4">
                                        <Col md={1} className="">
                                            <Form.Label>Type</Form.Label>
                                        </Col>

                                        <Col md={2} className="">
                                            <Form.Select autoFocus required name="transType" id="transtype" value={transtype} onChange={e => onChange(e)} >
                                                <option></option>
                                                {typelist}
                                                
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col md={1} className="mb-3">
                                            <Form.Label>Date</Form.Label>
                                        </Col>

                                        <Col md={2} className="">
                                            <Datetime
                                                onChange={setStart}
                                                name="date"
                                                timeFormat={false}
                                                renderInput={(props, openCalendar, closeCalendar) => (
                                                    <InputGroup>
                                                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={start ? moment(start).format("YYYY-MM-DD") : ""}
                                                        placeholder="YYYY-MM-DD"
                                                        onFocus={openCalendar}
                                                        onChange={closeCalendar}  
                                                        />
                                                        
                                                    </InputGroup>
                                                )} />
                                        </Col>

                                        <Col md={1} className="m-3 text-center">
                                            <Form.Label>To</Form.Label>
                                        </Col>

                                        <Col md={2} className="mb-4">
                                            <Datetime
                                                onChange={setEnd}
                                                name="date"
                                                timeFormat={false}
                                                renderInput={(props, openCalendar, closeCalendar) => (
                                                    <InputGroup>
                                                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={end ? moment(end).format("YYYY-MM-DD") : ""}
                                                        placeholder="YYYY-MM-DD"
                                                        onFocus={openCalendar}
                                                        onChange={closeCalendar}  
                                                        />
                                                        
                                                    </InputGroup>
                                                )} />
                                        </Col>
                                        
                                    </Row>

                                    <Row className="mb-4">
                                        <Col md={2}>
                                            <Button variant="tertiary" type="button" className="w-70" style={{float: 'left'}} onClick={print} >
                                                <FontAwesomeIcon icon={faPrint} />  Print Form
                                            </Button>
                                        </Col>
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