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
import { BASE_URL, BASE_URL_S } from '../config/axios';
import BuscarEvento from '../components/input-buscar-evento';


const baseURL = `${BASE_URL}/evento`;
const baseURLIngresso = `${BASE_URL_S}/ingresso`;

function EventosOrganizados() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-eventos`);
  };

  const editar = (id) => {
    navigate(`/cadastro-eventos/${id}`);
  };

  const idOrganizador = Number(localStorage.getItem("idUsuario"));
  const [dados, setDados] = React.useState(null);
  const [filtro, setFiltro] = React.useState("");
  const [ingressos, setIngressos] = React.useState([]);
  const eventosNotificados = React.useRef(new Set());


  const eventosFiltrados = dados
    ? dados.filter(ev =>
        ev.nomeEvento.toLowerCase().includes(filtro.toLowerCase())
      )
    : [];

  async function excluir(id) {
    let data = JSON.stringify({ id });
    let url = `${baseURL}/${id}`;

    await axios
      .delete(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(function () {
        mensagemSucesso(`Evento excluído com sucesso!`);
        setDados(dados.filter((dado) => dado.id !== id));
      })
      .catch(function () {
        mensagemErro(`Erro ao excluir o evento`);
      });
  }

  React.useEffect(() => {
    async function buscarDados() {
      const respEventos = await axios.get(baseURL);
      const respIngressos = await axios.get(baseURLIngresso);

      const meusEventos = respEventos.data.filter(
        ev => Number(ev.idOrganizador) === idOrganizador
      );

      setDados(meusEventos);
      setIngressos(respIngressos.data);
    }

    buscarDados();
  }, [idOrganizador]);

 React.useEffect(() => {
  if (!dados || ingressos.length === 0) return;

  dados.forEach(dado => {
    const inscritos = ingressos.filter(
      ing => Number(ing.idEvento) === dado.id && !ing.cancelado && ing.pago
    ).length;

    if (
      inscritos >= dado.lotacaoMaxima &&
      !eventosNotificados.current.has(dado.id)
    ) {
      mensagemErro(`Evento ${dado.nomeEvento} atingiu a lotação máxima!`);
      eventosNotificados.current.add(dado.id);
    }
  });
}, [dados, ingressos]);


  if (!dados) return null;

  return (
    <div className="container" style={{ marginTop: '120px' }}>
      <Card title="Eventos Organizados">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">

              <button
                type="button"
                className="btn btn-warning"
                onClick={cadastrar}
              >
                Novo Evento
              </button>

              <BuscarEvento
                value={filtro}
                onChange={setFiltro}
                placeholder="Digite nome do evento"
              />

              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Dia</th>
                    <th>Mês</th>
                    <th>Cidade</th>
                    <th>Quantidade de vagas</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {eventosFiltrados.map((dado) => {
                    const data = new Date(dado.dataInicio);
                    const dia = data.getDate();
                    const mes = data.toLocaleString("pt-BR", { month: "long" });
                    const inscritos = ingressos.filter( ing => Number(ing.idEvento) === dado.id && !ing.cancelado && ing.pago).length;
                    const vagas = inscritos >= dado.lotacaoMaxima ? "Lotação Máxima" : `${inscritos}/${dado.lotacaoMaxima}`;

                    return (
                      <tr key={dado.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/eventos-organizados/${dado.id}`)}>
                        <td>{dado.nomeEvento}</td>
                        <td>{dia}</td>
                        <td>{mes}</td>
                        <td>{dado.cidade}</td>
                        <td>{vagas}</td>
                        <td>
                          <Stack spacing={1} padding={0} direction="row">
                            <IconButton aria-label="edit" onClick={(e) =>  {e.stopPropagation(); editar(dado.id)}}>
                              <EditIcon />
                            </IconButton>

                            <IconButton aria-label="delete" onClick={(e) => {e.stopPropagation(); excluir(dado.id)}}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
  
}

export default EventosOrganizados;
