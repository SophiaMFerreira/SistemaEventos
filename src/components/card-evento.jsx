import React from "react";
import { Card as MuiCard, CardMedia, CardContent, Typography, Box } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { BASE_URL } from "../config/axios";
import imagemPadrao from "../assets/evento-default.jpg";

function CardEvento({ dado, onClick }) {
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

  return (
    <MuiCard
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderRadius: "16px",
        overflow: "hidden",
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #eee", 
        transition: "all .3s ease",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.04)",
        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: "#1E66F5",
          boxShadow: "0px 12px 24px rgba(0,0,0,0.08)",
        },
        "&:hover img": {
          transform: "scale(1.04)",
        },
      }}
    >
      <Box sx={{ overflow: "hidden", height: 220 }}>
        <CardMedia
          component="img"
          height="220"
          image={
            dado.imagem
              ? `${BASE_URL}/eventos/imagem/${dado.imagem}`
              : imagemPadrao
          }
          alt={dado.nome}
          sx={{
            transition: "transform .4s ease",
            objectFit: "cover",
          }}
        />
      </Box>

      <CardContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          "&:last-child": { paddingBottom: 0 },
        }}
      >
        <Box sx={{ p: 2.5, display: "flex", flexGrow: 1 }}>
          
          <Box sx={{ minWidth: 50, textAlign: "center", mr: 2 }}>
            <Typography sx={{ color: "#FF6B00", fontWeight: 700, fontSize: 13 }}>
              {formatarMes(dado.dataHoraInicio)}
            </Typography>
            <Typography sx={{ color: "#0B3B91", fontWeight: 700, fontSize: 22, lineHeight: 1 }}>
              {formatarDia(dado.dataHoraInicio)}
            </Typography>
          </Box>

          <Box flex={1}>
            <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#0B3B91", mb: 0.5, lineHeight: 1.2 }}>
              {dado.nome}
            </Typography>

            <Typography sx={{ fontSize: 13, color: "#666", mb: 1.5, fontWeight: 500 }}>
              {dado.dataHoraInicio
                ? `${new Date(dado.dataHoraInicio).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h`
                : "-"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: "#888" }} />
              <Typography sx={{ fontSize: 13, color: "#888", fontWeight: 500 }}>
                {dado.endereco?.cidade || "Não informada"}
                {dado.endereco?.estado ? `, ${dado.endereco.estado}` : ""}
              </Typography>
            </Box>
          </Box>

          <Box>
            <BookmarkBorderIcon sx={{ color: "#555", fontSize: 24 }} />
          </Box>
        </Box>
      </CardContent>
    </MuiCard>
  );
}

export default CardEvento;
