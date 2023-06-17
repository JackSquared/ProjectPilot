import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

  &:hover {
    color: #ddd;
  }
`;

const Navbar = () => {
  return (
    <NavbarWrapper>
      <StyledLink to='/'>Home</StyledLink>
      <div>
        {' '}
        {/* Some div */}
        <StyledLink to='/logout'>Logout</StyledLink>
      </div>
    </NavbarWrapper>
  );
};

export default Navbar;
