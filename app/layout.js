import './styles/globals.css'; // Importer le fichier CSS global

export default function RootLayout({ children }) {
  return (
      <html lang="fr">
      <body>{children}</body>
      </html>
  );
}
