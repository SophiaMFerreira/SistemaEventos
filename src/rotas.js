import React from 'react';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ListagemEventos from './views/listagem-eventos';
import MeusEventos from './components/meus-eventos';
import EventosOrganizados from './components/eventos-organizados';
import CadastroEvento from './views/cadastro-eventos';


function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<ListagemEventos />} />
       <Route path='/cadastro-eventos/:idParam?' element={<CadastroEvento />} />
      <Route path="/meus-eventos/:idParam?" element={<MeusEventos/>} />
      <Route path="/eventos-organizados/:idParam?" element={<EventosOrganizados />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
