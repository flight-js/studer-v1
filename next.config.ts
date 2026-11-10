import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Bare for `npm run dev`: lar en telefon på samme Wi-Fi åpne utviklings-
  // serveren (http://<maskinens IP>:3000) for å teste mobilversjonen. Next
  // blokkerer ellers skriptene fra andre adresser enn localhost.
  // *.trycloudflare.com: en midlertidig Cloudflare-tunnel for å teste fra et
  // annet nett.
  allowedDevOrigins: ["192.168.10.192", "*.trycloudflare.com"],
};

export default nextConfig;
