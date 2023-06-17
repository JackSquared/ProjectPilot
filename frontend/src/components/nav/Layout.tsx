import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styled from 'styled-components';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainWrapper = styled.main`
  flex-grow: 1;
  padding: 20px;
  background-color: #f2f2f2;
  overflow: auto;
`;

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AppWrapper>
      <Navbar />
      <MainWrapper>{children}</MainWrapper>
      <Footer />
    </AppWrapper>
  );
};

export default Layout;
