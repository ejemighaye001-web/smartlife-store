"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // AUTH
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
    };

    checkUser();
  }, [router]);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    setProducts(data ?? []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // CALCULATIONS
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  // RESET
  const resetForm = () => {
    setForm({ name: "", price: "", image: "", description: "" });
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* ✅ STATS CARDS (MUST BE INSIDE RETURN) */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="bg-white p-4 shadow rounded">
          <p>Total Products</p>
          <h2 className="text-xl font-bold">{totalProducts}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Total Value</p>
          <h2 className="text-xl font-bold">₦{totalValue}</h2>
        </div>

      </div>

      {/* REST OF YOUR UI */}
      <div className="grid md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded-xl shadow bg-white">
            <img src={p.image} className="h-32 w-full object-cover rounded mb-2" />
            <h2 className="font-bold">{p.name}</h2>
            <p>₦{p.price}</p>
          </div>
        ))}
      </div>

    </div>
  );
}