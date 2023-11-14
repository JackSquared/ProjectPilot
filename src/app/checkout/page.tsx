'use client';

import getStripe from './getStripe';

export default async function Checkout() {
  const handlePayment = async () => {
    const response = await fetch('/api/checkout/', {method: 'post'});
    const json = await response.json();

    if (!json.ok) {
      throw new Error('Something went wrong');
    }
    const stripe = await getStripe();
    await stripe.redirectToCheckout({sessionId: json.result.id});
  };

  return (
    <div>
      <button onClick={handlePayment}> Pay me </button>
    </div>
  );
}
