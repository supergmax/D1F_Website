const fs = require("fs");
const { execSync } = require("child_process");

console.log("🧹 Nettoyage des fichiers...");

const folders = ["node_modules", ".next"];
const files = ["package-lock.json"];

for (const folder of folders) {
  if (fs.existsSync(folder)) {
    console.log(`🗑️ Suppression de ${folder}`);
    execSync(`rmdir /s /q ${folder}`, { stdio: "inherit", shell: "cmd.exe" });
  }
}

for (const file of files) {
  if (fs.existsSync(file)) {
    console.log(`🗑️ Suppression de ${file}`);
    execSync(`del /f /q ${file}`, { stdio: "inherit", shell: "cmd.exe" });
  }
}

console.log("✅ Nettoyage terminé.");
