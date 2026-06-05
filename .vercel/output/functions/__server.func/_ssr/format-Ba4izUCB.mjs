function formatINR(amount) {
  return "₹" + amount.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function discountPct(mrp, price) {
  if (!mrp || mrp <= price) return 0;
  return Math.round((mrp - price) / mrp * 100);
}
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
export {
  cn as c,
  discountPct as d,
  formatINR as f
};
