import React from 'react';

import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';

import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/eventos`;

function ListagemEventos() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-eventos`);
  };

  const editar = (id) => {
    navigate(`/cadastro-eventos/${id}`);
  };

  const [dados, setDados] = React.useState(null);

  async function excluir(id) {
    const url = `${baseURL}/${id}`;
    try {
      await axios.delete(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      mensagemSucesso(`Evento excluído com sucesso!`);
      setDados(dados.filter((dado) => dado.id !== id));
    } catch (error) {
      mensagemErro(`Erro ao excluir o evento.`);
    }
  }

  React.useEffect(() => {
    axios
      .get(baseURL)
      .then((response) => {
        setDados(response.data);
      })
      .catch(() => {
        mensagemErro('Erro ao carregar lista de eventos.');
      });
  }, []);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Listagem de Eventos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-3'
                onClick={() => cadastrar()}
              >
                Novo Evento
              </button>

              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Data Início</th>
                    <th scope='col'>Data Fim</th>
                    <th scope='col'>Cidade</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nome}</td>
                      <td>
                        {new Date(dado.dataInicio).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        {new Date(dado.dataFim).toLocaleDateString('pt-BR')}
                      </td>
                      <td>{dado.cidade}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(dado.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(dado.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
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
