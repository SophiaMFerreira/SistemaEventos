import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/axios";
import BuscarEvento from "../components/input-buscar-evento";
import CardEvento from "../components/card-evento"; 
import "../custom.css";

import Skeleton from "@mui/material/Skeleton";
import { Grid, Button, Stack, Box, Typography } from "@mui/material";

const baseURL = `${BASE_URL}/eventos`;
const baseTipoURL = `${BASE_URL}/tipoEvento`;

function ListagemEventos() {
  const navigate = useNavigate();
  const [dados, setDados] = React.useState(null);
  const [tiposEvento, setTiposEvento] = React.useState([]);
  const [filtroNome, setFiltroNome] = React.useState("");
  const [filtroTipo, setFiltroTipo] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  React.useEffect(() => {
    axios
      .get(baseTipoURL)
      .then((response) => {
        const res = response.data;
        const tipos = Array.isArray(res)
          ? res
          : res?.content || res?.items || [];
        setTiposEvento(tipos);
      })
      .catch((err) => {
        console.error("Erro ao carregar tipos de evento:", err);
        setTiposEvento([]);
      });
  }, []);

  if (!dados) {
    return (
      <div
        className="container"
        style={{ marginTop: "120px", marginBottom: "60px" }}
      >
        <Grid container spacing={4}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton
                variant="rounded"
                height={360}
                sx={{ borderRadius: "16px" }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  const eventosFiltrados = dados.filter((ev) => {
    const matchNome = ev.nome.toLowerCase().includes(filtroNome.toLowerCase());
    const matchTipo = filtroTipo ? ev.idTipoEvento === filtroTipo : true;
    return matchNome && matchTipo;
  });

  return (
    <div
      className="container"
      style={{ marginTop: "120px", marginBottom: "60px" }}
    >
      <Box sx={{ justifyContent: "center", display: "flex", mb: 4 }}>
        <BuscarEvento
          value={filtroNome}
          onChange={setFiltroNome}
          placeholder="Digite nome do evento"
        />
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{ flexWrap: "wrap", mb: 4, gap: 1 }}
      >
        <Button
          variant={filtroTipo === null ? "contained" : "outlined"}
          onClick={() => setFiltroTipo(null)}
          sx={{
            borderRadius: "24px",
            textTransform: "none",
            fontWeight: 600,
            bgcolor: filtroTipo === null ? "#1E66F5" : "transparent",
            borderColor: "#1E66F5",
            color: filtroTipo === null ? "#fff" : "#1E66F5",
          }}
        >
          Todos os eventos
        </Button>

      
        {tiposEvento.map((tipo) => (
          <Button
            key={tipo.id}
            variant={filtroTipo === tipo.id ? "contained" : "outlined"}
            onClick={() => setFiltroTipo(tipo.id)}
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              fontWeight: 600,
              bgcolor: filtroTipo === tipo.id ? "#1E66F5" : "transparent",
              borderColor: "#1E66F5",
              color: filtroTipo === tipo.id ? "#fff" : "#1E66F5",
            }}
          >
            {tipo.nome}
          </Button>
        ))}
      </Stack>

      <Grid container spacing={4}>
        {eventosFiltrados.map((evento) => (
          <Grid item xs={12} sm={6} md={4} key={evento.id}>
            <CardEvento
              dado={evento}
              onClick={() => navigate(`/meus-eventos/${evento.id}`)}
            />
          </Grid>
        ))}
      </Grid>

      {eventosFiltrados.length === 0 && (
        <Typography
          sx={{ mt: 6, textAlign: "center", color: "text.secondary" }}
        >
          Nenhum evento encontrado.
        </Typography>
      )}
    </div>
  );
}

export default ListagemEventos;
