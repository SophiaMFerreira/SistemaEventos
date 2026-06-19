import React from 'react';
import Card from '../components/card';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import BuscarEvento from '../components/input-buscar-evento';
import { useNavigate } from 'react-router-dom';


const baseURL = `${BASE_URL}/eventos`;
const baseTipoURL = `${BASE_URL}/tipoEvento`;

function ListagemEventos() {
 const navigate = useNavigate();
  const [dados, setDados] = React.useState(null);
  const [tiposEvento, setTiposEvento] = React.useState([]);
  const [filtroNome, setFiltroNome] = React.useState('');
const [filtroTipo, setFiltroTipo] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  React.useEffect(() => {
  axios.get(baseTipoURL)
    .then((response) => {
      const res = response.data;
      const tipos = Array.isArray(res) ? res : (res?.content || res?.items || []);
      setTiposEvento(tipos);
      console.log('Tipos evento carregados:', tipos);
    })
    .catch((err) => {
      console.error('Erro ao carregar tipos de evento:', err);
      setTiposEvento([]);
    });
}, []);

  if (!dados) return <p>Carregando eventos...</p>;



const eventosFiltrados = dados.filter(ev => {
  const matchNome = ev.nome.toLowerCase().includes(filtroNome.toLowerCase());
  const matchTipo = filtroTipo ? ev.idTipoEvento === filtroTipo : true;
  return matchNome && matchTipo;
});


  return (
    <div className='container' style={{ marginTop: '120px' }}>
      <Card title='Eventos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
               <BuscarEvento
        value={filtroNome}
        onChange={setFiltroNome}
        placeholder="Digite nome do evento"
      />

      <button style={{ marginBottom: '20px' }}
        className={`btn ${filtroTipo === null ? 'btn-primary' : 'btn-secondary'} me-2`}
        onClick={() => setFiltroTipo(null)}
      >
      Todos os eventos
</button>

{tiposEvento.map(tipo => (
  <button style={{ marginBottom: '20px' }}
    key={tipo.id}
    className={`btn ${filtroTipo === tipo.id ? 'btn-primary' : 'btn-secondary'} me-2`}
    onClick={() => setFiltroTipo(tipo.id)}
  >
    {tipo.nome}
  </button>
))}
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Data Início</th>
                    <th scope='col'>Data Fim</th>
                    <th scope='col'>Hora</th>
                    <th scope='col'>Cidade</th>
                  </tr>
                </thead>
                <tbody>
                  {eventosFiltrados.map((dado) => (
                    <tr key={dado.id}
                    onClick={() => navigate(`/meus-eventos/${dado.id}`)}
                    style={{ cursor: 'pointer' }}   
                    >
                      <td>{dado.nome}</td>
                      
                      <td>{dado.dataHoraInicio ? new Date(dado.dataHoraInicio).toLocaleDateString('pt-BR'): '-'}</td>

                    <td>
                      {dado.dataHoraFim
                        ? new Date(dado.dataHoraFim).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td>
  {dado.dataHoraInicio
    ? new Date(dado.dataHoraInicio).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : '-'}
</td>
                      <td>{dado.endereco.cidade}</td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemEventos;
