import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { NFTProvider } from '../context/NFTContext';
import { Navbar, Footer } from '../components';
import '../styles/globals.css';

const App = ({ Component, pageProps }) => (
  <NFTProvider>
    <ThirdwebProvider clientId="e46b66e3b6a1ae77123457cacb8aed67">
      <ThemeProvider attribute="class">
        <div className="dark:bg-nft-dark bgwhite min-h-screen">
          <Navbar />
          <div className="pt-65">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
        <Script src="https://kit.fontawesome.com/38234824dc.js" crossOrigin="anonymous" />
      </ThemeProvider>
    </ThirdwebProvider>
  </NFTProvider>
);

export default App;
