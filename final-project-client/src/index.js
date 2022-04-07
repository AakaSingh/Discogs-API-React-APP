import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.js';
import './index.css';
import Playlist from './Playlist.js';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Header heading="Discog App"/>
    <Playlist/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
