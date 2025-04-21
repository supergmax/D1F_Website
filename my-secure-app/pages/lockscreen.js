import { useState } from "react";
import { useRouter } from "next/router";

export default function LockScreen() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUnlock = () => {
    if (password === "test") {
      localStorage.setItem("unlocked", "true");
      router.push("/dashboard");
    } else {
      setError("Mot de passe incorrect !");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">🔒 Accès sécurisé</h2>
          <input
            type="password"
            placeholder="Entrez le mot de passe"
            className="input input-bordered w-full mt-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-error mt-2">{error}</p>}
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary" onClick={handleUnlock}>
              Déverrouiller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
