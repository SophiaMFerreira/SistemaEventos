import {useEffect, useState} from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';

import NavbarItem from './navbarItem';

import axios from 'axios';
import { BASE_URL_S } from '../config/axios';

function Navbar(props) {
    const [organizador, setOrganizador] = useState(false);
    const [url, setUrl] = useState("/cadastro-administrador");
    const [idParticipante, setIdParticipante] = useState(null);

    useEffect(() => {
        const id = Number(localStorage.getItem("idUsuario"));
        const tipoParticipante = localStorage.getItem("tipoParticipante");

        if (!id || !tipoParticipante) return;
        setIdParticipante(id);

        if (tipoParticipante === "admin") {
          setOrganizador(true);
          setUrl("/cadastro-administrador");
          return;
        }

        let baseURL = "";
        if (tipoParticipante === "cpf") {
          baseURL = `${BASE_URL_S}/participanteCPF`;
          setUrl("/cadastro-usuarioCPF");
        }
        if (tipoParticipante === "cnpj") {
          baseURL = `${BASE_URL_S}/participanteCNPJ`;
          setUrl("/cadastro-usuarioCNPJ");
        }
        axios.get(`${baseURL}/${id}`)
          .then((response) => {
            setOrganizador(response.data.organizador);
          })
          .catch(() => {
            setOrganizador(false);
          });
      }, []); 

  return (
    <div className='navbar navbar-expand-lg fixed-top navbar-dark bg-primary'>
      <div className='container'>
        <a href='/listagem-eventos' className='navbar-brand'>
          EVENT +
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarResponsive'
          aria-controls='navbarResponsive'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarResponsive'>
          
          <ul className='navbar-nav'>
            <NavbarItem render={organizador} href='/eventos-organizados' label='Sou organizador' />
          </ul>

          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/meus-eventos' label='Meus Eventos' />
          </ul>

          <ul className='navbar-nav'>
            <NavbarItem render='true' href={`${url}/${idParticipante}`} label='Perfil' />
          </ul>

          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/' label='Sair' />
            </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
