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

  // 🔒 AUTH (REAL SUPABASE)
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  // 📦 FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.log(error.message);
      return;
    }

    setProducts(data ?? []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 📤 UPLOAD IMAGE
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ➕ ADD PRODUCT
  const addProduct = async () => {
    if (!form.name || !form.price || !form.image) {
      alert("Fill all fields");
      return;
    }

    await supabase.from("products").insert([
      {
        name: form.name,
        price: Number(form.price),
        image: form.image,
        description: form.description,
      },
    ]);

    resetForm();
    fetchProducts();
  };

  // ✏️ UPDATE
  const updateProduct = async () => {
    if (!editingId) return;

    await supabase
      .from("products")
      .update({
        name: form.name,
        price: Number(form.price),
        image: form.image,
        description: form.description,
      })
      .eq("id", editingId);

    resetForm();
    fetchProducts();
  };

  // 🧹 RESET
  const resetForm = () => {
    setForm({ name: "", price: "", image: "", description: "" });
    setEditingId(null);
  };

  // ❌ DELETE
  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  // ✏️ EDIT
  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      image: p.image,
      description: p.description,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow mb-8">
        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full mb-2"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const url = await uploadImage(file);
            if (url) setForm({ ...form, image: url });
          }}
        />

        {form.image && (
          <img src={form.image} className="h-24 object-cover rounded mb-2" />
        )}

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        {editingId ? (
          <div className="flex gap-2">
            <button onClick={updateProduct} className="bg-blue-600 text-white p-2 w-full">
              Update
            </button>
            <button onClick={resetForm} className="bg-gray-400 text-white p-2 w-full">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={addProduct} className="bg-black text-white p-2 w-full">
            Add Product
          </button>
        )}
      </div>

      {/* PRODUCTS */}
      <div className="grid md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded-xl shadow bg-white">
            <img src={p.image} className="h-32 w-full object-cover rounded mb-2" />
            <h2 className="font-bold">{p.name}</h2>
            <p>${p.price}</p>

            <a
              href={`https://wa.me/2348149739044?text=${encodeURIComponent(
                `🛒 New Order\n\nProduct: ${p.name}\nPrice: $${p.price}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-3 py-2 mt-2 inline-block rounded w-full text-center"
            >
              Order on WhatsApp
            </a>

            <div className="flex gap-2 mt-3">
              <button onClick={() => startEdit(p)} className="bg-yellow-500 text-white px-3 py-1">
                Edit
              </button>
              <button onClick={() => deleteProduct(p.id)} className="bg-red-500 text-white px-3 py-1">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}