import AuthenticatedLayout from "../layout/AuthenticatedLayout";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const products = [
  {
    id: 1,
    name: "Casquette Aura",
    price: 29.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "T-Shirt Tonton Max",
    price: 39.99,
    image: "https://via.placeholder.com/150",
  },
];

const ShopPage = () => {
  const { addToCart } = useContext(CartContext);

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Boutique Aura 🛍️</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card bg-base-100 shadow-xl">
              <figure>
                <img src={product.image} alt={product.name} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p>{product.price} €</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product)}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ShopPage;
