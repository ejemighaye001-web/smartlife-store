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

  // 🔒 AUTH
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) router.push("/login");
  }, [router]);

  // 📦 FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    setProducts((data as Product[]) || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 📤 IMAGE UPLOAD
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
    if (!form.name || !form.price) {
      alert("Fill name and price");
      return;
    }

    if (!form.image) {
      alert("Please upload an image");
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

  // ✏️ UPDATE PRODUCT
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

  // 🧹 RESET FORM
  const resetForm = () => {
    setForm({ name: "", price: "", image: "", description: "" });
    setEditingId(null);
  };

  // ❌ DELETE
  const deleteProduct = async (id: number) => {
    const confirmDelete = confirm("Delete this product?");
    if (!confirmDelete) return;

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
      <div className="grid gap-3 mb-8 bg-white p-4 rounded-xl shadow">
        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border p-2"
        />

        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          className="border p-2"
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          className="border p-2"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const url = await uploadImage(file);
            if (url) setForm({ ...form, image: url });
          }}
        />

        {/* PREVIEW */}
        {form.image && (
          <img
            src={form.image}
            className="h-24 object-cover rounded"
          />
        )}

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="border p-2"
        />

        {editingId ? (
          <div className="flex gap-2">
            <button
              onClick={updateProduct}
              className="bg-blue-600 text-white p-2 w-full"
            >
              Update Product
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white p-2 w-full"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={addProduct}
            className="bg-black text-white p-2"
          >
            Add Product
          </button>
        )}
      </div>

      {/* PRODUCT LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded-xl shadow bg-white"
          >
            <img
              src={p.image}
              className="h-32 w-full object-cover rounded mb-2"
            />

            <h2 className="font-bold">{p.name}</h2>
            <p className="text-gray-700">${p.price}</p>

            {/* WHATSAPP BUTTON */}
            <a
              href={`https://wa.me/2348149739044?text=${encodeURIComponent(
                `🛒 New Order\n\nProduct: ${p.name}\nPrice: $${p.price}\n\nPlease confirm availability`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-3 py-2 mt-3 inline-block rounded w-full text-center"
            >
              Order on WhatsApp
            </a>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => startEdit(p)}
                className="bg-yellow-500 text-white px-3 py-1"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(p.id)}
                className="bg-red-500 text-white px-3 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}