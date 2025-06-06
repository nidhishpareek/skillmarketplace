import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SWRConfig } from "swr";
import axios from "axios";
import { UserProvider } from "@/context/UserContext";

function fetcher(url: string) {
  return axios.get(url).then((res) => res.data);
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error: any) => {
          console.error("SWR Error:", error);
        },
      }}
    >
      <UserProvider user={pageProps.user || null}>
        <ToastContainer />
        <Component {...pageProps} />
      </UserProvider>
    </SWRConfig>
  );
}
