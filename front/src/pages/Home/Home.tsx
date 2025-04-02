import React from 'react';
import Header from "../../layouts/Header/Header";
import Register from "../Register/Register";
import Login from "../Login/Login";
import {NewDish} from "../NewDish/NewDish";
import {DischList} from "../DishList/DischList";
import './Home.scss';

function Home() {
  return (
    <>
      <Header/>
      <DischList/>
    </>
  );
}

export default Home;
