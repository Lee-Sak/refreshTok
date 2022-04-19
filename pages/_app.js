import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { wrapper } from "../store/configureStore";
import { createStore } from "redux";
import { persistedReducer } from "../reducers/persist";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

// Component에 페이지가 들어감
const App = ({ Component, pageProps }) => {
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);

  // 한번만 실행됨
  useEffect(() => {
    document.getElementById("__next").classList.add("all");
  }, []);
  return (
    <PersistGate persistor={persistor} loading={<div>loading...</div>}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>PBX ADMIN</title>
      </Head>
      <Component {...pageProps} />
    </PersistGate>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(App); // 해당 페이지를 정의한 wrapper로 감쌀거야
