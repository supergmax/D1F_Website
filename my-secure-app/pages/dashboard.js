import AuthenticatedLayout from "../src/layout/AuthenticatedLayout";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      fetch("http://localhost:1337/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("DATA REÇUE DE STRAPI :", data);
  
          // Parfois Strapi retourne un objet avec une clé `data`
          if (Array.isArray(data)) {
            setUsers(data);
          } else if (Array.isArray(data.data)) {
            setUsers(data.data);
          } else {
            console.error("Données inattendues :", data);
          }
        })
        .catch((err) => console.error("Erreur API:", err));
    }
  }, []);
  

  return (
    <AuthenticatedLayout>
      <h1 className="text-3xl font-bold mb-4">Utilisateurs Strapi</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="bg-gray-100 p-4 rounded">
            <strong>{user.username}</strong> – {user.email}
          </li>
        ))}
      </ul>
    </AuthenticatedLayout>
  );
};

export default DashboardPage;
