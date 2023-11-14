'use client';
import {useEffect} from 'react';

export default async function Checkout() {
  useEffect(() => {
    const checkoutSuccess = async () => {
      await fetch('/api/checkoutSuccess', {method: 'post'});
    };
    checkoutSuccess();
  }, []);

  return (
    <div>
      <h1> U just got scammed </h1>
    </div>
  );
}
