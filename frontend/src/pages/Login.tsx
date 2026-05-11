import {useState, type FormEvent} from 'react';
import {useLocation, useNavigate, Link as RouterLink} from 'react-router-dom';
import {Box, Button, TextField, Typography, Paper, Alert, Link} from '@mui/material';
import {useAuth} from '../hooks/useAuth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {login} = useAuth();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await login({username, password});
            const state = location.state as { from?: { pathname?: string } } | null;
            navigate(state?.from?.pathname ?? '/books', {replace: true});
        } catch {
            setError('Incorrect username or password.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Login
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Username"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={submitting}
                        sx={{ mt: 3 }}
                    >
                        {submitting ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <Typography align={"center"} variant={"body2"} sx={{ mt :2}}>
                    Don't have an account? <Link component={RouterLink} to={'/register'}>Register here</Link>
                </Typography>
            </Paper>
        </Box>
    );
}
