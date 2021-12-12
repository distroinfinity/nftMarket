/* pages/_app.js */
import "../styles/globals.css";
import Head from "next/head";
import { Navbar } from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Metaverse Debouche</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="container my-12 mx-auto px-4 md:px-12">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
