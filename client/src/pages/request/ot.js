import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Form, InputGroup, Row, Table } from '@themesberg/react-bootstrap';
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import Datetime from "react-datetime";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";


const link = "http://10.168.1.219:5000/"

export default () => {
    const user = useSelector(state => state.users.info);
    const [start, setStart] = useState();
    const [date, setDate] = useState();
    const [end, setEnd] = useState();
    const [inputs, setInputs] = useState({
        details: "",
        remarks:""
    });
    const [checkfield, setCheckfield] = useState({
        details: {},
        remarks: {},
    });
    const [reqs, setReqs] = useState([]);
    const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value },
    setCheckfield({ ...checkfield, [e.target.name]: { valid: !e.target.value ? {isInvalid: true,type:"invalid"} : {isValid: true,type:"valid"} } })
    );

    function addReq() {
        
        setReqs(reqs.concat({
            id: reqs.length + 1,
            start: moment(start).format("HH:mm a"),
            end: moment(end).format("HH:mm a"),
            details: inputs.details,
            remarks:inputs.remarks
        }))
        console.log(reqs)
    }

    

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            //addReq();
            const othours = moment(moment(date).format("YYYY-MM-DD") + " "+moment(end).format("HH:mm"),"YYYY-MM-DD HH:mm").diff(moment(date).format("YYYY-MM-DD") + " "+moment(start).format("HH:mm"))
            //alert(othours / (3600 * 1000))
            //alert(moment(date + " "+ start).format("YYYY-MM-DD hh:mm a") + " "+moment(start).format("hh:mm a"))
            if(moment(start).format("HH:mm") > moment(end).format("HH:mm"))
            {
                toast.error("Start Date is greater than End Date.",{
                    position: toast.POSITION.TOP_CENTER
                });
                return false;
            }
            
            const body = { 
                            idno: user.idno,
                            com: user.com,
                            date: moment(date).format("YYYY-MM-DD"),
                            start:moment(start).format("HH:mm:ss"),
                            end: moment(end).format("HH:mm:ss"),
                            details: inputs.details,
                            remarks:inputs.remarks 
                        };
            const response = await fetch(link+"api/v1/request/otaddrequest",
            {
              method: "POST",
              headers: {
                "Content-type": "application/json"
              },
              body: JSON.stringify(body)
            }
          );

          setInputs({
            details:"",
            remarks:""
            })
            
          const parseRes = await response.json();
          //console.log(parseRes.alert);
          if(response.status == 200)
          {
            toast.success(parseRes.alert,{
                position: toast.POSITION.TOP_CENTER
            });
          }
          else if(response.status == 505)
          {
            toast.error(parseRes.alert,{
                position: toast.POSITION.TOP_CENTER,
            });
          }
          else
          {
            toast.error("Cannot connect to Database.",{
                position: toast.POSITION.TOP_CENTER
            });
          }
          
        } catch (err) {
          console.error(err.message);
        }
        //console.log(logged)
      };

      async function getallreq() {
        
        
          //console.log(user.idno)
          try {
            
              const res = await fetch(link+"api/v1/request/otgetallrequest", {
              method: "GET",
              headers: { jwt_token: localStorage.token }
              });

            if(res.status === 403)
            {
                toast.error('Data request denied!',{
                    position: toast.POSITION.TOP_CENTER
                });
                return false;
            }
            const parseRes = await res.json();
            //console.log(parseRes.res);
            setReqs(parseRes.res);
            
          } catch (err) {
            //console.error(err.message);
          }
        
        
      };

      useEffect(() => {
        getallreq();
      },[]);
