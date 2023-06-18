import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../AuthContext';

const NavbarWrapper = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #333;
  color: #fff;
  box-sizing: border-box;
`;

const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    color: #ddd;
  }
`;

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const onLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <NavbarWrapper>
      <StyledLink to='/'>Home</StyledLink>
      <div>
        {isAuthenticated ? (
          <StyledLink to='/' onClick={onLogout}>
            Logout
          </StyledLink>
        ) : (
          <>
            <StyledLink to='/login'>Login</StyledLink>
            <StyledLink to='/signup'>Sign Up</StyledLink>
          </>
        )}
      </div>
    </NavbarWrapper>
  );
};

export default Navbar;
