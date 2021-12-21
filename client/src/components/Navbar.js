
import { faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Dropdown, Form, Nav, Navbar } from '@themesberg/react-bootstrap';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { setLoggedInfo } from '../redux/actions/logged';
import { setUserInfo } from '../redux/actions/user';

/* export default ({ SetAuth }) => {
  
}; */

const NavigationBar = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(state => state.users.info);
  
  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      const parseData = await res.json();
      //console.log(parseData)
      setName(parseData.fname);
      dispatch(setUserInfo(
        {
          idno: parseData.idno,
          fname: parseData.fname,
          com: parseData.com,
          lname: parseData.lname
        }))
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      //setAuth(false);
      dispatch(setLoggedInfo({logged: false}))
      toast.success("Logout successfully",{
        position: toast.POSITION.TOP_CENTER
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">
            <Form className="navbar-search">
              <Form.Group id="topbarSearch">
                
              </Form.Group>
            </Form>
          </div>
          <Nav className="align-items-center">

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <FontAwesomeIcon icon={faCog} className="text-primary me-2" /><span className="mb-0 font-small fw-bold">{user.fname}</span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">

                <Dropdown.Divider />

                <Dropdown.Item className="fw-bold" type="submit" onClick={e => logout(e)}>
                  <Link to="/"> <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" />Logout </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;