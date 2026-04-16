"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type CartItem = {
  id: number;
  name: string;
  price: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔢 TOTAL PRICE
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // 📦 PLACE ORDER
  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address || !form.time) {
      alert("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: form.name,
        customer_phone: form.phone,
        address: form.address,
        delivery_time: form.time,
        items: cart,
        total_price: total,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Order placed successfully!");

    setCart([]);
    setForm({ name: "", phone: "", address: "", time: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">

      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4">
          Checkout
        </h1>

        {/* CUSTOMER INFO */}
        <input
          placeholder="Full Name"
          className="w-full border p-2 mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Phone Number"
          className="w-full border p-2 mb-3"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <textarea
          placeholder="Delivery Address"
          className="w-full border p-2 mb-3"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <label className="text-sm font-semibold">
          Preferred Delivery Time
        </label>

        <input
          type="time"
          className="w-full border p-2 mb-3"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        {/* ORDER SUMMARY */}
        <div className="border-t pt-3 mt-3">
          <h2 className="font-bold mb-2">Order Summary</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">No items in cart</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span>₦{item.price}</span>
              </div>
            ))
          )}

          <div className="mt-3 font-bold">
            Total: ₦{total}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full bg-black text-white py-2 mt-4 rounded"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>

      </div>

    </div>
  );
}