import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ListagemEventos from './views/listagem-todos-eventos';

import ListagemParticipantes from './views/listagem-dadosEventoParticipante';
import ListagemDadosEvento from './views/listagem-dados-Evento-Inscritos';

import CadastroTipoEvento from './views/cadastro-tipoEvento';
import CadastroPorteEvento from './views/cadastro-porteEvento';
import CadastroAdministrador from './views/cadastro-administrador';
import CadastroUsuarioCPF from './views/cadastro-usuarioCPF';
import CadastroUsuarioCNPJ from './views/cadastro-usuarioCNPJ';


import CadastroEvento from './views/cadastro-eventos';
import ListagemIngressos from './views/listagem-ingresso';
import MeusEventos from './views/listagem-meus-eventos';
import EventosOrganizados from './views/listagem-eventos-organizados';
import DetalhesEventoOrganizador from './views/listagem-Dados-Eventos-Organizados';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<ListagemEventos />} />
                
        <Route path='/cadastro-tipoEvento/:idParam?' element={<CadastroTipoEvento />} />
        <Route path='/cadastro-porteEvento/:idParam?' element={<CadastroPorteEvento />} />
        <Route path='/cadastro-administrador/:idParam?' element={<CadastroAdministrador />} />
        <Route path='/cadastro-usuarioCPF/:idParam?' element={<CadastroUsuarioCPF />} />   
        <Route path='/cadastro-usuarioCNPJ/:idParam?' element={<CadastroUsuarioCNPJ />} />
       
      <Route path='/cadastro-eventos/:idParam?' element={<CadastroEvento />} />
      <Route path="/eventos-organizados" element={<EventosOrganizados />} />
      <Route path="/eventos-organizados/:idParam" element={<DetalhesEventoOrganizador />} />


      <Route path="/meus-eventos" element={<MeusEventos />} />
      <Route path="/meus-eventos/:idParam" element={<ListagemDadosEvento />} />
      <Route path="/meus-eventos/:idParam/ingresso" element={<ListagemIngressos />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
