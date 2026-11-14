import { Route, Routes, BrowserRouter } from "react-router-dom";
import RotaPrivada from "./components/RotaPrivada";
import Navbar from "./components/navbar.js";

import Login from "./views/login";

import ListagemEventos from "./views/listagem-todos-eventos";
import ListagemParticipantes from "./views/listagem-dadosEventoParticipante.jsx";
import ListagemDadosEvento from "./views/listagem-dados-Evento-Inscritos";
import ListagemIngressos from "./views/listagem-ingresso";
import MeusEventos from "./views/listagem-meus-eventos";
import EventosOrganizados from "./views/listagem-eventos-organizados";
import MinhaCarteira from "./views/minha-carteira";

import CadastroTipoEvento from "./views/cadastro-tipoEvento";
import CadastroPorteEvento from "./views/cadastro-porteEvento";
import CadastroEvento from "./views/cadastro-eventos";
import CadastroAdministrador from "./views/cadastro-administrador";
import CadastroUsuarioCPF from "./views/cadastro-usuarioCPF";
import CadastroUsuarioCNPJ from "./views/cadastro-usuarioCNPJ";

function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Acesso público */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro-usuarioCPF" element={<CadastroUsuarioCPF />} />
        <Route path="/cadastro-usuarioCNPJ" element={<CadastroUsuarioCNPJ />} />

        {/* Rotas protegidas */}
        <Route element={<RotaPrivada />}>
          <Route
            path="/listagem-eventos"
            element={
              <>
                <Navbar />
                <ListagemEventos />
              </>
            }
          />

          <Route
            path="/eventos-organizados"
            element={
              <>
                <Navbar />
                <EventosOrganizados />
              </>
            }
          />

          <Route
            path="/eventos-organizados/:idParam"
            element={
              <>
                <Navbar />
                <ListagemParticipantes />
              </>
            }
          />

          <Route
            path="/meus-eventos"
            element={
              <>
                <Navbar />
                <MeusEventos />
              </>
            }
          />

          <Route
            path="/meus-eventos/:idParam"
            element={
              <>
                <Navbar />
                <ListagemDadosEvento />
              </>
            }
          />

          <Route
            path="/minha-carteira"
            element={
              <>
                <Navbar />
                <MinhaCarteira />
              </>
            }
          />

          <Route
            path="/meus-eventos/:idParam/ingresso"
            element={
              <>
                <Navbar />
                <ListagemIngressos />
              </>
            }
          />

          <Route
            path="/cadastro-tipoEvento/:idParam?"
            element={
              <>
                <Navbar />
                <CadastroTipoEvento />
              </>
            }
          />

          <Route
            path="/cadastro-porteEvento/:idParam?"
            element={
              <>
                <Navbar />
                <CadastroPorteEvento />
              </>
            }
          />

          <Route
            path="/cadastro-eventos/:idParam?"
            element={
              <>
                <Navbar />
                <CadastroEvento />
              </>
            }
          />

          <Route
            path="/cadastro-administrador/:idParam?"
            element={
              <>
                <Navbar />
                <CadastroAdministrador />
              </>
            }
          />

          <Route
            path="/cadastro-usuarioCPF/:idParam"
            element={
              <>
                <Navbar />
                <CadastroUsuarioCPF />
              </>
            }
          />

          <Route
            path="/cadastro-usuarioCNPJ/:idParam"
            element={
              <>
                <Navbar />
                <CadastroUsuarioCNPJ />
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
