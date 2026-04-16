"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    time: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Fill all fields");
      return;
    }

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        delivery_time: form.time,
        items: cart,
        total,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    localStorage.removeItem("cart");
    alert("Order placed successfully!");
    window.location.href = "/";
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {cart.map((item, i) => (
        <div key={i} className="flex justify-between text-sm mb-2">
          <span>{item.name}</span>
          <span>₦{item.price}</span>
        </div>
      ))}

      <hr className="my-3" />

      <p className="font-bold mb-4">Total: ₦{total}</p>

      <input placeholder="Full Name" className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Phone Number" className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      <input placeholder="Address" className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, address: e.target.value })} />

      <input placeholder="Delivery Time" className="border p-2 w-full mb-4"
        onChange={(e) => setForm({ ...form, time: e.target.value })} />

      <button
        onClick={placeOrder}
        className="bg-black text-white w-full py-3 rounded"
      >
        Place Order
      </button>

    </div>
  );
}