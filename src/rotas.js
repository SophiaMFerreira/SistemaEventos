import React from 'react';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ListagemEventos from './views/listagem-eventos';
import MeusEventos from './components/meus-eventos';
import EventosOrganizados from './components/eventos-organizados';
import CadastroEvento from './views/cadastro-eventos';
import ListagemIngressos from './views/listagem-ingresso';


function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<ListagemEventos />} />
       <Route path='/cadastro-eventos/:idParam?' element={<CadastroEvento />} />
      <Route path="/meus-eventos" element={<MeusEventos/>} />
      <Route path="/eventos-organizados/:idParam?" element={<EventosOrganizados />} />
      <Route path="/meus-eventos/:idEvento/ingresso" element={<ListagemIngressos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
