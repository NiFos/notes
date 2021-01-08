import React from "react";
import { Provider } from "react-redux";
import { Layout } from "./components/layout";
import { store } from "./redux/store";
import { Routes } from "./routes";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Layout>
          <Routes />
        </Layout>
      </Provider>
    </div>
  );
}

export default App;
