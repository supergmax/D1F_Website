import Link from "next/link";

const AppSidebar = () => {
  return (
    <aside className="bg-gray-200 w-64 h-screen p-4">
      <h2 className="text-xl font-bold">Sidebar Max 🚀</h2>
      <Link href="/cart" className="btn btn-ghost w-full justify-start">
        🛒 Panier
      </Link>
    </aside>
  );
};

export default AppSidebar;
