import { faCalendarAlt, faClock, faEdit, faEllipsisH, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonGroup, Card, Col, Dropdown, Form, InputGroup, Modal, Row, Table } from '@themesberg/react-bootstrap';
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import Datetime from "react-datetime";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

export default () => {

const link = "http://10.168.1.219:5000/"
const user = useSelector(state => state.users.info);
const [start, setStart] = useState();
const [end, setEnd] = useState();
const [starttime, setStartTime] = useState();
const [endtime, setEndTime] = useState();
const [showModal, setShowModal] = useState(false);
const handleClose = () => setShowModal(false);

const [inputs, setInputs] = useState({
    details: "",
    remarks:""
});

const [reqs, setReqs] = useState([]);

const [checkfield, setCheckfield] = useState({
    details: {},
    remarks: {},
});

const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value },
    setCheckfield({ ...checkfield, [e.target.name]: { valid: !e.target.value ? {isInvalid: true,type:"invalid"} : {isValid: true,type:"valid"} } })
);

const onSubmitForm = async e => {
    e.preventDefault();

    try 
        {

        const othours = moment(end,"YYYY-MM-DD HH:mm").diff(start)
        alert(othours / (3600 * 1000))
        //alert(moment(date + " "+ start).format("YYYY-MM-DD hh:mm a") + " "+moment(start).format("hh:mm a"))
        if(moment(starttime).format("HH:mm") > moment(endtime).format("HH:mm"))
        {
            toast.error("Start Time is greater than End Time.",{
                position: toast.POSITION.TOP_CENTER
            });
            return false;
        }

        if(moment(start).format("YYYY-MM-DD") > moment(end).format("YYYY-MM-DD"))
        {
            toast.error("Start Date is greater than End Date.",{
                position: toast.POSITION.TOP_CENTER
            });
            return false;
        }
        
        const body = { 
                        idno: user.idno,
                        com: user.com,
                        datefrom: moment(start).format("YYYY-MM-DD"),
                        dateto: moment(end).format("YYYY-MM-DD"),
                        timefrom:moment(starttime).format("HH:mm:ss"),
                        timeto: moment(endtime).format("HH:mm:ss"),
                        details: inputs.details,
                        remarks:inputs.remarks 
                    };
        const response = await fetch(link+"api/v1/request/obaddrequest",
        {
            method: "POST",
            headers: { jwt_token: localStorage.token,"Content-type": "application/json" },
            body: JSON.stringify(body)
        }
        );

        setInputs({
        details:"",
        remarks:""
        })

        const parseRes = await response.json();

        if(response.status == 505)
        {
            toast.error(parseRes,{
                position: toast.POSITION.TOP_CENTER,
            });
            return false;
        }
        
        
        //console.log(response.status);
        if(parseRes.status == 200)
        {
        toast.success(parseRes.alert,{
            position: toast.POSITION.TOP_CENTER
        });
        }
        else if(parseRes.status == 505)
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
        
          const res = await fetch(link+"api/v1/request/obgetallrequest", {
          method: "GET",
          headers: { jwt_token: localStorage.token }
          });

        if(res.status === 403)
        {
            toast.error('Invalid Request!',{
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

  const test = async e => {
      //alert(e.target.name)
      setShowModal(true)
  }

  useEffect(() => {
    getallreq();
  },[]);

    return (
        <>
            <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-xl-0">
                
                <h4>Official Business</h4>
                </div>
            </div>

            <Card border="light" className="table-wrapper table-responsive shadow-sm">
                <Card.Body className="">
                    <Form onSubmit={onSubmitForm}>
                        <Row className="align-items-center">
                            <Col md={12} className="">
                                <Form.Group id="obreq" className="mb-4">
                                    <Row className="mb-4">
                                        <Col md={1} className="">
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

                                        <Col md={1} className="text-center">
                                            <Form.Label>To</Form.Label>
                                        </Col>

                                        <Col md={2} className="">
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
                                        <Col md={1} className="">
                                            <Form.Label>Time</Form.Label>
                                        </Col>

                                        <Col md={2} className="">
                                            <Datetime
                                                onChange={setStartTime}
                                                name="date"
                                                dateFormat={false}
                                                timeConstraints={{minutes: { step:15 }}}
                                                renderInput={(props, openCalendar, closeCalendar) => (
                                                    <InputGroup>
                                                    <InputGroup.Text><FontAwesomeIcon icon={faClock} /></InputGroup.Text>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={starttime ? moment(starttime).format("hh:mm a") : ""}
                                                        placeholder="--:-- --"
                                                        onFocus={openCalendar}
                                                        onChange={closeCalendar}  
                                                        />
                                                        
                                                    </InputGroup>
                                                )} />
                                        </Col>

                                        <Col md={1} className="text-center">
                                            <Form.Label>To</Form.Label>
                                        </Col>

                                        <Col md={2} className="">
                                            <Datetime
                                                onChange={setEndTime}
                                                name="date"
                                                dateFormat={false}
                                                timeConstraints={{minutes: { step:15 }}}
                                                renderInput={(props, openCalendar, closeCalendar) => (
                                                    <InputGroup>
                                                    <InputGroup.Text><FontAwesomeIcon icon={faClock} /></InputGroup.Text>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={endtime ? moment(endtime).format("hh:mm a") : ""}
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
                                    <Table hover className="user-table align-items-center">
                                        <thead className="thead-light">
                                            <tr>
                                                <th className="border-0">Transaction #</th>
                                                <th className="border-0">Date From</th>
                                                <th className="border-0">Date To</th>
                                                <th className="border-0">Time From</th>
                                                <th className="border-0">Time To</th>
                                                <th className="border-0">Details</th>
                                                <th className="border-0">Remarks</th>
                                                <th className="border-0">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {reqs ? reqs.map((request,i) =>{
                                            return(
                                                <tr key={i}>
                                                    <td>{request.transno}</td>
                                                    <td>{request.datefrom ? moment(request.datefrom).subtract(8,'h').format("YYYY-MM-DD") : ""}</td>
                                                    <td>{request.dateto ? moment(request.dateto).subtract(8,'h').format("YYYY-MM-DD") : ""}</td>
                                                    <td>{request.timefrom ? moment(request.timefrom).subtract(7.5,'h').format("hh:mm a") : ""}</td>
                                                    <td>{request.timeto ? moment(request.timeto).subtract(7.5,'h').format("hh:mm a") : ""}</td>
                                                    <td>{request.details}</td>
                                                    <td>{request.remarks}</td>
                                                    <td>
                                                        <Dropdown as={ButtonGroup}>
                                                            <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
                                                            <span className="icon icon-sm">
                                                                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
                                                            </span>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                            <Dropdown.Item name={request.transno} value={request.transno} onClick={ e => test(e)}>
                                                                <FontAwesomeIcon icon={faEye} className="me-2" /> View Details
                                                            </Dropdown.Item>
                                                            <Dropdown.Item>
                                                                <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className="text-danger">
                                                                <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Remove
                                                            </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            )}) : ""}
                                        </tbody>
                                    </Table>
                                </Form.Group>
                                <Form.Group>
                                <Modal as={Modal.Dialog} centered show={showModal} onHide={handleClose}>
                                    <Modal.Header>
                                        <Modal.Title className="h6">Details</Modal.Title>
                                        <Button variant="close" aria-label="Close" onClick={handleClose} />
                                    </Modal.Header>
                                    <Modal.Body>
                                        
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                        I Got It
                                    </Button>
                                        <Button variant="link" className="text-gray ms-auto" onClick={handleClose}>
                                        Close
                                    </Button>
                                    </Modal.Footer>
                                    </Modal>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}