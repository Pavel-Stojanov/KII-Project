import {Alert, Box, Button, CircularProgress, Stack, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';

interface ErrorStateProps {
    message: string;
}

interface EmptyStateProps {
    message: string;
}

interface BackButtonProps {
    to: string;
    label: string;
}

export function LoadingState() {
    return (
        <Box sx={{display: 'flex', justifyContent: 'center', py: 6}}>
            <CircularProgress/>
        </Box>
    );
}

export function ErrorState({message}: ErrorStateProps) {
    return (
        <Alert severity="error" sx={{my: 2}}>
            {message}
        </Alert>
    );
}

export function EmptyState({message}: EmptyStateProps) {
    return (
        <Box sx={{py: 6, textAlign: 'center'}}>
            <Typography color="text.secondary">{message}</Typography>
        </Box>
    );
}

export function BackButton({to, label}: BackButtonProps) {
    return (
        <Stack direction="row" sx={{mb: 3}}>
            <Button component={RouterLink} to={to} variant="outlined">
                {label}
            </Button>
        </Stack>
    );
}
