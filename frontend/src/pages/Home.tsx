import {Box, Button, Stack, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";

export default function Home() {
    const {isAuthenticated} = useAuth();

    return (
        <Box sx={{textAlign: "center", mt: 8}}>
            <Typography variant={"h3"} gutterBottom>
                Welcome to the Library System
            </Typography>
            <Typography variant={'h6'} color="text.secondary">
                Use the navigation menu to look at books, authors and countries.
            </Typography>
            <Stack direction="row" spacing={2} sx={{mt: 4, justifyContent: 'center'}}>
                {isAuthenticated ? (
                    <Button component={RouterLink} to="/books" variant="contained">
                        Browse Books
                    </Button>
                ) : (
                    <>
                        <Button component={RouterLink} to="/login" variant="contained">
                            Login
                        </Button>
                        <Button component={RouterLink} to="/register" variant="outlined">
                            Register
                        </Button>
                    </>
                )}
            </Stack>
        </Box>

    )
}
