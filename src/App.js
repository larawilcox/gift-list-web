import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';

import Header from './Components/Header';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import MyLists from './Components/MyLists';
import AddList from './Components/AddList';
import ChosenList from './Components/ChosenList';
import EditItem from './Components/EditItem';
import AddItem from './Components/AddItem';
import SubscribedLists from './Components/SubscribedLists';
import Settings from './Components/Settings';
import SubscribedToList from './Components/SubscribedToList';
import ShoppingList from './Components/ShoppingList';


function App() {


  return (
    <div className="App">
      <Header />
      <div className="main-page">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/my-lists" element={<MyLists />} />
          <Route path="/my-lists/add-list" element={<AddList />} />
          <Route path="/list/:listId" element={<ChosenList />} />
          <Route path="/list/:listId/item/:itemId" element={<EditItem />} />
          <Route path="/list/:listId/new-item" element={<AddItem />} />
          <Route path="/subscribed-lists" element={<SubscribedLists />} />
          <Route path="/subscribed-lists/:listId" element={<SubscribedToList />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<h1>This page does not exist</h1>} />
        </Routes>
      </div>


    </div>
  );
}

export default App;
