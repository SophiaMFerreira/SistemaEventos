import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

export default function CadastroAtividade() {
  const baseURL = `${BASE_URL}/atividades`;
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [acao, setAcao] = useState("Cadastro");
  const [mensagem, setMensagem] = useState("Faça cadastro de uma nova");
  const [acaoButton, setAcaoButton] = useState("Criar");
  const [navegacao, setNavegacao] = useState("/");


  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [cancelado, setCancelado] = useState(false);

  const [idEvento, setIdEvento] = useState(0);
  const [idMinistrante, setIdMinistrante] = useState(0);
  const [idTipoAtividade, setIdTipoAtividade] = useState(0);

  const [dados, setDados] = useState(null);

  const idOrganizador = Number(localStorage.getItem('idUsuario') || 0);

  function inicializar() {
    if (!idParam) {
      setId('');
      setNome('');
      setModalidade('');
      setIdTipoEvento(0);
      setIdPorteEvento(0);
    } else if (dados) {
      setId(dados.id);
      setNome(dados.nome);
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

      if (idadeMinima < 0 || idadeMinima > 18) {
  mensagemErro("A idade mínima deve ser maior ou igual a 18 anos.");
  return;
}

    const dataHoraInicio =
      dataInicio && horaInicio
        ? new Date(`${dataInicio}T${horaInicio}`).toISOString()
        : null;

    const dataHoraFim =
      dataFim && horaFim
        ? new Date(`${dataFim}T${horaFim}`).toISOString()
        : null;

    const payload = {
      id: id || undefined,
      nome,
      modalidade,
      descricao,
      valorIngresso: Number(valorIngresso) || 0,
      idadeMinima: Number(idadeMinima) || 0,
      lotacaoMaxima: Number(lotacaoMaxima) || 0,
      dataHoraInicio,
      dataHoraFim,
      cancelado: false,
      endereco: {
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      },
      idOrganizador,
      idTipoEvento: Number(idTipoEvento) || 0,
      idPorteEvento: Number(idPorteEvento) || 0
    };

    console.log("Payload enviado:", payload);
    try {
      console.log("Payload:", payload);
      if (!idParam) {
        await axios.post(baseURL, payload);
        mensagemSucesso(`Evento ${nome} cadastrado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, payload);
        mensagemSucesso(`Evento ${nome} alterado com sucesso!`);
      }

      navigate('/eventos-organizados');
    } catch (error) {
      mensagemErro(error?.response?.data || error.message || 'Erro ao salvar evento');
    }
  }

  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const dados = response.data;
      setDados(dados);

      setId(dados.id);
      setNome(dados.nome || '');
      setModalidade(dados.modalidade || '');
      setDescricao(dados.descricao || '');
      setValorIngresso(dados.valorIngresso ?? 0);
      setIdadeMinima(dados.idadeMinima ?? 0);
      setLotacaoMaxima(dados.lotacaoMaxima ?? 0);

      if (dados.dataHoraInicio) {
        const di = new Date(dados.dataHoraInicio);
        setDataInicio(di.toISOString().slice(0, 10));
        setHoraInicio(di.toTimeString().slice(0, 5));
      } else {
        setDataInicio('');
        setHoraInicio('');
      }

      if (dados.dataHoraFim) {
        const df = new Date(dados.dataHoraFim);
        setDataFim(df.toISOString().slice(0, 10));
        setHoraFim(df.toTimeString().slice(0, 5));
      } else {
        setDataFim('');
        setHoraFim('');
      }

      if (dados.endereco) {
        setCep(dados.endereco.cep || '');
        setLogradouro(dados.endereco.logradouro || '');
        setNumero(dados.endereco.numero || '');
        setComplemento(dados.endereco.complemento || '');
        setBairro(dados.endereco.bairro || '');
        setCidade(dados.endereco.cidade || '');
        setEstado(dados.endereco.estado || '');
      }

      setIdTipoEvento(dados.idTipoEvento ?? 0);
      setIdPorteEvento(dados.idPorteEvento ?? 0);

    } catch (error) {
      mensagemErro('Erro ao buscar evento');
    }
  }

  useEffect(() => {
  if (idParam) {
    buscar();
  }
}, [idParam]);

  const [dadosTipoEvento, setDadosTipoEvento] = useState([]);
  const [dadosPorteEvento, setDadosPorteEvento] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/tipoEvento`)
      .then((response) => {
        const res = response.data;
        const tipos = Array.isArray(res) ? res : (res?.content || res?.items || []);
        setDadosTipoEvento(tipos);
      })
      .catch(() => setDadosTipoEvento([]));

    axios.get(`${BASE_URL}/porteEvento`)
      .then((response) => {
        const res = response.data;
        const portes = Array.isArray(res) ? res : (res?.content || res?.items || []);
        setDadosPorteEvento(portes);
      })
      .catch(() => setDadosPorteEvento([]));
  }, []);

  if (!dadosTipoEvento) return null;
  if (!dadosPorteEvento) return null;

  return (
    <div className='container' style={{ marginTop: '120px' }}>
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

              <FormGroup label='Modalidade: *' htmlFor='selectModalidade'>
                <select
                  id='selectModalidade'
                  className='form-select'
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                >
                  <option value=''>Selecione</option>
                  <option value='PRESENCIAL'>Presencial</option>
                  <option value='ONLINE'>Online</option>
                  <option value='HIBRIDO'>Híbrido</option>
                </select>
              </FormGroup>

              <FormGroup label='Tipo de Evento: *' htmlFor='selectTipoEvento'>
                <select
                  className='form-select'
                  value={idTipoEvento}
                  onChange={(e) => setIdTipoEvento(Number(e.target.value))}
                >
                  <option value={0}>Selecione</option>

                  {dadosTipoEvento.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.nome || dado.nomeTipoEvento}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label='Descrição: *' htmlFor='inputDescricao'>
                <textarea
                  id='inputDescricao'
                  value={descricao}
                  className='form-control'
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Valor do Ingresso: *'>
                <input
                  type='number'
                  value={valorIngresso}
                  className='form-control'
                  onChange={(e) => setValorIngresso(Number(e.target.value))}
                />
              </FormGroup>

              <FormGroup label='Idade Mínima: *'>
                <input
                  type='number'
                  min='18'
                  max='120'
                  value={idadeMinima}
                  className='form-control'
                  onChange={(e) => setIdadeMinima(Number(e.target.value))}
                />
              </FormGroup>

              <FormGroup label='Porte do Evento: *'>
  <select
    className='form-select'
    value={idPorteEvento}
    onChange={(e) => setIdPorteEvento(Number(e.target.value))}
  >
    <option value={0}>Selecione</option>

    {dadosPorteEvento.map((dado) => (
      <option key={dado.id} value={dado.id}>
        {dado.nome}
      </option>
    ))}
  </select>
</FormGroup>

              <FormGroup label='Lotação Máxima: *'>
                <input
                  type='number'
                  value={lotacaoMaxima}
                  className='form-control'
                  onChange={(e) => setLotacaoMaxima(Number(e.target.value))}
                />
              </FormGroup>

              <FormGroup label='Data de Início: *'>
                <input
                  type='date'
                  value={dataInicio}
                  className='form-control'
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Hora de Início: *'>
                <input
                  type='time'
                  value={horaInicio}
                  className='form-control'
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Data de Fim: *'>
                <input
                  type='date'
                  value={dataFim}
                  className='form-control'
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Hora de Fim: *'>
                <input
                  type='time'
                  value={horaFim}
                  className='form-control'
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </FormGroup>

              <h5 className='mt-4'>Endereço</h5>

              <FormGroup label='CEP:'>
                <input value={cep} className='form-control' onChange={(e) => setCep(e.target.value)} />
              </FormGroup>

              <FormGroup label='Logradouro:'>
                <input value={logradouro} className='form-control' onChange={(e) => setLogradouro(e.target.value)} />
              </FormGroup>

              <FormGroup label='Número:'>
                <input value={numero} className='form-control' onChange={(e) => setNumero(e.target.value)} />
              </FormGroup>

              <FormGroup label='Complemento:'>
                <input value={complemento} className='form-control' onChange={(e) => setComplemento(e.target.value)} />
              </FormGroup>

              <FormGroup label='Bairro:'>
                <input value={bairro} className='form-control' onChange={(e) => setBairro(e.target.value)} />
              </FormGroup>

              <FormGroup label='Cidade:'>
                <input value={cidade} className='form-control' onChange={(e) => setCidade(e.target.value)} />
              </FormGroup>

              <FormGroup label='Estado:'>
                <input value={estado} className='form-control' onChange={(e) => setEstado(e.target.value)} />
              </FormGroup>

              <Stack spacing={1} padding={1} direction='row'>
                <button onClick={salvar} type='button' className='btn btn-success'>
                  Salvar
                </button>

                <button onClick={inicializar} type='button' className='btn btn-danger'>
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
