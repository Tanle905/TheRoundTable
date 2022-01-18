import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Header from './Header'
import Message from './Message'

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <Message />
  </React.StrictMode>,
  document.getElementById('root')
)
