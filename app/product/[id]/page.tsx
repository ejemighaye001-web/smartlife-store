"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { getCart, saveCart } from "@/lib/cart";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      setProduct(data);
    };

    fetchProduct();
    setCart(getCart());
  }, [id]);

  const addToCart = () => {
    const updated = [...cart, product];
    setCart(updated);
    saveCart(updated);
    alert("Added to cart");
  };

  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <img src={product.image} className="w-full h-80 object-cover rounded-xl mb-6" />

      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600 mt-2">₦{product.price}</p>

      <p className="mt-4 text-gray-500">
        {product.description}
      </p>

      <button
        onClick={addToCart}
        className="mt-6 bg-black text-white px-6 py-3 rounded"
      >
        Add to Cart
      </button>

    </div>
  );
}