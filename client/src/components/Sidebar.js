
import { faClock, faFileAlt, faFolderOpen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, Badge, Button, Dropdown, Image, Nav, Navbar } from '@themesberg/react-bootstrap';
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import SimpleBar from 'simplebar-react';
import CompanyLogo from "../assets/img/suhay.png";
import { Routes } from "../routes";


export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const { title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
            {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" >
          <Image src={CompanyLogo} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <Nav className="flex-column pt-3 pt-md-0">
              <NavItem title="Suhay, OPC" image={CompanyLogo} style={{ filter: 'grayscale' }} />
              <Dropdown.Divider className="my-3 border-indigo" />
              <NavItem title="Time Card Report" icon={faClock} link={Routes.BootstrapTables.path} />
              <NavItem title="Request" icon={faFileAlt} link={Routes.Req.path} />
              <NavItem title="Forms" icon={faFolderOpen} link={Routes.FormLeave.path} />
              
            </Nav>
            <CollapsableNavItem title="User" icon={faUser}>
              <NavItem title="Profile" link={Routes.UserProfile.path} />
            </CollapsableNavItem>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
