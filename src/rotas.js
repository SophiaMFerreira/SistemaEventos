import React from 'react';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ListagemEventos from './views/listagem-eventos';
import CadastroEvento from './views/cadastro-eventos';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/listagem-eventos' element={<ListagemEventos />} />
        <Route path ='/cadastro-eventos' element={<CadastroEvento />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
