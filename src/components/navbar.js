import {useEffect, useState} from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';

import NavbarItem from './navbarItem';

function Navbar(props) {
    const [admin, setAdmin] = useState(false);
    const [url, setUrl] = useState("/cadastro-administrador");
    const [id, setId] = useState(null);

    useEffect(() => {
        const idParticipante = Number(localStorage.getItem("idUsuario"));
        const tipoParticipante = localStorage.getItem("tipoParticipante");

          if (!idParticipante || !tipoParticipante) return;
          setId(idParticipante);

        if (tipoParticipante === "admin") {
          setAdmin(true);
          setUrl("/cadastro-administrador");
          return;
        }
        if (tipoParticipante === "cpf") {
          setUrl("/cadastro-usuarioCPF");
        }
        if (tipoParticipante === "cnpj") {
          setUrl("/cadastro-usuarioCNPJ");
        }
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
            <NavbarItem render={admin} href='/cadastro-porteEvento' label='Novo porte de evento' />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render={admin} href='/cadastro-tipoEvento' label='Novo tipo de evento' />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render={admin} href='/cadastro-tipoAtividade' label='Novo tipo de atividade' />
          </ul>

          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/eventos-organizados' label='Sou organizador' />
          </ul>

          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/meus-eventos' label='Meus Eventos' />
          </ul>

          <ul className='navbar-nav'>
            <NavbarItem render={id !== null} href={`${url}/${id}`} label='Perfil' />
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
