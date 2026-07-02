export const createCheckoutSession = async (
  items: { productId: string; name: string; price: number; quantity: number }[],
  shippingInfo: {
    firstName: string
    lastName: string
    address: string
    phone: string
  },
): Promise<{ url: string }> => {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, shippingInfo }),
  })
  if (!res.ok) {
    throw new Error('Failed to create checkout session')
  }
  return res.json()
}
