import React from 'react';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ListagemEventos from './views/listagem-eventos';
import ListagemParticipantes from './views/listagem-participantes';

import CadastroTipoEvento from './views/cadastro-tipoEvento';
import CadastroPorteEvento from './views/cadastro-porteEvento';
import CadastroAdministrador from './views/cadastro-administrador';
import CadastroUsuario from './views/cadastro-usuario';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/listagem-eventos' element={<ListagemEventos />} />
        <Route path='/listagem-participantes' element={<ListagemParticipantes />} />
        
        <Route path='/cadastro-tipoEvento/:idParam?' element={<CadastroTipoEvento />} />
        <Route path='/cadastro-porteEvento/:idParam?' element={<CadastroPorteEvento />} />
        <Route path='/cadastro-administrador/:idParam?' element={<CadastroAdministrador />} />
        <Route path='/cadastro-usuario/:idParam?' element={<CadastroUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
