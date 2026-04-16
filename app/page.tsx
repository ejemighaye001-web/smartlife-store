"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart } from "lucide-react";
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

  // 📦 FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.log(error.message);
      return;
    }

    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ ADD TO CART
  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  // ❌ REMOVE FROM CART
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item, index) => index !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="flex justify-between items-center p-6 shadow bg-white">
        <h1 className="text-2xl font-bold">Smartlife Gadgets</h1>

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowCart(!showCart)}
        >
          <ShoppingCart />
          <span>{cart.length}</span>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center py-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2"
        >
          Upgrade Your Lifestyle with Smart Gadgets
        </motion.h2>

        <p className="text-gray-600">
          Discover the latest tech products at unbeatable prices.
        </p>

        {/* ✅ CHECKOUT BUTTON (CORRECT PLACE) */}
        <a
          href="/checkout"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded"
        >
          Go to Checkout
        </a>
      </section>

      {/* PRODUCTS */}
      <section className="grid md:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
        {products.length === 0 ? (
          <p className="col-span-3 text-center">No products found</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-xl shadow">

              <img
                src={product.image}
                alt={product.name}
                className="mx-auto mb-4 h-40 object-cover"
              />

              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">₦{product.price}</p>

              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-black text-white py-2 rounded"
              >
                Add to Cart
              </button>

              {/* WhatsApp Order */}
              <a
                href={`https://wa.me/2348149739044?text=${encodeURIComponent(
                  `🛒 New Order\n\nProduct: ${product.name}\nPrice: ₦${product.price}`
                )}`}
                target="_blank"
                className="mt-2 block text-center bg-green-500 text-white py-2 rounded"
              >
                Order on WhatsApp
              </a>

            </div>
          ))
        )}
      </section>

      {/* CART */}
      {showCart && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 z-50">

          <h2 className="text-xl font-bold mb-4">Your Cart</h2>

          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>₦{item.price}</span>

                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 ml-2"
                >
                  x
                </button>
              </div>
            ))
          )}

          <hr className="my-3" />

          <div className="font-bold mb-3">
            Total: ₦{total}
          </div>

          <a
            href="/checkout"
            className="w-full block bg-blue-600 text-white py-2 rounded text-center"
          >
            Checkout
          </a>

          <button
            className="w-full mt-2 bg-gray-300 py-2 rounded"
            onClick={() => setShowCart(false)}
          >
            Close
          </button>

        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Smartlife Gadgets
      </footer>

    </div>
  );
}