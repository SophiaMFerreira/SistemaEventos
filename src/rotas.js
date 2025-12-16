import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar.js';

import Login from './views/login';

import ListagemEventos from './views/listagem-todos-eventos';
import ListagemParticipantes from './views/listagem-dadosEventoParticipante';
import ListagemDadosEvento from './views/listagem-dados-Evento-Inscritos';
import ListagemIngressos from './views/listagem-ingresso';
import MeusEventos from './views/listagem-meus-eventos';
import EventosOrganizados from './views/listagem-eventos-organizados';
import DetalhesEventoOrganizador from './views/listagem-Dados-Eventos-Organizados';

import CadastroTipoEvento from './views/cadastro-tipoEvento';
import CadastroPorteEvento from './views/cadastro-porteEvento';
import CadastroEvento from './views/cadastro-eventos';
import CadastroAdministrador from './views/cadastro-administrador';
import CadastroUsuarioCPF from './views/cadastro-usuarioCPF';
import CadastroUsuarioCNPJ from './views/cadastro-usuarioCNPJ';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />

        <Route path='/listagem-eventos' element={<><Navbar /><ListagemEventos /></>} />
        <Route path="/eventos-organizados" element={<><Navbar /><EventosOrganizados /></>} />
        <Route path="/eventos-organizados/:idParam" element={<><Navbar /><DetalhesEventoOrganizador /></>} />
        <Route path='/listagem-participantes' element={<><Navbar /><ListagemParticipantes /></>} />
        <Route path="/meus-eventos" element={<><Navbar /><MeusEventos /></>} />
        <Route path="/meus-eventos/:idParam" element={<><Navbar /><ListagemDadosEvento  /></>} />
        <Route path="/meus-eventos/:idParam/ingresso" element={<><Navbar /><ListagemIngressos /></>} />
        
        <Route path='/cadastro-tipoEvento/:idParam?' element={<><Navbar /><CadastroTipoEvento /></>} />
        <Route path='/cadastro-porteEvento/:idParam?' element={<><Navbar /><CadastroPorteEvento /></>} />
        <Route path='/cadastro-eventos/:idParam?' element={<><Navbar /><CadastroEvento /></>} />
        <Route path='/cadastro-administrador/:idParam?' element={<><Navbar /><CadastroAdministrador /></>} />
        <Route path='/cadastro-usuarioCPF/:idParam?' element={<CadastroUsuarioCPF />} />
        <Route path='/cadastro-usuarioCNPJ/:idParam?' element={<CadastroUsuarioCNPJ />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
