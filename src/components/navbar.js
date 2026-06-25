import { useEffect, useState } from "react";
import "bootswatch/dist/flatly/bootstrap.css";
import NavbarItem from "./navbarItem";
import { mensagemErro } from "../components/toastr";

import {api} from "../config/axios";

function Navbar() {
  const baseURL = '/usuario';

  const [usuario, setUsuario] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [participante, setParticipante] = useState(false);

  useEffect(() => {
    async function carregarUsuario() {
      const idUsuario = Number(localStorage.getItem("idUsuario"));

      if (!idUsuario) return;

      try {
        const response = await api.get(`${baseURL}/${idUsuario}`);
        const dados = response.data;

        setUsuario(dados);

        if (dados.perfis?.includes("ADMINISTRADOR")) {
          setAdmin(true);
        }

        setParticipante(true);
      } catch (error) {
        mensagemErro("Erro ao buscar usuário");
      }
    }

    carregarUsuario();
  }, []);

  const obterUrlPerfil = () => {
    if (!usuario) return "#";

    if (usuario.perfis?.includes("ADMINISTRADOR")) {
      return `/cadastro-administrador/${usuario.id}`;
    }

    if (usuario.tipoUsuario === "PF") {
      return `/cadastro-usuarioCPF/${usuario.id}`;
    }

    if (usuario.tipoUsuario === "PJ") {
      return `/cadastro-usuarioCNPJ/${usuario.id}`;
    }

    return "#";
  };

  const logout = () => {
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
      <div className="container">
        <a href="/listagem-eventos" className="navbar-brand">
          EVENT +
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarResponsive">

          <ul className="navbar-nav">
            <NavbarItem
              render={admin}
              href="/cadastro-porteEvento"
              label="Novo porte de evento"
            />
          </ul>

          <ul className="navbar-nav">
            <NavbarItem
              render={admin}
              href="/cadastro-tipoEvento"
              label="Novo tipo de evento"
            />
          </ul>

          <ul className="navbar-nav">
            <NavbarItem
              render={participante}
              href="/eventos-organizados"
              label="Sou organizador"
            />
          </ul>

          <ul className="navbar-nav">
            <NavbarItem
              render={participante}
              href="/meus-eventos"
              label="Meus Eventos"
            />
          </ul>

          <ul className="navbar-nav">
            <NavbarItem
              render={participante}
              href={obterUrlPerfil()}
              label="Perfil"
            />
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                onClick={logout}
                className="btn btn-link nav-link"
                style={{
                  color: "white",
                  textDecoration: "none",
                  border: "none",
                }}
              >
                Sair
              </button>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
}

export default Navbar;
