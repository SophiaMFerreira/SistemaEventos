import {useEffect, useState} from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';
import NavbarItem from './navbarItem';
import { mensagemErro } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function Navbar(props) {  
    const baseURL = `${BASE_URL}/usuario`;
    const [id, setId] = useState(null);
    const [ perfis, setPerfis] = useState([]);
    const [url, setUrl] = useState("/cadastro-administrador");

    const [admin, setAdmin] = useState(false);
    const [organizador, setOrganizador]=  useState(false);
    const [mediador, setMediador] = useState(false);
    const [participante, setParticipante] = useState(false);

    useEffect(() => {
      async function carregarUsuario() {
        const idUsuario = Number(localStorage.getItem("idUsuario"));

        if (!idUsuario) return;
        try {
          const response = await axios.get(`${baseURL}/${idUsuario}`);
          const dados = response.data;
        
          setId(dados.id);
          setPerfis(dados.perfis);
        
          if(perfis.includes("ADMINISTRADOR")){
            setAdmin(true);
            setUrl("/cadastro-administrador");
          } 
          if(perfis.includes("ORGANIZADOR")){
            setOrganizador(true);
          }
          if(perfis.includes("MEDIADOR")){
            setMediador(true);
          }
          if(id ){
            setParticipante(true);
          }
        } catch (error) {
          mensagemErro("Erro ao buscar usuário");
        }
      }
    
      carregarUsuario();
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
          {/*<ul className='navbar-nav'>
            <NavbarItem render={admin} href='/cadastro-tipoAtividade' label='Novo tipo de atividade' />
          </ul>*/}

          <ul className='navbar-nav'>
            <NavbarItem render={admin || mediador || organizador} href='/eventos-organizados' label='Sou organizador' />
          </ul>

          <ul className='navbar-nav'>
            <NavbarItem render={participante} href='/meus-eventos' label='Meus Eventos' />
          </ul>

          <ul className='navbar-nav'>
            <NavbarItem render={participante} href={`${url}/${id}`} label='Perfil' />
          </ul>

          <ul className='navbar-nav'>
            <NavbarItem render={participante} href='/' label='Sair' />
            </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;