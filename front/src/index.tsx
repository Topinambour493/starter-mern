import reportWebVitals from './reportWebVitals';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from '../src/pages/Home/Home';
import { DishDetail } from './pages/DishDetail/DishDetail';
import { AxiosInstance } from './Interceptors/interceptors';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Connected from './Middlewares/Connected';
import { Provider } from 'react-redux';
import store, { persistor } from './Redux/store';
import Manager from './Middlewares/Manager';
import { NewDish } from './pages/NewDish/NewDish';
import { Cart } from './pages/Cart/Cart';
import { UpdateDish } from './pages/UpdateDish/UpdateDish';
import Client from './Middlewares/Client';
import { ManagerHome } from './pages/ManagerHome/ManagerHome';
import Deliveryman from './Middlewares/Deliveryman';
import { DeliverymanHome } from './pages/DeliverymanHome/DeliverymanHome';
import { History } from './pages/History/History';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <AxiosInstance>
          <Routes>
            <Route element={<Connected />}>
              <Route element={<Client />}>
                <Route path="/" element={<Home />} />
                <Route path="/dish/:id" element={<DishDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/history" element={<History />} />
              </Route>
              <Route element={<Manager />}>
                <Route path="/manager/dish/:id" element={<UpdateDish />} />
                <Route path="/manager/newDish" element={<NewDish />} />
                <Route path="/manager" element={<ManagerHome />} />
              </Route>
              <Route element={<Deliveryman />}>
                <Route path="/deliveryman" element={<DeliverymanHome />} />
              </Route>
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AxiosInstance>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
