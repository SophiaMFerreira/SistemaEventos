import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { mensagemErro } from "../components/toastr";
import axios, { BASE_URL } from "../config/axios";

const NAV_COLOR = "#0B3B91";

function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [participante, setParticipante] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [anchorAdmin, setAnchorAdmin] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    async function carregarUsuario() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(`${BASE_URL}/usuario/me`);
        const dados = response.data;
        setUsuario(dados);
        setAdmin(dados.perfis?.includes("ADMINISTRADOR") ?? false);
        setParticipante(true);
      } catch {
        mensagemErro("Erro ao buscar usuário autenticado");
      }
    }
    carregarUsuario();
  }, []);

  const obterUrlPerfil = () => {
    if (!usuario) return "#";
    if (usuario.perfis?.includes("ADMINISTRADOR"))
      return `/cadastro-administrador/${usuario.id}`;
    if (usuario.tipoUsuario === "PF") return `/cadastro-usuarioCPF/${usuario.id}`;
    if (usuario.tipoUsuario === "PJ") return `/cadastro-usuarioCNPJ/${usuario.id}`;
    return "#";
  };

  const logout = () => {
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("token");
    localStorage.removeItem("login");
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/";
  };

  const navLinkSx = {
    color: "#fff",
    textTransform: "none",
    fontWeight: 500,
    fontSize: "0.9rem",
    px: 1.5,
    py: 0.75,
    borderRadius: 1,
    "&:hover": { backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: NAV_COLOR,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, md: 64 }, px: { xs: 2, md: 4 } }}>
        {/* Brand */}
        <Typography
          component="a"
          href="/listagem-eventos"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.3rem", md: "1.5rem" },
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "-0.5px",
            mr: 4,
            flexShrink: 0,
          }}
        >
          EVENT<span style={{ color: "#1E66F5" }}>+</span>
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop nav */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {participante && (
              <>
                <Button href="/listagem-eventos" sx={navLinkSx}>Home</Button>
                <Button href="/meus-eventos" sx={navLinkSx}>Meus Eventos</Button>
                <Button href="/eventos-organizados" sx={navLinkSx}>Sou Organizador</Button>
                <Button href="/minha-carteira" sx={navLinkSx}>Minha Carteira</Button>
              </>
            )}

            {admin && (
              <>
                <Button
                  onClick={(e) => setAnchorAdmin(e.currentTarget)}
                  sx={navLinkSx}
                  endIcon={<span style={{ fontSize: 10 }}>▾</span>}
                >
                  Admin
                </Button>
                <Menu
                  anchorEl={anchorAdmin}
                  open={Boolean(anchorAdmin)}
                  onClose={() => setAnchorAdmin(null)}
                  PaperProps={{ elevation: 3, sx: { borderRadius: 2, mt: 1 } }}
                >
                  <MenuItem component="a" href="/cadastro-porteEvento" onClick={() => setAnchorAdmin(null)}>
                    Novo Porte de Evento
                  </MenuItem>
                  <MenuItem component="a" href="/cadastro-tipoEvento" onClick={() => setAnchorAdmin(null)}>
                    Novo Tipo de Evento
                  </MenuItem>
                  <MenuItem component="a" href="/cadastro-administrador" onClick={() => setAnchorAdmin(null)}>
                    Cadastrar Administrador
                  </MenuItem>
                </Menu>
              </>
            )}

            {participante && (
              <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "rgba(255,255,255,0.2)" }} />
            )}

            {participante && (
              <IconButton
                component="a"
                href={obterUrlPerfil()}
                sx={{ color: "#fff", "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" } }}
                title="Perfil"
              >
                <AccountCircleOutlinedIcon />
              </IconButton>
            )}

            {participante && (
              <IconButton
                onClick={logout}
                sx={{ color: "#fff", "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" } }}
                title="Sair"
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <>
            <IconButton onClick={(e) => setAnchorMenu(e.currentTarget)} sx={{ color: "#fff" }}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorMenu}
              open={Boolean(anchorMenu)}
              onClose={() => setAnchorMenu(null)}
              PaperProps={{ elevation: 3, sx: { borderRadius: 2, mt: 1, minWidth: 220 } }}
            >
              {participante && [
                <MenuItem key="home" component="a" href="/listagem-eventos" onClick={() => setAnchorMenu(null)}>Home</MenuItem>,
                <MenuItem key="meus" component="a" href="/meus-eventos" onClick={() => setAnchorMenu(null)}>Meus Eventos</MenuItem>,
                <MenuItem key="org" component="a" href="/eventos-organizados" onClick={() => setAnchorMenu(null)}>Sou Organizador</MenuItem>,
                <MenuItem key="cart" component="a" href="/minha-carteira" onClick={() => setAnchorMenu(null)}>Minha Carteira</MenuItem>,
                <MenuItem key="perfil" component="a" href={obterUrlPerfil()} onClick={() => setAnchorMenu(null)}>Perfil</MenuItem>,
              ]}
              {admin && [
                <Divider key="d1" />,
                <MenuItem key="porte" component="a" href="/cadastro-porteEvento" onClick={() => setAnchorMenu(null)}>Novo Porte de Evento</MenuItem>,
                <MenuItem key="tipo" component="a" href="/cadastro-tipoEvento" onClick={() => setAnchorMenu(null)}>Novo Tipo de Evento</MenuItem>,
                <MenuItem key="adm" component="a" href="/cadastro-administrador" onClick={() => setAnchorMenu(null)}>Cadastrar Administrador</MenuItem>,
              ]}
              {participante && [
                <Divider key="d2" />,
                <MenuItem key="sair" onClick={() => { setAnchorMenu(null); logout(); }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Sair
                </MenuItem>,
              ]}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
