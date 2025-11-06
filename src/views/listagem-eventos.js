import React from 'react';
import Card from '../components/card';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/evento`;

function ListagemEventos() {

const [dados, setDados] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Todos os Eventos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
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
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nomeEvento}</td>
                      <td>
                        {new Date(dado.dataInicio).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        {new Date(dado.dataFim).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        {dado.horaInicio}
                      </td>
                      <td>{dado.cidade}</td>
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
