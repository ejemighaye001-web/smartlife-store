"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase.from("orders").select("*").order("id", { ascending: false });
      setOrders(data || []);
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-4 rounded">

          <p><b>Name:</b> {order.customer_name}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>Address:</b> {order.address}</p>
          <p><b>Total:</b> ₦{order.total}</p>

          <div className="mt-2 text-sm text-gray-500">
            {order.items.map((item: any, i: number) => (
              <p key={i}>• {item.name}</p>
            ))}
          </div>

        </div>
      ))}

    </div>
  );
}