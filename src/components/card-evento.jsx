import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import imagemPadrao from "../assets/evento-default.jpg";
import axios, { BASE_URL } from "../config/axios";
import {
  Card as MuiCard,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";

function CardEvento({ dado, onClick }) {
  const [imagemUrl, setImagemUrl] = React.useState(imagemPadrao);
  const [favoritado, setFavoritado] = React.useState(() => {
    const salvos = JSON.parse(localStorage.getItem("eventosFavoritos") || "[]");
    return salvos.includes(dado.id);
  });

  React.useEffect(() => {
    let cancelado = false;
    let urlTemporaria = null;

    async function carregarImagem() {
      if (!dado.imagem) { setImagemUrl(imagemPadrao); return; }
      try {
        const response = await axios.get(
          `${BASE_URL}/eventos/imagem/${encodeURIComponent(dado.imagem)}`,
          { responseType: "blob" },
        );
        if (!cancelado) {
          urlTemporaria = URL.createObjectURL(response.data);
          setImagemUrl(urlTemporaria);
        }
      } catch (error) {
        if (error.response?.status !== 404) console.error(`Erro ao carregar imagem do evento ${dado.id}:`, error);
        if (!cancelado) setImagemUrl(imagemPadrao);
      }
    }

    carregarImagem();
    return () => {
      cancelado = true;
      if (urlTemporaria) URL.revokeObjectURL(urlTemporaria);
    };
  }, [dado.id, dado.imagem]);

  const toggleFavorito = (e) => {
    e.stopPropagation();
    const salvos = JSON.parse(localStorage.getItem("eventosFavoritos") || "[]");
    const atualizados = favoritado
      ? salvos.filter((id) => id !== dado.id)
      : [...salvos, dado.id];
    localStorage.setItem("eventosFavoritos", JSON.stringify(atualizados));
    setFavoritado(!favoritado);
  };

  const formatarMes = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleString("pt-BR", { month: "short" }).replace(".", "").toUpperCase();
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
        "&:hover": { transform: "translateY(-6px)", borderColor: "#1E66F5", boxShadow: "0px 12px 24px rgba(0,0,0,0.08)" },
        "&:hover img": { transform: "scale(1.04)" },
      }}
    >
      <Box sx={{ overflow: "hidden", height: 220, position: "relative" }}>
        <CardMedia
          component="img"
          height="220"
          image={imagemUrl}
          alt={dado.nome}
          sx={{ transition: "transform .4s ease", objectFit: "cover" }}
        />
        {dado.cancelado && (
          <Chip label="CANCELADO" size="small" color="error"
            sx={{ position: "absolute", top: 14, left: 14, zIndex: 2, fontWeight: 700, borderRadius: "6px" }}
          />
        )}
      </Box>

      <CardContent sx={{ p: 0, display: "flex", flexDirection: "column", flexGrow: 1, "&:last-child": { paddingBottom: 0 } }}>
        <Box sx={{ p: 2.5, display: "flex", flexGrow: 1 }}>
          <Box sx={{ minWidth: 50, textAlign: "center", mr: 2 }}>
            <Typography sx={{ color: "#FF6B00", fontWeight: 700, fontSize: 13 }}>{formatarMes(dado.dataHoraInicio)}</Typography>
            <Typography sx={{ color: "#0B3B91", fontWeight: 700, fontSize: 22, lineHeight: 1 }}>{formatarDia(dado.dataHoraInicio)}</Typography>
          </Box>

          <Box flex={1}>
            <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#0B3B91", mb: 0.5, lineHeight: 1.2 }}>{dado.nome}</Typography>
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

          {/* Ícone de coração — favoritar/desfavoritar */}
          <Box>
            <IconButton
              onClick={toggleFavorito}
              size="small"
              sx={{ color: favoritado ? "#e53935" : "#bbb", p: 0.5 }}
              title={favoritado ? "Desfavoritar" : "Favoritar"}
            >
              {favoritado ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </MuiCard>
  );
}

export default CardEvento;
