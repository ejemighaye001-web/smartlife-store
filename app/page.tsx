"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Search } from "lucide-react";
import { motion } from "framer-motion";
import { getCart, saveCart } from "@/lib/cart";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function SmartlifeStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.log(error.message);
        return;
      }

      setProducts(data || []);
    };

    fetchProducts();
  }, []);

  // LOAD CART
  useEffect(() => {
    setCart(getCart());
  }, []);

  // ADD TO CART
  const addToCart = (product: Product) => {
    const updated = [...cart, product];
    setCart(updated);
    saveCart(updated);
  };

  // REMOVE FROM CART
  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    saveCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">

          <h1 className="text-xl font-bold">
            Smartlife <span className="text-gray-500">Store</span>
          </h1>

          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full">
              <Search size={16} className="text-gray-500" />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none px-2 text-sm"
              />
            </div>

            {/* CART */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              <span>{cart.length}</span>
            </button>

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center py-14 px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold"
        >
          Premium Gadgets for Everyday Life
        </motion.h2>

        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Discover high-quality tech products curated for modern living.
        </p>

        <a
          href="/checkout"
          className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full"
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
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden"
          >

            {/* CLICKABLE PRODUCT */}
            <a href={`/product/${product.id}`}>

              <div className="h-52 bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>

                <p className="text-gray-500 mt-1">
                  ₦{product.price}
                </p>
              </div>

            </a>

            {/* ACTIONS */}
            <div className="px-4 pb-4">

              <button
                onClick={() => addToCart(product)}
                className="w-full mt-2 bg-black text-white py-2 rounded-xl"
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

      {/* CART DRAWER */}
      {showCart && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-4 z-50">

          <h2 className="text-xl font-bold mb-4">Your Cart</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center mb-2">

                <div>
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">₦{item.price}</p>
                </div>

                <button
                  onClick={() => removeFromCart(i)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>

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
        © {new Date().getFullYear()} Smartlife Store
      </footer>

    </div>
  );
}