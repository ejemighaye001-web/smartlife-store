"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  const searchOrder = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("phone", phone);

    setOrders(data || []);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>

      <input
        placeholder="Enter your phone number"
        className="border p-2 w-full mb-3"
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={searchOrder}
        className="bg-black text-white w-full py-2 rounded"
      >
        Track Order
      </button>

      {orders.map((order) => (
        <div key={order.id} className="mt-4 border p-3 rounded">

          <p><b>Status:</b> {order.status || "pending"}</p>
          <p><b>Total:</b> ₦{order.total}</p>

        </div>
      ))}

    </div>
  );
}