const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const randomOutcome = () => Math.random() > 0.08;

export async function simulateX402Payment({ amount, currency, tokenSymbol }) {
  await delay(900 + Math.random() * 900);

  if (!randomOutcome()) {
    throw new Error('x402 gateway declined the request. Please retry in a few seconds.');
  }

  return {
    status: 'granted',
    amount,
    currency,
    tokenSymbol,
    reference: `X402-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

export default {
  simulateX402Payment,
};

