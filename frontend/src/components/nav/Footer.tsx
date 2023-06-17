import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  background-color: #333;
  color: #fff;
`;

const Footer = () => {
  return <FooterWrapper>ProjectPilot</FooterWrapper>;
};

export default Footer;
