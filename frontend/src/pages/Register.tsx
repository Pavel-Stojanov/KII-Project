import {useState, type ChangeEvent, type FormEvent} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {Alert, Box, Button, Link, Paper, TextField, Typography} from '@mui/material';
import {useAuth} from '../hooks/useAuth';
import type {RegisterRequest} from '../types';

export default function Register() {
    const [formData, setFormData] = useState<RegisterRequest>({
        name: '',
        surname: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const {register} = useAuth();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await register(formData);
            navigate('/books', {replace: true});
        } catch {
            setError('Error while registering, maybe the username already exists.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', mt: 8}}>
            <Paper sx={{p: 4, width: '100%', maxWidth: 400}}>
                <Typography variant="h5" gutterBottom align="center">
                    Register
                </Typography>

                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                <form onSubmit={handleRegister}>
                    <TextField fullWidth label="Name" name="name" margin="normal" required onChange={handleChange}/>
                    <TextField fullWidth label="Surname" name="surname" margin="normal" required
                               onChange={handleChange}/>
                    <TextField fullWidth label="Username" name="username" margin="normal" required
                               onChange={handleChange}/>
                    <TextField fullWidth label="Password" name="password" type="password" margin="normal" required
                               onChange={handleChange}/>

                    <Button fullWidth type="submit" variant="contained" color="primary" disabled={submitting} sx={{mt: 3, mb: 2}}>
                        {submitting ? 'Registering...' : 'Register'}
                    </Button>
                </form>

                <Typography align="center" variant="body2">
                    Already got an account? <Link component={RouterLink} to="/login">Login here</Link>
                </Typography>
            </Paper>
        </Box>
    );
}
