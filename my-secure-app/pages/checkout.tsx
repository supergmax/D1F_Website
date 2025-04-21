import AuthenticatedLayout from "../src/layout/AuthenticatedLayout";
import { useContext } from "react";
import { CartContext } from "../src/context/CartContext";
import { useRouter } from "next/router";

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    // Simule un paiement
    clearCart();
    router.push("/confirmation");
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧾 Confirmation de commande</h1>

        {cart.length === 0 ? (
          <div className="alert alert-warning">Votre panier est vide.</div>
        ) : (
          <>
            <ul className="divide-y">
              {cart.map((item) => (
                <li key={item.id} className="py-4 flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between items-center border-t pt-4">
              <span className="text-xl font-semibold">Total :</span>
              <span className="text-xl font-bold">{total.toFixed(2)} €</span>
            </div>

            <div className="mt-6 text-right">
              <button className="btn btn-primary" onClick={handlePayment}>
                Valider le paiement
              </button>
            </div>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default CheckoutPage;
