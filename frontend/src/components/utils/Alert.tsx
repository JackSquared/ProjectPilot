import React, { useState, useEffect } from "react";
import MuiAlert, { AlertProps as MuiAlertProps } from '@mui/material/Alert';

interface AlertProps extends MuiAlertProps {
  message: string;
  autoHideDuration?: number;
}

const Alert: React.FC<AlertProps> = ({ message, autoHideDuration = 3000, ...props }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, autoHideDuration); // 3 seconds

    return () => clearTimeout(timer); // clean up on unmount
  }, [autoHideDuration]);

  if (!isVisible) {
    return null;
  }

  return <MuiAlert {...props}>{message}</MuiAlert>;
};

export default Alert;