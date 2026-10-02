import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Bare for `npm run dev`: lar en telefon på samme Wi-Fi åpne utviklings-
  // serveren (http://<maskinens IP>:3000) for å teste mobilversjonen. Next
  // blokkerer ellers skriptene fra andre adresser enn localhost.
  allowedDevOrigins: ["192.168.10.192"],
};

export default nextConfig;
