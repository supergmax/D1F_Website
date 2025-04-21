import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        router.push("/dashboard");
      } else {
        setError(data.error?.message || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Erreur réseau ou serveur");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Créer un compte</h2>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className="input input-bordered w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="input input-bordered w-full mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-error mt-2">{error}</p>}
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary" onClick={handleSignup}>
              inscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
