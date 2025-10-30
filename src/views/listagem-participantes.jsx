import React from "react";
import Sidebar from "../components/sidebar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BoxInfoEvento from "../components/box-info-evento";
import Lista from "../components/lista";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


function ListagemParticipantes() {
    return(
        <Box display="flex" height="100vh" bgcolor="background.default">
            <Box>
                <Sidebar/>
            </Box>
            <Box flex={1}  p={5} overflow="auto" sx={{ position: 'relative', backgroundColor: "background.default", boxSizing: 'border-box', display: 'flex', WebkitFlexDirection: 'column', justifyContent: 'space-between'}}>
                <Box>
                    <Typography variant="h3">Titulo Pagina</Typography>
                    <BoxInfoEvento/>
                    <Lista/>
                </Box>
                <Stack spacing={2} direction="row" sx={{position: 'absolute', py: 2, bottom: 20, rigth: 20}}>
                    <Button variant="outlined">Voltar</Button>
                    <Button variant="contained">Excluir evento</Button>
                </Stack>
            </Box>
        </Box>        
    );
}
export default ListagemParticipantes;