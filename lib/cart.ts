export const getCart = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

export const saveCart = (cart: any[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};