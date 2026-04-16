"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error.message);
      return;
    }

    setOrders(data || []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = async (id: number, status: string) => {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    fetchOrders();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 rounded mb-4 bg-white shadow">

            <p><b>Name:</b> {order.customer_name}</p>
            <p><b>Phone:</b> {order.phone}</p>
            <p><b>Address:</b> {order.address}</p>
            <p><b>Delivery Time:</b> {order.delivery_time}</p>

            <p className="mt-2">
              <b>Total:</b> ₦{order.total}
            </p>

            <p className="mt-2">
              <b>Status:</b>{" "}
              <span className="font-semibold">
                {order.status || "pending"}
              </span>
            </p>

            {/* ITEMS */}
            <div className="mt-2 text-sm text-gray-600">
              {order.items?.map((item: any, i: number) => (
                <p key={i}>• {item.name}</p>
              ))}
            </div>

            {/* STATUS BUTTONS */}
            <div className="flex gap-2 mt-4">

              <button
                onClick={() => updateStatus(order.id, "pending")}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Pending
              </button>

              <button
                onClick={() => updateStatus(order.id, "shipped")}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Shipped
              </button>

              <button
                onClick={() => updateStatus(order.id, "delivered")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Delivered
              </button>

            </div>

          </div>
        ))
      )}

    </div>
  );
}