import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";

export default function Header() {
    const navigate = useNavigate();
    const {isAuthenticated, logout} = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position={"static"}>
            <Toolbar>
                <Typography variant={"h6"} component={"div"} sx={{flexGrow: 1}}>
                    Library Api
                </Typography>
                <Box>
                    <Button color={"inherit"} component={Link} to="/">Home</Button>
                    {isAuthenticated && (
                        <>
                            <Button color={"inherit"} component={Link} to={"/books"}>Books</Button>
                            <Button color={"inherit"} component={Link} to={"/authors"}>Authors</Button>
                            <Button color={"inherit"} component={Link} to={"/countries"}>Countries</Button>
                            <Button color={"inherit"} component={Link} to={"/statistics"}>Statistics</Button>
                        </>
                    )}

                    {isAuthenticated ? (
                        <Button color={"warning"} onClick={handleLogout} sx={{ml: 2}}>Logout</Button>
                    ) : (
                        <Button color={"inherit"} component={Link} to={"/login"} sx={{ml: 2}}>Login</Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
