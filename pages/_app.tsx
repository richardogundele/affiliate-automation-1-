import { AppProps } from 'next/app';
import '../styles/globals.css'; // Ensure your global styles are imported

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp; 