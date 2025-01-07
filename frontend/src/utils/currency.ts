export const formatINR = (amount: number) => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
