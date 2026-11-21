import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Paper, Typography, TextField, Stack, Button } from "@mui/material";

import Card from "../components/card";
import FormGroup from "../components/form-group";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import "../custom.css";
import axios, { BASE_URL } from "../config/axios";

function CadastroEvento() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/eventos`;

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState(null);
  const [modalidade, setModalidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorIngresso, setValorIngresso] = useState(0);
  const [idadeMinima, setIdadeMinima] = useState(0);
  const [lotacaoMaxima, setLotacaoMaxima] = useState(0);
  const [dataInicio, setDataInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [idTipoEvento, setIdTipoEvento] = useState(0);
  const [idPorteEvento, setIdPorteEvento] = useState(0);

  const [dados, setDados] = useState(null);
  const [idOrganizador, setIdOrganizador] = useState(null);
  const [dadosTipoEvento, setDadosTipoEvento] = useState([]);
  const [dadosPorteEvento, setDadosPorteEvento] = useState([]);

  // Título dinâmico
  const tituloFormulario = idParam ? "Editar Evento" : "Cadastrar Evento";

  function inicializar() {
    if (!idParam) {
      setId("");
      setNome("");
      setModalidade("");
      setDescricao("");
      setValorIngresso(0);
      setIdadeMinima(0);
      setLotacaoMaxima(0);
      setDataInicio("");
      setHoraInicio("");
      setDataFim("");
      setHoraFim("");
      setCep("");
      setLogradouro("");
      setNumero("");
      setComplemento("");
      setBairro("");
      setCidade("");
      setEstado("");
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

  useEffect(() => {
    async function buscarUsuarioAutenticado() {
      try {
        const response = await axios.get(`${BASE_URL}/usuario/me`);
        setIdOrganizador(response.data.id);
      } catch {
        mensagemErro("Não foi possível identificar o usuário autenticado.");
      }
    }
    buscarUsuarioAutenticado();
  }, []);

  async function salvar() {
    if (!idOrganizador) {
      mensagemErro("Aguarde a identificação do usuário autenticado.");
      return;
    }
    if (idadeMinima < 18) {
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
        estado,
      },
      idOrganizador,
      idTipoEvento: Number(idTipoEvento) || 0,
      idPorteEvento: Number(idPorteEvento) || 0,
    };

    try {
      let eventoId = idParam;
      if (!idParam) {
        const response = await axios.post(baseURL, payload);
        eventoId = response.data.id || response.data;
        mensagemSucesso(`Evento ${nome} cadastrado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, payload);
        mensagemSucesso(`Evento ${nome} alterado com sucesso!`);
      }

      if (imagem && eventoId) {
        const formData = new FormData();
        formData.append("file", imagem);
        await axios.post(`${baseURL}/${eventoId}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/eventos-organizados");
    } catch (error) {
      mensagemErro(
        error?.response?.data || error.message || "Erro ao salvar evento",
      );
    }
  }

  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const d = response.data;
      setDados(d);
      setId(d.id);
      setNome(d.nome || "");
      setModalidade(d.modalidade || "");
      setDescricao(d.descricao || "");
      setValorIngresso(d.valorIngresso ?? 0);
      setIdadeMinima(d.idadeMinima ?? 0);
      setLotacaoMaxima(d.lotacaoMaxima ?? 0);

      if (d.dataHoraInicio) {
        const di = new Date(d.dataHoraInicio);
        setDataInicio(di.toISOString().slice(0, 10));
        setHoraInicio(di.toTimeString().slice(0, 5));
      } else {
        setDataInicio("");
        setHoraInicio("");
      }

      if (d.dataHoraFim) {
        const df = new Date(d.dataHoraFim);
        setDataFim(df.toISOString().slice(0, 10));
        setHoraFim(df.toTimeString().slice(0, 5));
      } else {
        setDataFim("");
        setHoraFim("");
      }

      if (d.endereco) {
        setCep(d.endereco.cep || "");
        setLogradouro(d.endereco.logradouro || "");
        setNumero(d.endereco.numero || "");
        setComplemento(d.endereco.complemento || "");
        setBairro(d.endereco.bairro || "");
        setCidade(d.endereco.cidade || "");
        setEstado(d.endereco.estado || "");
      }
      setIdTipoEvento(d.idTipoEvento ?? 0);
      setIdPorteEvento(d.idPorteEvento ?? 0);
    } catch {
      mensagemErro("Erro ao buscar evento");
    }
  }

  useEffect(() => {
    if (idParam) buscar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/tipoEvento`)
      .then((r) => {
        const res = r.data;
        setDadosTipoEvento(
          Array.isArray(res) ? res : res?.content || res?.items || [],
        );
      })
      .catch(() => setDadosTipoEvento([]));

    axios
      .get(`${BASE_URL}/porteEvento`)
      .then((r) => {
        const res = r.data;
        setDadosPorteEvento(
          Array.isArray(res) ? res : res?.content || res?.items || [],
        );
      })
      .catch(() => setDadosPorteEvento([]));
  }, []);

  if (!dadosTipoEvento || !dadosPorteEvento) return null;

  // Faixa de participantes do porte selecionado
  const porteSelecionado = dadosPorteEvento.find((p) => p.id === idPorteEvento);
  const faixaPorte = porteSelecionado
    ? `Faixa permitida: ${porteSelecionado.minParticipantes} a ${porteSelecionado.maxParticipantes} participantes`
    : null;

  return (
    <div
      className="container"
      style={{ marginTop: "90px", marginBottom: "60px" }}
    >
      <Card title={tituloFormulario}>
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <FormGroup label="Nome do Evento: *" htmlFor="inputNome">
                <input
                  type="text"
                  id="inputNome"
                  value={nome}
                  className="form-control"
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Imagem do Evento:">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setImagem(e.target.files[0])}
                />
              </FormGroup>

              <FormGroup label="Modalidade: *" htmlFor="selectModalidade">
                <select
                  id="selectModalidade"
                  className="form-select"
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="ONLINE">Online</option>
                  <option value="HIBRIDO">Híbrido</option>
                </select>
              </FormGroup>

              <FormGroup label="Tipo de Evento: *" htmlFor="selectTipoEvento">
                <select
                  className="form-select"
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

              <FormGroup label="Descrição: *" htmlFor="inputDescricao">
                <textarea
                  id="inputDescricao"
                  value={descricao}
                  className="form-control"
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Valor do Ingresso: *">
                <input
                  type="number"
                  value={valorIngresso}
                  className="form-control"
                  onChange={(e) => setValorIngresso(Number(e.target.value))}
                />
              </FormGroup>

              <FormGroup label="Idade Mínima: *">
                <input
                  type="number"
                  min="18"
                  max="120"
                  value={idadeMinima}
                  className="form-control"
                  onChange={(e) => setIdadeMinima(Number(e.target.value))}
                />
              </FormGroup>

              {/* Porte com faixa informativa */}
              <FormGroup label="Porte do Evento: *">
                <select
                  className="form-select"
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
                {faixaPorte && (
                  <small
                    style={{
                      color: "#1E66F5",
                      marginTop: "4px",
                      display: "block",
                      fontSize: "0.82rem",
                    }}
                  >
                    ℹ️ {faixaPorte}
                  </small>
                )}
              </FormGroup>

              <FormGroup label="Lotação Máxima: *">
                <input
                  type="number"
                  value={lotacaoMaxima}
                  className="form-control"
                  onChange={(e) => setLotacaoMaxima(Number(e.target.value))}
                />
              </FormGroup>

              {/* Data e Hora lado a lado */}
              <div className="row">
                <div className="col-md-6">
                  <FormGroup label="Data de Início: *">
                    <input
                      type="date"
                      value={dataInicio}
                      className="form-control"
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup label="Hora de Início: *">
                    <input
                      type="time"
                      value={horaInicio}
                      className="form-control"
                      onChange={(e) => setHoraInicio(e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FormGroup label="Data de Fim: *">
                    <input
                      type="date"
                      value={dataFim}
                      className="form-control"
                      onChange={(e) => setDataFim(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup label="Hora de Fim: *">
                    <input
                      type="time"
                      value={horaFim}
                      className="form-control"
                      onChange={(e) => setHoraFim(e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>

              <h6
                className="mt-3 mb-2"
                style={{ fontWeight: 600, color: "#0B3B91" }}
              >
                Endereço
              </h6>

              <div className="row">
                <div className="col-md-4">
                  <FormGroup label="CEP:">
                    <input
                      value={cep}
                      className="form-control"
                      onChange={(e) => setCep(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup label="Logradouro:">
                    <input
                      value={logradouro}
                      className="form-control"
                      onChange={(e) => setLogradouro(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-2">
                  <FormGroup label="Número:">
                    <input
                      value={numero}
                      className="form-control"
                      onChange={(e) => setNumero(e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <FormGroup label="Complemento:">
                    <input
                      value={complemento}
                      className="form-control"
                      onChange={(e) => setComplemento(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-4">
                  <FormGroup label="Bairro:">
                    <input
                      value={bairro}
                      className="form-control"
                      onChange={(e) => setBairro(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-4">
                  <FormGroup label="Cidade:">
                    <input
                      value={cidade}
                      className="form-control"
                      onChange={(e) => setCidade(e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <FormGroup label="Estado:">
                    <input
                      value={estado}
                      className="form-control"
                      onChange={(e) => setEstado(e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>

              <Grid
                size={12}
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Stack
                  spacing={2}
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="flex-end"
                  alignItems="flex-end"
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => navigate("/eventos-organizados")}
                  >
                    Cancelar
                  </Button>
                  <Button variant="contained" onClick={salvar}>
                    Salvar
                  </Button>
                </Stack>
              </Grid>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroEvento;
