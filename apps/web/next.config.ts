import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

function loadRootEnv() {
  const envPath = path.resolve(process.cwd(), "../../.env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const file = fs.readFileSync(envPath, "utf-8");

  for (const rawLine of file.split("\n")) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadRootEnv();

const nextConfig: NextConfig = {
  transpilePackages: ["@acme/shared"],
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
};

export default nextConfig;
