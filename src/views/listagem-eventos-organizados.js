import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {api} from "../config/axios";
import { mensagemSucesso, mensagemErro, mensagemAlert } from "../components/toastr";
import BuscarEvento from "../components/input-buscar-evento";
import "../custom.css";
import {
  Grid,
  Button,
  Box,
  Typography,
  Skeleton,
  Card as MuiCard,
  CardMedia,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import imagemPadrao from "../assets/evento-default.jpg"; 

const baseURL = '/eventos';
const baseURLIngresso = '/ingressos';

function EventosOrganizados() {
  const navigate = useNavigate();
  const idOrganizador = Number(localStorage.getItem("idUsuario"));

  const [dados, setDados] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [ingressos, setIngressos] = useState([]);

  const eventosNotificados = useRef(new Set(
    JSON.parse(localStorage.getItem(`notificados_${idOrganizador}`)) || []
  ));

  const cadastrar = () => navigate(`/cadastro-eventos`);
  const editar = (id) => navigate(`/cadastro-eventos/${id}`);

  async function excluir(id) {
    let url = `${baseURL}/${id}`;
    try {
      await api.delete(url, {
        data: { id },
        headers: { "Content-Type": "application/json" },
      });
      mensagemSucesso("Evento excluído com sucesso!");
      setDados(dados.filter((dado) => dado.id !== id));
    } catch (error) {
      mensagemErro("Erro ao excluir o evento");
    }
  }

  useEffect(() => {
    async function buscarDados() {
      try {
        const respEventos = await api.get(baseURL);
        const respIngressos = await api.get(baseURLIngresso);

        const meusEventos = respEventos.data.filter(
          (ev) => Number(ev.idOrganizador) === idOrganizador,
        );

        setDados(meusEventos);
        setIngressos(respIngressos.data);
      } catch (error) {
        console.error(error);
        mensagemErro("Erro ao carregar os dados");
      }
    }
    buscarDados();
  }, [idOrganizador]);

  useEffect(() => {
    if (!dados || ingressos.length === 0) return;

    let houveNovaNotificacao = false;

    dados.forEach((dado) => {
      const inscritos = ingressos.filter(
        (ing) => Number(ing.idEvento) === dado.id && ing.status === "PAGO",
      ).length;

      if (
        inscritos >= dado.lotacaoMaxima &&
        !eventosNotificados.current.has(dado.id)
      ) {
        mensagemAlert(`Evento ${dado.nome} atingiu a lotação máxima!`);
        eventosNotificados.current.add(dado.id);
        houveNovaNotificacao = true;
      }
    });

    if (houveNovaNotificacao) {
      localStorage.setItem(
        `notificados_${idOrganizador}`,
        JSON.stringify(Array.from(eventosNotificados.current))
      );
    }
  }, [dados, ingressos, idOrganizador]);

  const formatarMes = (data) => {
    if (!data) return "";
    return new Date(data)
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "")
      .toUpperCase();
  };

  const formatarDia = (data) => {
    if (!data) return "";
    return String(new Date(data).getDate()).padStart(2, "0");
  };

  const eventosFiltrados = dados
    ? dados.filter((ev) => ev.nome.toLowerCase().includes(filtro.toLowerCase()))
    : [];

  if (!dados) {
    return (
      <div
        className="container"
        style={{ marginTop: "120px", marginBottom: "60px" }}
      >
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton
                variant="rounded"
                height={360}
                sx={{ borderRadius: "18px" }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{ marginTop: "120px", marginBottom: "60px" }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={cadastrar}>
          Novo Evento
        </Button>
      </Box>

      <Box sx={{ justifyContent: "center", display: "flex", mb: 4 }}>
        <BuscarEvento
          value={filtro}
          onChange={setFiltro}
          placeholder="Digite o nome do evento para buscar..."
        />
      </Box>

      <Grid container spacing={4}>
        {eventosFiltrados.map((evento) => {
          const totalInscritos = ingressos.filter(
            (ing) =>
              Number(ing.idEvento) === Number(evento.id) &&
              ing.status === "PAGO",
          ).length;

          const isLotado = totalInscritos >= (evento.lotacaoMaxima || 0);

          return (
            <Grid item xs={12} sm={6} md={4} key={evento.id}>
              <MuiCard
                onClick={() => navigate(`/eventos-organizados/${evento.id}`)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "18px",
                  overflow: "hidden",
                  height: "100%",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: "1px solid #eee",
                  transition: "all .3s ease",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.03)",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "#1E66F5",
                    boxShadow: "0px 15px 35px rgba(30, 102, 245, 0.1)",
                  },
                  "&:hover img": {
                    transform: "scale(1.05)",
                  },
                  "&:hover .admin-btn": {
                    opacity: 1,
                  },
                }}
              >
                <Box
                  className="admin-btn"
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    zIndex: 10,
                    display: "flex",
                    gap: 1,
                    opacity: { xs: 1, md: 0 },
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <Tooltip title="Editar Evento">
                    <IconButton
                      size="small"
                      onClick={() => editar(evento.id)}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.90)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid #eee",
                        color: "#1E66F5",
                        "&:hover": {
                          backgroundColor: "#1E66F5",
                          color: "#fff",
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Excluir Evento">
                    <IconButton
                      size="small"
                      onClick={() => excluir(evento.id)}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.90)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid #eee",
                        color: "#d32f2f",
                        "&:hover": {
                          backgroundColor: "#d32f2f",
                          color: "#fff",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ overflow: "hidden", height: 230 }}>
                  <CardMedia
                    component="img"
                    height="230"
                    image={
                      evento.imagem
                        ? `/eventos/imagem/${evento.imagem}`
                        : imagemPadrao
                    }
                    alt={evento.nome}
                    sx={{
                      transition: "transform .4s ease",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <CardContent
                  sx={{
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  <Box sx={{ display: "flex", flexGrow: 1, mb: 2 }}>
                    <Box sx={{ minWidth: 50, textAlign: "center", mr: 2 }}>
                      <Typography
                        sx={{ color: "#FF6B00", fontWeight: 700, fontSize: 13 }}
                      >
                        {formatarMes(evento.dataHoraInicio)}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#0B3B91",
                          fontWeight: 700,
                          fontSize: 22,
                          lineHeight: 1,
                        }}
                      >
                        {formatarDia(evento.dataHoraInicio)}
                      </Typography>
                    </Box>

                    <Box flex={1}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "#0B3B91",
                          mb: 0.5,
                          lineHeight: 1.2,
                        }}
                      >
                        {evento.nome}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#666",
                          mb: 1,
                          fontWeight: 500,
                        }}
                      >
                        {evento.dataHoraInicio
                          ? `${new Date(evento.dataHoraInicio).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h`
                          : "-"}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationOnIcon sx={{ fontSize: 16, color: "#888" }} />
                        <Typography
                          sx={{ fontSize: 13, color: "#888", fontWeight: 500 }}
                        >
                          {evento.endereco?.cidade || "Não informada"}
                          {evento.endereco?.estado
                            ? `, ${evento.endereco.estado}`
                            : ""}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{ mt: "auto", pt: 1, borderTop: "1px solid #f9f9f9" }}
                  >
                    {isLotado ? (
                      <Chip
                        label="LOTAÇÃO MÁXIMA"
                        size="small"
                        sx={{
                          backgroundColor: "#d32f2f",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                          px: 0.5,
                        }}
                      />
                    ) : (
                      <Chip
                        icon={
                          <PeopleAltOutlinedIcon
                            style={{ fontSize: 14, color: "#666" }}
                          />
                        }
                        label={`${totalInscritos} / ${evento.lotacaoMaxima || 0} vagas`}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: "#e0e0e0",
                          color: "text.secondary",
                          fontWeight: 600,
                          fontSize: "12px",
                          borderRadius: "6px",
                          backgroundColor: "#fafafa",
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </MuiCard>
            </Grid>
          );
        })}
      </Grid>

      {eventosFiltrados.length === 0 && (
        <Typography
          sx={{ mt: 6, textAlign: "center", color: "text.secondary" }}
        >
          Nenhum evento organizado encontrado.
        </Typography>
      )}
    </div>
  );
}

export default EventosOrganizados;
