import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroEvento() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/evento`;

  const [id, setId] = useState('');
  const [nomeEvento, setNomeEvento] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorIngresso, setValorIngresso] = useState(0);
  const [idadeMinima, setIdadeMinima] = useState(0);
  const [lotacaoMaxima, setLotacaoMaxima] = useState(0);
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [idTipoEvento, setIdTipoEvento] = useState(0);
  const [idPorteEvento, setIdPorteEvento] = useState(0);

  const [dados, setDados] = useState(null);

  const idOrganizador = Number(localStorage.getItem('idUsuario'));

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNomeEvento('');
      setModalidade('');
      setDescricao('');
      setValorIngresso(0);
      setIdadeMinima(0);
      setLotacaoMaxima(0);
      setDataInicio('');
      setHoraInicio('');
      setDataFim('');
      setHoraFim('');
      setCep('');
      setLogradouro('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setEstado('');
      setIdTipoEvento(0);
      setIdPorteEvento(0);
    } else if (dados) {
      setId(dados.id);
      setNomeEvento(dados.nomeEvento);
      setModalidade(dados.modalidade);
      setDescricao(dados.descricao);
      setValorIngresso(dados.valorIngresso);
      setIdadeMinima(dados.idadeMinima);
      setLotacaoMaxima(dados.lotacaoMaxima);
      setDataInicio(dados.dataInicio);
      setHoraInicio(dados.horaInicio);
      setDataFim(dados.dataFim);
      setHoraFim(dados.horaFim);
      setCep(dados.cep);
      setLogradouro(dados.logradouro);
      setNumero(dados.numero);
      setComplemento(dados.complemento);
      setBairro(dados.bairro);
      setCidade(dados.cidade);
      setEstado(dados.estado);
      setIdTipoEvento(dados.idTipoEvento);
      setIdPorteEvento(dados.idPorteEvento);
    }
  }

  async function salvar() {
    if (!idOrganizador) {
      mensagemErro('Usuário não autenticado.');
      return;
    }

    let data = {
      id,
      nomeEvento,
      modalidade,
      descricao,
      valorIngresso,
      idadeMinima,
      lotacaoMaxima,
      dataInicio,
      horaInicio,
      dataFim,
      horaFim,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      idOrganizador,
      idTipoEvento,
      idPorteEvento
    };

    data = JSON.stringify(data);

    if (idParam == null) {
      await axios
        .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
        .then(() => {
          mensagemSucesso(`Evento ${nomeEvento} cadastrado com sucesso!`);
          navigate('/eventos-organizados');
        })
        .catch((error) => mensagemErro(error.response.data));
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(() => {
          mensagemSucesso(`Evento ${nomeEvento} alterado com sucesso!`);
          navigate('/eventos-organizados');
        })
        .catch((error) => mensagemErro(error.response.data));
    }
  }

  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const dados = response.data;

      setDados(dados);

      setId(dados.id);
      setNomeEvento(dados.nomeEvento);
      setModalidade(dados.modalidade);
      setDescricao(dados.descricao);
      setValorIngresso(dados.valorIngresso);
      setIdadeMinima(dados.idadeMinima);
      setLotacaoMaxima(dados.lotacaoMaxima);
      setDataInicio(dados.dataInicio);
      setHoraInicio(dados.horaInicio);
      setDataFim(dados.dataFim);
      setHoraFim(dados.horaFim);
      setCep(dados.cep);
      setLogradouro(dados.logradouro);
      setNumero(dados.numero);
      setComplemento(dados.complemento);
      setBairro(dados.bairro);
      setCidade(dados.cidade);
      setEstado(dados.estado);
      setIdTipoEvento(dados.idTipoEvento);
      setIdPorteEvento(dados.idPorteEvento);
    } catch (error) {
      mensagemErro('Erro ao buscar evento');
    }
  }

  const [dadosTipoEvento, setDadosTipoEvento] = useState(null);
  const [dadosPorteEvento, setDadosPorteEvento] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/tipoEvento`).then((response) => {
      setDadosTipoEvento(response.data);
    });
    axios.get(`${BASE_URL}/porteEvento`).then((response) => {
      setDadosPorteEvento(response.data);
    });
  }, []);

  useEffect(() => {
    if (idParam) {
      buscar();
    } else {
      inicializar();
    }
    // eslint-disable-next-line
  }, [idParam]);

  if (!dadosTipoEvento) return null;
  if (!dadosPorteEvento) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Evento'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome do Evento: *' htmlFor='inputNome'>
                <input
                  type='text'
                  placeholder='Digite o nome do evento'
                  id='inputNome'
                  value={nomeEvento}
                  className='form-control'
                  onChange={(e) => setNomeEvento(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Modalidade: *' htmlFor='selectModalidade'>
                <select
                  id='selectModalidade'
                  className='form-select'
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                >
                  <option value=''>Selecione a modalidade do evento</option>
                  <option value='Presencial'>Presencial</option>
                  <option value='Online'>Online</option>
                  <option value='Híbrido'>Híbrido</option>
                </select>
              </FormGroup>

              <FormGroup label='Tipo de Evento: *' htmlFor='selectTipoEvento'>
                <select
                  className='form-select'
                  id='selectTipoEvento'
                  name='idTipoEvento'
                  value={idTipoEvento}
                  onChange={(e) => setIdTipoEvento(e.target.value)}
                >
                  <option key='0' value='0'>
                    {' '}
                  </option>
                  {dadosTipoEvento.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.nomeTipoEvento}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label='Descrição: *' htmlFor='inputDescricao'>
                <textarea
                  id='inputDescricao'
                  value={descricao}
                  placeholder='Descreva brevemente o evento, atrações e público-alvo'
                  className='form-control'
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Valor do Ingresso: *' htmlFor='inputValor'>
                <input
                  type='number'
                  id='inputValor'
                  value={valorIngresso}
                  className='form-control'
                  disabled={idParam!=null }
                  onChange={(e) => setValorIngresso(e.target.value)}
                  
                />
              </FormGroup>

              <FormGroup label='Idade Mínima: *' htmlFor='inputIdadeMinima'>
                <input
                  type='number'
                  id='inputIdadeMinima'
                  value={idadeMinima}
                  className='form-control'
                  onChange={(e) => setIdadeMinima(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Lotação Máxima: *' htmlFor='inputLotacaoMaxima'>
                <input
                  type='number'
                  id='inputLotacaoMaxima'
                  value={lotacaoMaxima}
                  className='form-control'
                  onChange={(e) => setLotacaoMaxima(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Data de Início: *' htmlFor='inputDataInicio'>
                <input
                  type='date'
                  id='inputDataInicio'
                  value={dataInicio}
                  className='form-control'
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Hora de Início: *' htmlFor='inputHoraInicio'>
                <input
                  type='time'
                  id='inputHoraInicio'
                  value={horaInicio}
                  className='form-control'
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Data de Fim: *' htmlFor='inputDataFim'>
                <input
                  type='date'
                  id='inputDataFim'
                  value={dataFim}
                  className='form-control'
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Hora de Fim: *' htmlFor='inputHoraFim'>
                <input
                  type='time'
                  id='inputHoraFim'
                  value={horaFim}
                  className='form-control'
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </FormGroup>

              <h5 className='mt-4'>Endereço do Evento</h5>
              <FormGroup label='CEP: *' htmlFor='inputCep'>
                <input
                  type='text'
                  id='inputCep'
                  value={cep}
                  className='form-control'
                  onChange={(e) => setCep(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Logradouro: *' htmlFor='inputLogradouro'>
                <input
                  type='text'
                  id='inputLogradouro'
                  value={logradouro}
                  className='form-control'
                  onChange={(e) => setLogradouro(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Número: *' htmlFor='inputNumero'>
                <input
                  type='text'
                  id='inputNumero'
                  value={numero}
                  className='form-control'
                  onChange={(e) => setNumero(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Complemento: *' htmlFor='inputComplemento'>
                <input
                  type='text'
                  id='inputComplemento'
                  value={complemento}
                  className='form-control'
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Bairro: *' htmlFor='inputBairro'>
                <input
                  type='text'
                  id='inputBairro'
                  value={bairro}
                  className='form-control'
                  onChange={(e) => setBairro(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Cidade: *' htmlFor='inputCidade'>
                <input
                  type='text'
                  id='inputCidade'
                  value={cidade}
                  className='form-control'
                  onChange={(e) => setCidade(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Estado: *' htmlFor='inputEstado'>
                <input
                  type='text'
                  id='inputEstado'
                  value={estado}
                  className='form-control'
                  onChange={(e) => setEstado(e.target.value)}
                />
              </FormGroup>

              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
                >
                  Salvar
                </button>
                <button
                  onClick={inicializar}
                  type='button'
                  className='btn btn-danger'
                >
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroEvento;
