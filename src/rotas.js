import React from 'react';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ListagemEventos from './views/listagem-eventos';
import ListagemParticipantes from './views/listagem-participantes';

import CadastroTipoEvento from './views/cadastro-tipoEvento';
import CadastroPorteEvento from './views/cadastro-porteEvento';
import CadastroAdministrador from './views/cadastro-administrador';
import CadastroUsuarioCPF from './views/cadastro-usuarioCPF';
import CadastroUsuarioCNPJ from './views/cadastro-usuarioCNPJ';
import Login from './views/login';


function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route path='/cadastro-tipoEvento/:idParam?' element={<CadastroTipoEvento />} />
        <Route path='/cadastro-porteEvento/:idParam?' element={<CadastroPorteEvento />} />
        <Route path='/cadastro-administrador/:idParam?' element={<CadastroAdministrador />} />
        <Route path='/cadastro-usuarioCPF/:idParam?' element={<CadastroUsuarioCPF />} />
        <Route path='/cadastro-usuarioCNPJ/:idParam?' element={<CadastroUsuarioCNPJ />} />

        <Route path='/listagem-eventos' element={<ListagemEventos />} />
        <Route path='/listagem-participantes' element={<ListagemParticipantes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
