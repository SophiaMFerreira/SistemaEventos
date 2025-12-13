import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ListagemEventos from './views/listagem-eventos';
import ListagemParticipantes from './views/listagem-dadosEventoParticipante';
import ListagemDadosEvento from './views/listagem-dadosEvento';

import CadastroTipoEvento from './views/cadastro-tipoEvento';
import CadastroPorteEvento from './views/cadastro-porteEvento';
import CadastroAdministrador from './views/cadastro-administrador';
import CadastroUsuarioCPF from './views/cadastro-usuarioCPF';
import CadastroUsuarioCNPJ from './views/cadastro-usuarioCNPJ';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/listagem-eventos' element={<ListagemEventos />} />
        <Route path='/listagem-dadosEventoParticipante/:idParam' element={<ListagemParticipantes />} />
        <Route path='/listagem-dadosEvento/:idParam' element={<ListagemDadosEvento />} />
        
        <Route path='/cadastro-tipoEvento/:idParam?' element={<CadastroTipoEvento />} />
        <Route path='/cadastro-porteEvento/:idParam?' element={<CadastroPorteEvento />} />
        <Route path='/cadastro-administrador/:idParam?' element={<CadastroAdministrador />} />
        <Route path='/cadastro-usuarioCPF/:idParam?' element={<CadastroUsuarioCPF />} />
        <Route path='/cadastro-usuarioCNPJ/:idParam?' element={<CadastroUsuarioCNPJ />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
