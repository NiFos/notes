import { Container } from "@material-ui/core";
import React from "react";
import { Provider } from "react-redux";
import { Layout } from "./components/layout";
import { store } from "./redux/store";
import { Routes } from "./routes";

function App() {
  return (
    <Container className="App">
      <Provider store={store}>
        <Layout>
          <Routes />
        </Layout>
      </Provider>
    </Container>
  );
}

export default App;
