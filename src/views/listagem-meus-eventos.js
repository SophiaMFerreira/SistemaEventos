import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/axios";
import BuscarEvento from "../components/input-buscar-evento";
import CardEvento from "../components/card-evento";

import { Box, Grid, Typography, Skeleton } from "@mui/material";

const baseURL = `${BASE_URL}/eventos`;
const baseURLIngresso = `${BASE_URL}/ingressos`;

function MeusEventos() {
  const navigate = useNavigate();
  const idParticipante = Number(localStorage.getItem("idUsuario"));
  
  const [eventosInscritos, setEventosInscritos] = useState(null); 
  const [filtro, setFiltro] = useState("");
  
  useEffect(() => {
    async function carregarEventos() {
      try {
        const resEventos = await fetch(baseURL);
        const eventos = await resEventos.json();

        const resIngressos = await fetch(baseURLIngresso);
        const ingressos = await resIngressos.json();

        const meusIngressos = ingressos.filter(
          (i) => Number(i.idParticipante) === idParticipante
        );

        const eventosDoParticipante = eventos.filter((ev) =>
          meusIngressos.some((i) => Number(i.idEvento) === ev.id)
        );

        setEventosInscritos(eventosDoParticipante);
      } catch (err) {
        console.error("Erro ao buscar eventos inscritos:", err);
        setEventosInscritos([]); 
      }
    }

    carregarEventos();
  }, [idParticipante]);

  const eventosFiltrados = eventosInscritos
    ? eventosInscritos.filter((ev) =>
        ev.nome?.toLowerCase().includes(filtro.toLowerCase())
      )
    : [];

  if (eventosInscritos === null) {
    return (
      <div className="container" style={{ marginTop: "120px", marginBottom: "60px" }}>
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rounded" height={350} sx={{ borderRadius: "16px" }} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "120px", marginBottom: "60px" }}>
        
        <Box sx={{ justifyContent: "center", display: "flex", mb: 4 }}>
          <BuscarEvento
            value={filtro}
            onChange={setFiltro}
            placeholder="Digite o nome do evento para buscar..."
          />
        </Box>

        {eventosFiltrados.length === 0 ? (
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 6, 
              textAlign: "center", 
              color: "text.secondary",
              fontWeight: 500 
            }}
          >
            {filtro 
              ? "Nenhum evento corresponde à sua busca." 
              : "Você ainda não está inscrito em nenhum evento."}
          </Typography>
        ) : (
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
        )}
    </div>
  );
}

export default MeusEventos;
