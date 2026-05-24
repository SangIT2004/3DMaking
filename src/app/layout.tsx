import "./globals.css";

export const metadata = {
  title: "3D Room Studio",
  description: "Web-based 3D room editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
