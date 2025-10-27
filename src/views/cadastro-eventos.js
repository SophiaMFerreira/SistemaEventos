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
  const baseURL = `${BASE_URL}/eventos`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorIngresso, setValorIngresso] = useState('');
  const [idadeMinima, setIdadeMinima] = useState('');
  const [lotacaoMaxima, setLotacaoMaxima] = useState('');
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

  const [dados, setDados] = useState([]);

  function inicializar() {
    setId('');
    setNome('');
    setModalidade('');
    setTipoEvento('');
    setDescricao('');
    setValorIngresso('');
    setIdadeMinima('');
    setLotacaoMaxima('');
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
  }

  async function salvar() {
    let data = {
      id,
      nome,
      modalidade,
      tipoEvento,
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
    };

    try {
      if (idParam == null) {
        await axios.post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso(`Evento ${nome} cadastrado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso(`Evento ${nome} alterado com sucesso!`);
      }
      navigate(`/listagem-eventos`);
    } catch (error) {
      mensagemErro(error.response?.data || 'Erro ao salvar evento.');
    }
  }

  async function buscar() {
    if (!idParam) return;
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const e = response.data;
      setDados(e);
      setId(e.id);
      setNome(e.nome);
      setModalidade(e.modalidade);
      setTipoEvento(e.tipoEvento);
      setDescricao(e.descricao);
      setValorIngresso(e.valorIngresso);
      setIdadeMinima(e.idadeMinima);
      setLotacaoMaxima(e.lotacaoMaxima);
      setDataInicio(e.dataInicio);
      setHoraInicio(e.horaInicio);
      setDataFim(e.dataFim);
      setHoraFim(e.horaFim);
      setCep(e.cep);
      setLogradouro(e.logradouro);
      setNumero(e.numero);
      setComplemento(e.complemento);
      setBairro(e.bairro);
      setCidade(e.cidade);
      setEstado(e.estado);
    } catch (error) {
      mensagemErro('Erro ao buscar dados do evento.');
    }
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, []);

  return (
    <div className='container'>
      <Card title='Cadastro de Evento'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome do Evento: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Modalidade:' htmlFor='selectModalidade'>
                <select
                  id='selectModalidade'
                  className='form-select'
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                >
                  <option value=''>Selecione...</option>
                  <option value='Presencial'>Presencial</option>
                  <option value='Online'>Online</option>
                  <option value='Híbrido'>Híbrido</option>
                </select>
              </FormGroup>

              <FormGroup label='Tipo de Evento:' htmlFor='selectTipo'>
                <select
                  id='selectTipo'
                  className='form-select'
                  value={tipoEvento}
                  onChange={(e) => setTipoEvento(e.target.value)}
                >
                  <option value=''>Selecione...</option>
                  <option value='Palestra'>Palestra</option>
                  <option value='Workshop'>Workshop</option>
                  <option value='Congresso'>Congresso</option>
                  <option value='Show'>Show</option>
                </select>
              </FormGroup>

              <FormGroup label='Descrição:' htmlFor='inputDescricao'>
                <textarea
                  id='inputDescricao'
                  value={descricao}
                  className='form-control'
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Valor do Ingresso:' htmlFor='inputValor'>
                <input
                  type='number'
                  id='inputValor'
                  value={valorIngresso}
                  className='form-control'
                  onChange={(e) => setValorIngresso(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Idade Mínima:' htmlFor='inputIdadeMinima'>
                <input
                  type='number'
                  id='inputIdadeMinima'
                  value={idadeMinima}
                  className='form-control'
                  onChange={(e) => setIdadeMinima(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Lotação Máxima:' htmlFor='inputLotacaoMaxima'>
                <input
                  type='number'
                  id='inputLotacaoMaxima'
                  value={lotacaoMaxima}
                  className='form-control'
                  onChange={(e) => setLotacaoMaxima(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Data de Início:' htmlFor='inputDataInicio'>
                <input
                  type='date'
                  id='inputDataInicio'
                  value={dataInicio}
                  className='form-control'
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Hora de Início:' htmlFor='inputHoraInicio'>
                <input
                  type='time'
                  id='inputHoraInicio'
                  value={horaInicio}
                  className='form-control'
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Data de Fim:' htmlFor='inputDataFim'>
                <input
                  type='date'
                  id='inputDataFim'
                  value={dataFim}
                  className='form-control'
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Hora de Fim:' htmlFor='inputHoraFim'>
                <input
                  type='time'
                  id='inputHoraFim'
                  value={horaFim}
                  className='form-control'
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </FormGroup>

              <h5 className='mt-4'>Endereço do Evento</h5>
              <FormGroup label='CEP:' htmlFor='inputCep'>
                <input
                  type='text'
                  id='inputCep'
                  value={cep}
                  className='form-control'
                  onChange={(e) => setCep(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Logradouro:' htmlFor='inputLogradouro'>
                <input
                  type='text'
                  id='inputLogradouro'
                  value={logradouro}
                  className='form-control'
                  onChange={(e) => setLogradouro(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Número:' htmlFor='inputNumero'>
                <input
                  type='text'
                  id='inputNumero'
                  value={numero}
                  className='form-control'
                  onChange={(e) => setNumero(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Complemento:' htmlFor='inputComplemento'>
                <input
                  type='text'
                  id='inputComplemento'
                  value={complemento}
                  className='form-control'
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Bairro:' htmlFor='inputBairro'>
                <input
                  type='text'
                  id='inputBairro'
                  value={bairro}
                  className='form-control'
                  onChange={(e) => setBairro(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Cidade:' htmlFor='inputCidade'>
                <input
                  type='text'
                  id='inputCidade'
                  value={cidade}
                  className='form-control'
                  onChange={(e) => setCidade(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Estado:' htmlFor='inputEstado'>
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
