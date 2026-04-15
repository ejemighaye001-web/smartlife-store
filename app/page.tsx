"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const productsData = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 45,
    image: "/images/M28.jpg",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 120,
    image: "/images/ultra9.jpg",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 60,
    image: "/images/speaker.jpg",
  },
];

export default function SmartlifeStore() {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, item: Product) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow bg-white">
        <h1 className="text-2xl font-bold">Smartlife Gadgets</h1>
        <div className="flex items-center gap-2">
          <ShoppingCart />
          <span>{cart.length}</span>
        </div>
      </header>

      {/* Hero */}
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

      {/* Products */}
      <section className="grid md:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
        {productsData.map((product) => (
          <Card key={product.id} className="rounded-2xl shadow">
            <CardContent className="p-4 text-center">
              <img
                src={product.image}
                alt={product.name}
                className="mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
              <Button
                className="mt-4 w-full"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </Button>
              <a
  href="https://wa.me/2348149739044?text=Hello%20I%20want%20to%20buy%20this%20product"
  target="_blank"
>
  <button className="mt-2 w-full bg-green-600 text-white py-2 rounded-xl">
    Order on WhatsApp
  </button>
</a>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Cart Summary */}
      <section className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total}</span>
            </div>
            <Button className="mt-4 w-full">Checkout</Button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Smartlife Gadgets
      </footer>
    </div>
  );
}