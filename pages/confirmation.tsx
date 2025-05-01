import AuthenticatedLayout from "../src/layout/AuthenticatedLayout";
import Link from "next/link";

const ConfirmationPage = () => {
  return (
    <AuthenticatedLayout>
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Paiement validé !</h1>
        <p className="mb-6">Merci pour votre commande, Tonton Max 🙌</p>
        <Link href="/shop" className="btn btn-primary">
          Retour à la boutique
        </Link>
      </div>
    </AuthenticatedLayout>
  );
};

export default ConfirmationPage;
