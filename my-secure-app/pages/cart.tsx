import AuthenticatedLayout from "../src/layout/AuthenticatedLayout";
import { useContext } from "react";
import { CartContext } from "../src/context/CartContext";
import Link from "next/link";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">🛒 Votre Panier</h1>

        {cart.length === 0 ? (
          <div className="alert alert-info shadow-lg">
            <span>Votre panier est vide.</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table w-full bg-white">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Prix unitaire</th>
                    <th>Quantité</th>
                    <th>Sous-total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.price.toFixed(2)} €</td>
                      <td>{item.quantity}</td>
                      <td>{(item.price * item.quantity).toFixed(2)} €</td>
                      <td>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="btn btn-sm btn-error text-white"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-xl font-semibold">
                Total : {total.toFixed(2)} €
              </div>
              <div className="space-x-2">
                <button onClick={clearCart} className="btn btn-outline btn-warning">
                  Vider le panier
                </button>
                <Link href="/checkout" className="btn btn-primary">
                  Payer
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default CartPage;
