const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
})

export const formatCurrency = (amount: number) =>
  currencyFormatter.format(amount)
