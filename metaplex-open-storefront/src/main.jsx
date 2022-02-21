import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { extendBorsh } from './borsh'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

extendBorsh()