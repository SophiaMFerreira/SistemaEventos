import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ListagemEventos from './views/listagem-eventos';
import MeusEventos from './components/meus-eventos';
import EventosOrganizados from './components/eventos-organizados';


function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<ListagemEventos />} />
      <Route path="/meus-eventos" element={<MeusEventos idParticipante={3} />} />
      <Route path="/eventos-organizados" element={<EventosOrganizados idOrganizador={2}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
