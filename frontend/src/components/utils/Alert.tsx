import React, { useState, useEffect } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'warning';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // clean up on unmount
  }, []);

  if (!isVisible) {
    return null;
  }

  const getStyle = () => {
    switch (type) {
      case 'success':
        return { color: 'green' };
      case 'error':
        return { color: 'red' };
      case 'warning':
        return { color: 'orange' };
      default:
        return {};
    }
  };

  return <div style={getStyle()}>{message}</div>;
};

export default Alert;
