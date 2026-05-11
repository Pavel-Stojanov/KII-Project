import {Box, Container} from "@mui/material";
import {Outlet} from "react-router-dom";
import Header from "./Header.tsx";
import {Footer} from "./Footer.tsx";

export default function Layout() {
    return (
        <Box sx={{display: "flex", flexDirection: "column", minHeight: '100vh'}}>
            <Header/>
            <Box component={"main"} sx={{flexGrow: 1, py: 4}}>
                <Container maxWidth={"lg"}>
                    <Outlet/>
                </Container>
            </Box>
            <Footer/>
        </Box>
    )
}