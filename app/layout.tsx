import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
