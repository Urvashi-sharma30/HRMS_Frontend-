import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceManagement from './components/AttendanceManagement';
import Dashboard from './components/Dashboard';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(160deg, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%);
`;

const Navbar = styled.nav`
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  padding: 0.875rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(15, 118, 110, 0.12);

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Logo = styled.h1`
  font-size: 1.35rem;
  color: #0f766e;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.active ? '#0f766e' : '#334155'};
  font-weight: ${props => props.active ? '600' : '500'};
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.95rem;

  &:hover {
    background: #ccfbf1;
    color: #0f766e;
  }

  ${props => props.active && `
    background: #ccfbf1;
    color: #0f766e;
  `}

  @media (max-width: 480px) {
    padding: 0.4rem 0.65rem;
    font-size: 0.875rem;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 1.5rem auto;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    margin: 1rem auto;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.75rem;
    margin: 0.75rem auto;
  }
`;

function Navigation() {
  const location = useLocation();
  
  return (
    <NavLinks>
      <NavLink to="/" active={location.pathname === '/' ? 1 : 0}>
        Dashboard
      </NavLink>
      <NavLink to="/employees" active={location.pathname === '/employees' ? 1 : 0}>
        Employees
      </NavLink>
      <NavLink to="/attendance" active={location.pathname === '/attendance' ? 1 : 0}>
        Attendance
      </NavLink>
    </NavLinks>
  );
}

function App() {
  return (
    <Router>
      <AppContainer>
        <Navbar>
          <NavContent>
            <Logo>HRMS Lite</Logo>
            <Navigation />
          </NavContent>
        </Navbar>
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/attendance" element={<AttendanceManagement />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
