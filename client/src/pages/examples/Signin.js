
import { faAddressCard, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Container, Form, Image, InputGroup, Row } from '@themesberg/react-bootstrap';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CompanyLogo from "../../assets/img/suhay.png";
import { setLoggedInfo } from '../../redux/actions/logged';
import { setUserInfo } from '../../redux/actions/user';
 
export default ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    idno: "",
    com:"",
    password: ""
  });

  const [company, setCompany] = useState([]);
  const logged = useSelector(state => state.logged.info.logged);
  const dispatch = useDispatch();
  const { idno, com, password } = inputs;
  const link = "http://10.168.1.219:5000/"

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

    const onSubmitForm = async e => {
      e.preventDefault();
      try {
        const body = { idno, com, password };
        const response = await fetch(link+"api/v1/auth/login",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(body)
          }
        );
  
        const parseRes = await response.json();
  
        if (parseRes.jwtToken) {
          localStorage.setItem("token", parseRes.jwtToken);
          //setAuth(true);
          dispatch(setLoggedInfo({logged: true}))
          dispatch(setUserInfo(
            {
              idno: parseRes.idno,
              com: parseRes.com,
              fname: parseRes.fname,
              lname: parseRes.lname
            }))
          toast.success("Logged in Successfully",{
            position: toast.POSITION.TOP_CENTER
          });
        } 
      } catch (err) {
        console.error(err.message);
      }
      //console.log(logged)
    };
    const getcompany = async () => {
      try {
        const res = await fetch(link+"api/v1/dropdown/company", {
          method: "GET"
        });
        
        const parseRes = await res.json();
        //console.log(parseRes);
        setCompany(parseRes);
        
      } catch (err) {
        console.error(err.message);
      }
    };

    useEffect(() => {
      getcompany();
    }, []);

    let companylist = company.length > 0
    	&& company.map((item, i) => {
      return (
        <option key={i} value={item.ccode}>{item.cname}</option>
      )});

  
  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image">
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0"><Image src={CompanyLogo} className="navbar-brand-light" style={ {height: '30px',marginRight: '10px' } } />Suhay, OPC</h3>
                  <h3 className="mb-0">Payroll System</h3>
                </div>
                <Form className="mt-4" onSubmit={onSubmitForm}>
                  <Form.Group id="idno" className="mb-4">
                    <Form.Label> Company</Form.Label>
                    <Form.Select autoFocus required name="com" onChange={e => onChange(e)}>
                      <option></option>
                        {companylist}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group id="idno" className="mb-4">
                    <Form.Label>ID Number</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faAddressCard} />
                      </InputGroup.Text>
                      <Form.Control required type="text" placeholder="ID Number" name="idno" onChange={e => onChange(e)} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required type="password" placeholder="Password" name="password" onChange={e => onChange(e)} />
                      </InputGroup>
                    </Form.Group>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Sign in
                  </Button>
                </Form>
                {/* <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    Not registered?
                    <Card.Link as={Link} to={Routes.Signup.path} className="fw-bold">
                      {` Create account `}
                    </Card.Link>
                  </span>
                </div> */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
