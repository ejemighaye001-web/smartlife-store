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

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.log(error.message);
      return;
    }

    setProducts((data as Product[]) || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const checkout = async () => {
    const name = prompt("Enter your name");
    const phone = prompt("Enter your phone number");

    if (!name || !phone) return;

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: name,
        customer_phone: phone,
        items: cart,
        total: total,
      },
    ]);

    if (error) {
      alert("Order failed");
      return;
    }

    alert("Order placed successfully!");
    setCart([]);
  };

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
      <section className="text-center py-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4"
        >
          Upgrade Your Lifestyle with Smart Gadgets
        </motion.h2>

        <p className="text-gray-600">
          Discover the latest tech products at unbeatable prices.
        </p>
      </section>

      {/* PRODUCTS */}
      <section className="grid md:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
        {products.length === 0 ? (
          <p className="col-span-3 text-center">No products found</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow"
            >

              <img
                src={product.image}
                alt={product.name}
                className="mx-auto mb-4 h-40 object-cover"
              />

              <h3 className="text-lg font-semibold">
                {product.name}
              </h3>

              <p className="text-gray-600">${product.price}</p>

              {/* ADD TO CART */}
              <button
                onClick={() => addToCart(product)}
                className="mt-3 w-full bg-black text-white py-2 rounded"
              >
                Add to Cart
              </button>

              {/* WHATSAPP BUTTON */}
              <a
                href={`https://wa.me/2348149739044?text=${encodeURIComponent(
                  `🛒 New Order\n\nProduct: ${product.name}\nPrice: $${product.price}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full bg-green-500 text-white py-2 rounded block text-center"
              >
                Order on WhatsApp
              </a>

            </div>
          ))
        )}
      </section>

      {/* CART PANEL */}
      {showCart && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 z-50">

          <h2 className="text-xl font-bold mb-4">Your Cart</h2>

          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </div>
            ))
          )}

          <hr className="my-3" />

          <div className="font-bold mb-3">
            Total: ${total}
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            onClick={checkout}
          >
            Checkout
          </button>

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