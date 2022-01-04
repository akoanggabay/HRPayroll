
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from '@themesberg/react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/css/jquery.dataTables.min.css";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import 'jquery/dist/jquery.min.js';
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import Datetime from "react-datetime";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import "../../node_modules/react-data-table-component-extensions/dist/index.css";



export const BioLogs = (props) => {
  const btnGen = useRef(null);
  
  const user = useSelector(state => state.users.info);
  const logged = useSelector(state => state.logged.info);
  const [logs, setLogs] = useState([]);
  const [start, setStart] = useState(moment().format("YYYY-MM-01"));
  const [end, setEnd] = useState(moment().format("YYYY-MM-")+ moment().daysInMonth());
  const link = "http://10.168.1.219:5000/"
  
  const columns = [
    {
      name: "Id number",
      selector: row => row["BADGENUMBER"],
      sortable: true
    },
    {
      name: "Date",
      selector: row => row["Date"],
      sortable: true
    },
    {
      name: "Time In",
      selector: row => row["ClockIn"],
      sortable: true,
    },
    {
      name: "ClockInType",
      selector: row => row["ClockInType"],
      sortable: true
    },
    {
      name: "ClockOut",
      selector: row => row["ClockOut"],
      sortable: true
    },
    {
      name: "ClockOutType",
      selector: row => row["ClockOutType"],
      sortable: true
    }
  ];

  const [tableData, setTableData] = useState({});

  async function getlogs() {

      try {
          
        if(moment(start).format("YYYY-MM-DD HH:mm") > moment(end).format("YYYY-MM-DD HH:mm"))
        {
            toast.error("Start Date is greater than End Date.",{
                position: toast.POSITION.TOP_CENTER
            });
            return false;
        }
          const res = await fetch(link+"api/v1/logs/filodatebetween/"+moment(start).format("YYYY-MM-DD")+"/"+moment(end).format("YYYY-MM-DD"), {
            method: "GET",
            headers: { jwt_token: localStorage.token }
          });
          const parseRes = await res.json();
          
          if(parseRes.length <= 0)
          {
              toast.warning("No available data for this month.",{
                position: toast.POSITION.TOP_CENTER
              });
              return false;
          }

          let data = [];
        
          for(let i=0;i< parseRes.length; i++)
          {
            data.push(
              {
                BADGENUMBER: parseRes[i].BADGENUMBER,
                Date: moment(parseRes[i].Date).format("YYYY-MM-DD"),
                ClockIn: parseRes[i].ClockIn ? moment(parseRes[i].ClockIn).add(4,'h').format("YYYY-MM-DD hh:mm") : "",
                ClockInType: parseRes[i].ClockInType,
                ClockOut: parseRes[i].ClockOut ? moment(parseRes[i].ClockOut).add(4,'h').format("YYYY-MM-DD hh:mm") : "",
                ClockOutType: parseRes[i].ClockOutType
              }
            )
          }
          setLogs(data);
          setTableData({columns: columns,data:data})
          
        
      } catch (err) {
        //console.error(err.message);
      }
    
    
  };


  useEffect(() => {
    /* setTimeout(function() { 
      btnGen.current.click();
    }.bind(this), 200) */
    getlogs();
  },[]);
  
  async function generatelogs() {
    
    try {
  
        if(moment(start).format("YYYY-MM-DD HH:mm") > moment(end).format("YYYY-MM-DD HH:mm"))
        {
            toast.error("Start Date is greater than End Date.",{
                position: toast.POSITION.TOP_CENTER
            });
            return false;
        }
        const res = await fetch(link+"api/v1/logs/filodatebetween/"+moment(start).format("YYYY-MM-DD")+"/"+moment(end).format("YYYY-MM-DD"), {
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

        if(parseRes.length <= 0)
        {
            toast.warning("No available data.",{
              position: toast.POSITION.TOP_CENTER
            });
            return false;
        }
        
        let data = [];
        
        
        
        for(let i=0;i< parseRes.length; i++)
        {
          data.push(
            {
              BADGENUMBER: parseRes[i].BADGENUMBER,
              Date: moment(parseRes[i].Date).format("YYYY-MM-DD"),
              ClockIn: parseRes[i].ClockIn ? moment(parseRes[i].ClockIn).add(4,'h').format("YYYY-MM-DD hh:mm") : "",
              ClockInType: parseRes[i].ClockInType,
              ClockOut: parseRes[i].ClockOut ? moment(parseRes[i].ClockOut).add(4,'h').format("YYYY-MM-DD hh:mm") : "",
              ClockOutType: parseRes[i].ClockOutType
            }
          )
        }
        
        setLogs(data);
        setTableData({columns: columns,data:data})
        
        toast.success('Biometric Logs has been generated!',{
          position: toast.POSITION.TOP_CENTER
        });
      
      
    } catch (err) {
      //console.error(err.message);
        toast.error('Cannot connect to Database!',{
          position: toast.POSITION.TOP_CENTER
        });
    }
  }

  const data = [
    {
      BADGENUMBER: "1037",
      Date: "Beetlejuice",
      ClockIn: "1988",
      ClockInType: "92",
      ClockOut: "",
      ClockOutType: "Tim Burton",
     
    }
  ]

  
  
  return (

    <Container fluid className="px-0">
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="p-3">
          <Form>
            <Row className="align-items-center">
              <Col md={4} className="">
                <Form.Group id="start">
                  <Row>
                    <Col md={3} className="">
                      <Form.Label>Start Date</Form.Label>
                    </Col>
                    <Col md={9} className="">
                      <Datetime
                        timeFormat={true}
                        onChange={setStart}
                        renderInput={(props, openCalendar, closeCalendar) => (
                          <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                            <Form.Control
                              required
                              type="text"
                              value={start ? moment(start).format("YYYY-MM-DD hh:mm:ss a") : ""}
                              placeholder="YYYY-MM-DD"
                              onFocus={openCalendar}
                              onChange={closeCalendar}  
                              />
                              
                          </InputGroup>
                        )} />
                      </Col>
                    </Row>
                </Form.Group>
              </Col>
              <Col md={4} className="">
                <Form.Group id="end">
                  <Row>
                    <Col md={3} className="">
                      <Form.Label>End Date</Form.Label>
                    </Col>
                    <Col md={9} className="">
                      <Datetime
                        timeFormat={true}
                        onChange={setEnd}
                        renderInput={(props, openCalendar) => (
                          <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                            <Form.Control
                              required
                              type="text"
                              value={end ? moment(end).format("YYYY-MM-DD hh:mm:ss a") : ""}
                              placeholder="YYYY-MM-DD"
                              onFocus={openCalendar}
                              onChange={() => { }} />
                          </InputGroup>
                        )} />
                      </Col>
                    </Row>
                </Form.Group>
              </Col>

              <Col md={2}>
              <Button variant="primary" type="button" ref={btnGen} className="w-70" style={{float: 'right'}} onClick={generatelogs}>
                Generate Logs
              </Button>
            </Col>
            </Row>
            
          </Form>
        </Card.Body>
        
      </Card>

      <Card>
        <Card.Body className="p-3">
          <ReactHTMLTableToExcel
            variant="primary"
            id="test-table-xls-button"
            className="download-table-xls-button btn btn-info mb-3"
            table="table-to-xls"
            filename="Biometrics Logs"
            buttonText="Export Data"/>
          <Table responsive className="table-centered table-nowrap rounded mb-0" id="table-to-xls">
            <thead className="thead-light">
              <tr>
                <th className="border-0">ID Number</th>
                <th className="border-0">Date</th>
                <th className="border-0">Time In</th>
                <th className="border-0">Time In Transaction Type</th>
                <th className="border-0">Time Out</th>
                <th className="border-0">Time Out Transaction Type</th>
              </tr>
            </thead>
            <tbody>
                {logs.map((log,i) =>
                  <tr key={i}>
                    <td>{log.BADGENUMBER}</td>
                    <td>{moment(log.Date).format("YYYY-MM-DD")}</td>
                    <td>{log.ClockIn !== "" ? moment(log.ClockIn).format("YYYY-MM-DD hh:mm:ss") : ""}</td>
                    <td>{log.ClockInType}</td>
                    <td>{log.ClockOut !== "" ? moment(log.ClockOut).format("YYYY-MM-DD hh:mm:ss") : ""}</td>
                    <td>{log.ClockOutType}</td>
                  </tr>
                )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};


