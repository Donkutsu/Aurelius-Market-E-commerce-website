// formatters.ts

// 1. Currency formatter for Indian Rupees (₹), lakh/crore grouping
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,     // ₹5,000
  maximumFractionDigits: 2,     // ₹5,000.50 if needed
})

// 2. Number formatter for Indian formatting (no currency)
const NUMBER_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,     // e.g. 1,23,456.78
})

// Exported helpers
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

export function formatNumber(value: number) {
  return NUMBER_FORMATTER.format(value)
}