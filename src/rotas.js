import React from 'react';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ListagemEventos from './views/listagem-eventos';
import ListagemParticipantes from './views/listagem-participantes';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/listagem-eventos' element={<ListagemEventos />} />
        <Route path='/listagem-participantes' element={<ListagemParticipantes />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default Rotas;
