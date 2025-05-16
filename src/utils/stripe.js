import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key
const stripePromise = loadStripe('pk_test_51ROk9fPhBKjymCAAjWx2L1NrYDz9NtqwQJFLETT1TixdoaBJDZtyopwvrMyj3yxuPvtqYCDB22CBukpLsn1bUyd600tppq7ZB2');

export const createPaymentIntent = async (bookingId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/create-intent/${bookingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Payment intent error:', error);
    throw error;
  }
};

export const confirmPayment = async (clientSecret, stripe, elements) => {
  try {
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement('card'),
      },
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  } catch (error) {
    console.error('Payment confirmation error:', error);
    throw error;
  }
};

export const stripePromiseInstance = stripePromise;
};
