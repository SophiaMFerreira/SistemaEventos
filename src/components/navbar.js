import {useEffect, useState} from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';

import NavbarItem from './navbarItem';
import { BASE_URL } from '../config/axios';

function Navbar(props) {  
    const baseURL = `${BASE_URL}/usuario`;
    const [id, setId] = useState(null);
    const [ perfis, setPerfis] = useState([]);
    const [url, setUrl] = useState("/cadastro-administrador");

    useEffect(() => {
        const idParticipante = Number(localStorage.getItem("idUsuario"));
        try {
            const response = await axios.get(`${BASE_URL}/${idParticipante}`);
            const dados = response.data;
            setDados(dados);
      
            setId(dados.id);
            setPerfis(dados.perfis)

            const admin = perfis.includes("ADMINISTRADOR") ? true : false;
            const organizador = perfis.includes("ORGANIZADOR") ? true : false;
            const mediador = perfis.includes("MEDIADOR") ? true : false;
            const participante = id ? true : false;

            if(admin){
              setUrl("/cadastro-administrador")
            }
            
          } catch (error) {
            mensagemErro('Erro ao buscar usuário');
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
