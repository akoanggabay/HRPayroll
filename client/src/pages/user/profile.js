import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Form, InputGroup, Row } from '@themesberg/react-bootstrap';
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import Datetime from "react-datetime";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { Link } from "../../link";

export default () => {

const link = "http://10.168.1.219:5000/"
const user = useSelector(state => state.users.info);
const [datehired, setDatehired] = useState();
const [end, setEnd] = useState();
const [starttime, setStartTime] = useState();
const [endtime, setEndTime] = useState();
const [type, setType] = useState([]);
const [showModal, setShowModal] = useState(false);
const handleClose = () => setShowModal(false);

const [inputs, setInputs] = useState({});

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

        const body = { 
                        idno: user.idno,
                        datehired: moment(datehired).format("YYYY-MM-DD"),
                        name:inputs.name,
                        title:inputs.title,
                        dept:inputs.dept

                    };
        const response = await fetch(Link+"api/v1/user/saveprofile",
        {
            method: "POST",
            headers: { jwt_token: localStorage.token,"Content-type": "application/json" },
            body: JSON.stringify(body)
        }
        );

        
        //const parseRes = await response.json();
        //console.log(response.status);
        if(response.status == 505)
        {
            toast.error('Cannot process your transaction request!',{
                position: toast.POSITION.TOP_CENTER,
            });
            return false;
        }
        
        
        
        if(response.status == 200)
        {
            toast.success('Successfully Updated!',{
                position: toast.POSITION.TOP_CENTER
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

async function getprofile() {
    
    //console.log(user.idno)
    try {
      
        const res = await fetch(Link+"api/v1/user/getprofile", {
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
      //console.log(parseRes.res[0][0].HIREDDAY);
      setDatehired(parseRes.res[0][0].HIREDDAY)
      setInputs({
          name: parseRes.res[0][0].NAME,
          dept: parseRes.res[0][0].DEPT,
          title: parseRes.res[0][0].POSITION
      })
      //setReqs(parseRes.res);
      
    } catch (err) {
      //console.error(err.message);
    }
  
  
};

const getdept = async () => {
    try {
      const res = await fetch(Link+"api/v1/dropdown/dept", {
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

  let deptlist = type.length > 0
    && type.map((item, i) => {
  return (
    <option key={i} value={item.dept}>{item.dept}</option>
  )});

  useEffect(() => {
    getprofile();
    getdept();
  },[]);

    return (
        <>
            <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-xl-0">
                
                <h4>Edit Profile</h4>
                </div>
            </div>

            <Card border="light" className="table-wrapper table-responsive shadow-sm">
                <Card.Body className="">
                    <Form onSubmit={onSubmitForm}>
                        <Row className="align-items-center">
                            <Col md={12} className="">
                                <Form.Group id="req" className="">
                                    <Row className="mb-4">
                                        <Col md={2} className="">
                                            <Form.Label>Date Hired</Form.Label>
                                        </Col>

                                        <Col md={3} className="">
                                            <Datetime
                                                onChange={setDatehired}
                                                name="date"
                                                timeFormat={false}
                                                renderInput={(props, openCalendar, closeCalendar) => (
                                                    <InputGroup>
                                                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={datehired ? moment(datehired).format("YYYY-MM-DD") : ""}
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
                                            <Form.Label>Name:</Form.Label>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Control required type="text" name="name" value={inputs.name} onChange={e => onChange(e)} />
                                        </Col>
                                    </Row>

                                    <Row className="mb-4">
                                        <Col md={2}>
                                            <Form.Label>Position:</Form.Label>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Control required type="text" name="title" value={inputs.title} onChange={e => onChange(e)} />
                                        </Col>
                                    </Row>

                                    <Row className="mb-4">
                                        <Col md={2}>
                                            <Form.Label>Department:</Form.Label>
                                        </Col>
                                        <Col md={3} className="">
                                            <Form.Select autoFocus required name="dept" value={inputs.dept} onChange={e => onChange(e)}>
                                                <option></option>
                                                {deptlist}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Col md={1}>
                                        <Button variant="primary" type="submit" className="w-100">
                                            Save
                                        </Button>
                                    </Col>
                                </Form.Group>

                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}