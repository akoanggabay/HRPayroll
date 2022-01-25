import { faCalendarAlt, faClock, faEdit, faEllipsisH, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonGroup, Card, Col, Dropdown, Form, InputGroup, Modal, Row, Table } from '@themesberg/react-bootstrap';
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Datetime from "react-datetime";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { Link } from "../../link";

export default () => {

const link = "http://10.168.1.219:5000/"
const user = useSelector(state => state.users.info);
const [start, setStart] = useState();
const [end, setEnd] = useState();
const [starttime, setStartTime] = useState();
const [endtime, setEndTime] = useState();
const [type, setType] = useState([]);
const [showModal, setShowModal] = useState(false);
const handleClose = () => setShowModal(false);
const [confirm, setConfirm] = useState(false);
const [trans, setTrans] = useState();

const [inputs, setInputs] = useState({
    details: "",
    remarks:"",
    transtype:"",
});

const [editinputs, setEditInputs] = useState({
    edetails:"",
    eremarks:"",
    etransno:""
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

const EonChange = e =>
    setEditInputs({ ...editinputs, [e.target.name]: e.target.value },
    setCheckfield({ ...checkfield, [e.target.name]: { valid: !e.target.value ? {isInvalid: true,type:"invalid"} : {isValid: true,type:"valid"} } })
);

const onSubmitForm = async e => {
    e.preventDefault();

    try 
        {
            //alert(moment.duration(end.diff(start)).asDays())
        const othours = moment(end,"YYYY-MM-DD HH:mm").diff(start)
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
                        remarks:inputs.remarks,
                        nod: moment.duration(end.diff(start)).asDays(),
                        type: inputs.transType
                    };
        const response = await fetch(Link+"api/v1/request/addrequest",
        {
            method: "POST",
            headers: { jwt_token: localStorage.token,"Content-type": "application/json" },
            body: JSON.stringify(body)
        }
        );


        const parseRes = await response.json();
        console.log(parseRes);
        if(response.status == 505)
        {
            toast.error(parseRes.alert,{
                position: toast.POSITION.TOP_CENTER,
            });
            return false;
        }
        
        
        //console.log(response.status);
        if(parseRes.status == 200)
        {
            setInputs({
                details:"",
                remarks:"",
                transtype:""
            })
            setStartTime("");
            setEndTime("");
            setStart("");
            setEnd("");
            getallreq();
            document.getElementById("transtype").value = "";
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
        
          const res = await fetch(Link+"api/v1/request/getallrequest", {
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

  const gettype = async () => {
    try {
      const res = await fetch(Link+"api/v1/dropdown/transaction", {
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
    <option key={i} value={item.code}>{item.description}</option>
  )});

  const Edit = async e => {
      //alert(e.target.name)
      setShowModal(true)
      try {
        const res = await fetch(Link+"api/v1/request/getdetails/"+e.target.name, {
          method: "GET",
          headers: { jwt_token: localStorage.token }
        });
        
        const parseRes = await res.json();
        setEditInputs({
            edetails:parseRes.res[0][0].details,
            eremarks:parseRes.res[0][0].remarks,
            etransno:parseRes.res[0][0].transno
        })
        
      } catch (err) {
        console.error(err.message);
      }
      
  }

  const conf = async (e) => {
    /* if (window.confirm("Delete the item?")) {
        
      } */

    setTrans(e.target.name);
    const c = confirmAlert({
        title: e.target.name,
        message: 'Are you sure you want to Remove this?',
        buttons: [
          {
            label: 'YES',
            onClick: async () => {
        
                //alert(document.getElementById("trans").value)
                try 
                    {
                    
                    const response = await fetch(Link+"api/v1/request/removedetails/"+document.getElementById("trans").value,
                    {
                        method: "PUT",
                        headers: { jwt_token: localStorage.token,"Content-type": "application/json" },
                    }
                    );


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
                        setTrans("")
                        handleClose()
                        getallreq();
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
            }
          },
          {
            label: 'No',
            onClick: () => {
                return false
            }
          }
        ]
      });
  }

  const saveChanges = async e => { 
    e.preventDefault();

    try 
        {
        
        const body = { 
                        details: editinputs.edetails,
                        remarks:editinputs.eremarks,
                        transno:editinputs.etransno
                    };
        const response = await fetch(Link+"api/v1/request/updaterequest",
        {
            method: "PUT",
            headers: { jwt_token: localStorage.token,"Content-type": "application/json" },
            body: JSON.stringify(body)
        }
        );


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
            setEditInputs({
                edetails:"",
                eremarks:"",
                etransno:""
            })
            handleClose()
            getallreq();
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
  }

  useEffect(() => {
    getallreq();
    gettype();
  },[]);

    return (
        <>
            <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-xl-0">
                
                <h4>Request</h4>
                </div>
            </div>

            <Card border="light" className="table-wrapper table-responsive shadow-sm">
                <Card.Body className="">
                    <Form onSubmit={onSubmitForm}>
                        <Row className="align-items-center">
                            <Col md={12} className="">
                                <Form.Group id="req" className="mb-4">
                                    <Row className="mb-4">
                                        <Col md={1} className="">
                                            <Form.Label>Type *</Form.Label>
                                        </Col>

                                        <Col md={5} className="">
                                            <Form.Select autoFocus required name="transType" id="transtype" onChange={e => onChange(e)} >
                                                <option></option>
                                                {typelist}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col md={1} className="">
                                            <Form.Label>Date: *</Form.Label>
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
                                            <Form.Label>Time: *</Form.Label>
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
                                            <Form.Label>Details: *</Form.Label>
                                        </Col>
                                        <Col md={7}>
                                            <Form.Control required {...checkfield.details.valid} type="text" name="details" value={inputs.details} onChange={e => onChange(e)} />
                                            <Form.Control.Feedback type={checkfield.details.type}></Form.Control.Feedback>
                                        </Col>
                                    </Row>

                                    <Row hidden>
                                        <Col md={1} className="mb-4">
                                            <Form.Label>Trans:</Form.Label>
                                        </Col>
                                        <Col md={7}>
                                            <Form.Control type="text" name="trans" id="trans" value={trans} />
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
                                                <tr key={i} value={request.transno}>
                                                    <td>{request.transno}</td>
                                                    <td>{request.datefrom ? moment(request.datefrom).subtract(8,'h').format("YYYY-MM-DD") : ""}</td>
                                                    <td>{request.dateto ? moment(request.dateto).subtract(8,'h').format("YYYY-MM-DD") : ""}</td>
                                                    <td>{request.timefrom ? moment(request.datefrom.split("T")[0] + " " +request.timefrom.split("T")[1].split(".")[0]).format("hh:mm a") : ""}</td>
                                                    <td>{request.timeto ? moment(request.datefrom.split("T")[0] + " " +request.timeto.split("T")[1].split(".")[0]).format("hh:mm a") : ""}</td>
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
                                                            <Dropdown.Item name={request.transno} value={request.transno} onClick={ e => Edit(e)}>
                                                                <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                                                            </Dropdown.Item>
                                                            <Dropdown.Item name={request.transno} value={request.transno} onClick={e => conf(e)}  className="text-danger">
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
                                <Modal as={Modal.Dialog} centered show={showModal} onHide={handleClose} size="lg">
                                    <Modal.Header>
                                        <Modal.Title className="h6">Details</Modal.Title>
                                        <Button variant="close" aria-label="Close" onClick={handleClose} />
                                    </Modal.Header>
                                    <Form onSubmit={saveChanges}>
                                        <Modal.Body>
                                            
                                                <Form.Group>
                                                    <Row className="align-items-center">
                                                        <Col md={12}>
                                                            <Row className="mb-4">
                                                                <Col md={2}>
                                                                    <Form.Label>Transaction #:</Form.Label>
                                                                </Col>
                                                                <Col md={7}>
                                                                    <Form.Control disabled type="text" name="etransno" value={editinputs.etransno} onChange={e => onChange(e)} />
                                                                </Col>
                                                            </Row>
                                                            <Row className="mb-4">
                                                                <Col md={2}>
                                                                    <Form.Label>Details:</Form.Label>
                                                                </Col>
                                                                <Col md={7}>
                                                                    <Form.Control required type="text" name="edetails" value={editinputs.edetails} onChange={e => EonChange(e)} />
                                                                </Col>
                                                            </Row>
                                                            <Row className="mb-4">
                                                                <Col md={2}>
                                                                    <Form.Label>Remarks:</Form.Label>
                                                                </Col>
                                                                <Col md={7}>
                                                                    <Form.Control type="text" name="eremarks" value={editinputs.eremarks} onChange={e => EonChange(e)} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Form.Group>
                                            
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="primary" type="submit">
                                            Save Changes
                                        </Button>
                                            <Button variant="link" className="text-gray ms-auto" onClick={handleClose}>
                                            Close
                                        </Button>
                                        </Modal.Footer>
                                    </Form>
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