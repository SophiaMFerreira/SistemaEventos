import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';
import 'toastr/build/toastr.min';
import 'toastr/build/toastr.css';
import Rotas from './rotas.js';


class App extends React.Component {
  render() {
    return (
      <Rotas />      
    );
  }
}

export default App;