// END OF FUNCTION ----------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <>
        <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
            <div className="d-block mb-4 mb-xl-0">
            
            <h4>Overtime Request</h4>
            </div>
        </div>

        <Card border="light" className="shadow-sm ">
            <Card.Body className="">
                <Form onSubmit={onSubmitForm}>
                    <Row className="align-items-center">
                        <Col md={12} className="">
                            <Form.Group id="otreq">
                                <Row>
                                    <Col md={12} className="">
                                        <Form.Group id="start" className="mb-4">
                                            <Row>
                                                <Col md={1} className="mb-4">
                                                    <Form.Label>Date</Form.Label>
                                                </Col>
                                                <Col md={2} className="">
                                                    <Datetime
                                                    onChange={setDate}
                                                    name="date"
                                                    timeFormat={false}
                                                    renderInput={(props, openCalendar, closeCalendar) => (
                                                        <InputGroup>
                                                        <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                                        <Form.Control
                                                            className="text-center"
                                                            required
                                                            type="text"
                                                            value={date ? moment(date).format("YYYY-MM-DD") : ""}
                                                            placeholder="YYYY-MM-DD"
                                                            onFocus={openCalendar}
                                                            onChange={closeCalendar}  
                                                            />
                                                            
                                                        </InputGroup>
                                                    )} />
                                                </Col>
                                                
                                            </Row>

                                            <Row>
                                                <Col md={1} className="mb-4">
                                                    <Form.Label>Time:</Form.Label>
                                                </Col>
                                                <Col md={2} className="text-center">
                                                    <Datetime
                                                    onChange={setStart}
                                                    dateFormat={false}
                                                    timeConstraints={{minutes: { step:15 }}}
                                                    renderInput={(props, openCalendar, closeCalendar) => (
                                                        <InputGroup>
                                                        <InputGroup.Text><FontAwesomeIcon icon={faClock} /></InputGroup.Text>
                                                        <Form.Control
                                                            className="text-center"
                                                            required
                                                            type="text"
                                                            value={start ? moment(start).format("hh:mm a") : ""}
                                                            placeholder="--:-- --"
                                                            onFocus={openCalendar}
                                                            onChange={closeCalendar}
                                                            />
                                                            
                                                        </InputGroup>
                                                    )} />
                                                    <Form.Control.Feedback type={checkfield.details.type}></Form.Control.Feedback>
                                                </Col>
                                                <Col md={1} className="text-center">
                                                    <Form.Label>To </Form.Label>
                                                </Col>
                                                <Col md={2} className="text-center">
                                                    <Datetime
                                                    onChange={setEnd}
                                                    dateFormat={false}
                                                    timeConstraints={{minutes: { step:15 }}}
                                                    renderInput={(props, openCalendar, closeCalendar) => (
                                                        <InputGroup>
                                                        <InputGroup.Text><FontAwesomeIcon icon={faClock} /></InputGroup.Text>
                                                        <Form.Control
                                                            className="text-center"
                                                            required
                                                            type="text"
                                                            value={end ? moment(end).format("hh:mm a") : ""}
                                                            placeholder="--:-- --"
                                                            onFocus={openCalendar}
                                                            onChange={closeCalendar}  
                                                            />
                                                            
                                                        </InputGroup>
                                                    )} />
                                                </Col>
                                            </Row>
                                                
                                            <Row>
                                                <Col md={1} className="mb-4">
                                                    <Form.Label>Details:</Form.Label>
                                                </Col>
                                                <Col md={7}>
                                                    <Form.Control required {...checkfield.details.valid} type="text" name="details" value={inputs.details} onChange={e => onChange(e)} />
                                                    <Form.Control.Feedback type={checkfield.details.type}></Form.Control.Feedback>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={1} className="mb-4">
                                                    <Form.Label>Remarks:</Form.Label>
                                                </Col>
                                                <Col md={7}>
                                                    <Form.Control {...checkfield.remarks.valid} type="text" name="remarks" value={inputs.remarks} onChange={e => onChange(e)} />
                                                    <Form.Control.Feedback type={checkfield.remarks.type}></Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                            <Col md={1}>
                                                <Button variant="primary" type="submit" className="w-100">
                                                    Add
                                                </Button>
                                            </Col>
                                            
                                        </Form.Group>
                                        <Form.Group>
                                            <Table responsive className="table-centered table-nowrap rounded mb-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th className="border-0">Transaction #</th>
                                                        <th className="border-0">Date</th>
                                                        <th className="border-0">From</th>
                                                        <th className="border-0">To</th>
                                                        <th className="border-0">Details</th>
                                                        <th className="border-0">Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reqs ? reqs.map((request,i) =>{

                                                    return(
                                                        <tr key={i}>
                                                            <td>{request.transno}</td>
                                                            <td>{request.date ? moment(request.date).subtract(8,'h').format("YYYY-MM-DD") : ""}</td>
                                                            <td>{request.starttime ? moment(request.starttime).subtract(8,'h').format("hh:mm a") : ""}</td>
                                                            <td>{request.endtime ? moment(request.endtime).subtract(8,'h').format("hh:mm a") : ""}</td>
                                                            <td>{request.details}</td>
                                                            <td>{request.remarks}</td>
                                                        </tr>
                                                    )}) : ""}
                                                </tbody>
                                            </Table>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    </>
    );
}