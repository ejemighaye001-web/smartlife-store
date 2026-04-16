"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Search } from "lucide-react";
import { motion } from "framer-motion";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function SmartlifeStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*");
      setProducts(data || []);
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      {/* TOP NAV */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">

          <h1 className="font-bold text-xl tracking-tight">
            Smartlife <span className="text-gray-500">Store</span>
          </h1>

          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full">
              <Search size={16} className="text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent outline-none px-2 text-sm w-40"
              />
            </div>

            {/* CART */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-black text-white px-4 py-2 rounded-full flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              <span>{cart.length}</span>
            </button>

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 py-14 text-center">

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight"
        >
          Premium Gadgets for Everyday Life
        </motion.h2>

        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Discover high-quality tech products curated for modern living.
        </p>

        {/* CATEGORY PILLS */}
        <div className="flex justify-center flex-wrap gap-2 mt-6">
          {["All", "Audio", "Smartwatch", "Accessories", "Tech"].map((c) => (
            <span
              key={c}
              className="px-4 py-1 rounded-full bg-white shadow text-sm cursor-pointer hover:bg-black hover:text-white transition"
            >
              {c}
            </span>
          ))}
        </div>

        <a
          href="/checkout"
          className="inline-block mt-8 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          Start Shopping
        </a>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid sm:grid-cols-2 md:grid-cols-3 gap-6">

        {filtered.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
          >

            {/* IMAGE */}
            <div className="h-52 overflow-hidden bg-gray-100">
              <img
                src={product.image}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">

              <h3 className="font-semibold text-lg">{product.name}</h3>

              <p className="text-gray-500 mt-1">
                ₦{product.price}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="w-full mt-4 bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>

              <a
                href={`https://wa.me/2348149739044?text=${encodeURIComponent(
                  `🛒 New Order\n\nProduct: ${product.name}\nPrice: ₦${product.price}`
                )}`}
                className="block text-center mt-2 bg-green-500 text-white py-2 rounded-xl"
              >
                Buy on WhatsApp
              </a>

            </div>
          </motion.div>
        ))}

      </section>

      {/* FLOATING CART */}
      {showCart && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 p-4">

          <h2 className="text-xl font-bold mb-4">Cart</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            cart.map((item, i) => (
              <div key={i} className="flex justify-between text-sm mb-2">
                <span>{item.name}</span>
                <span>₦{item.price}</span>
              </div>
            ))
          )}

          <div className="border-t mt-4 pt-3 font-bold">
            Total: ₦{total}
          </div>

          <a
            href="/checkout"
            className="block mt-4 bg-black text-white text-center py-2 rounded-xl"
          >
            Checkout
          </a>

          <button
            onClick={() => setShowCart(false)}
            className="w-full mt-2 bg-gray-100 py-2 rounded-xl"
          >
            Close
          </button>

        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center py-10 text-sm text-gray-400">
        © {new Date().getFullYear()} Smartlife Store. All rights reserved.
      </footer>

    </div>
  );
}