import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Login from "./components/Login";
import store from "./store/store.js";
import SignUp from "./components/SignUp/index.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./components/Home/index.jsx";
import CreateItem from "./components/CreateItem";
import CarDetailPage from "./components/CarDetailPage";
import NotFound from "./components/NotFound.jsx";
import Products from "./components/Products/index.jsx";
import UpdateCar from "./components/UpdateItem/index.jsx";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/create-item" element={<CreateItem />} />
                    <Route path="/product/:id" element={<CarDetailPage />} />

                    <Route path="/update-car/:id" element={<UpdateCar />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
