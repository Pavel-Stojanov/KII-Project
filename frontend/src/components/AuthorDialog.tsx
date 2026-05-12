import {useState, type FormEvent} from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material';
import type {Author, AuthorRequest, Country} from '../types';
import {getApiErrorMessage} from '../utils/apiError';

interface AuthorDialogProps {
    open: boolean;
    author: Author | null;
    countries: Country[];
    onClose: () => void;
    onSubmit: (author: AuthorRequest) => Promise<void>;
}

const createEmptyAuthor = (countries: Country[]): AuthorRequest => ({
    name: '',
    surname: '',
    countryId: countries[0]?.id ?? '',
});

const toAuthorRequest = (author: Author): AuthorRequest => ({
    name: author.name,
    surname: author.surname,
    countryId: author.countryId,
});

export default function AuthorDialog({open, author, countries, onClose, onSubmit}: AuthorDialogProps) {
    const [formData, setFormData] = useState<AuthorRequest>(() => author ? toAuthorRequest(author) : createEmptyAuthor(countries));
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await onSubmit({
                ...formData,
                name: formData.name.trim(),
                surname: formData.surname.trim(),
            });
            onClose();
        } catch (e) {
            setError(getApiErrorMessage(e, 'Author could not be saved.'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <DialogTitle>{author ? 'Edit Author' : 'Add Author'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{mt: 1}}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Name"
                            value={formData.name}
                            required
                            fullWidth
                            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                        />
                        <TextField
                            label="Surname"
                            value={formData.surname}
                            required
                            fullWidth
                            onChange={(e) => setFormData(prev => ({...prev, surname: e.target.value}))}
                        />
                        <TextField
                            select
                            label="Country"
                            value={formData.countryId}
                            required
                            fullWidth
                            disabled={countries.length === 0}
                            onChange={(e) => setFormData(prev => ({...prev, countryId: e.target.value}))}
                        >
                            {countries.map(country => (
                                <MenuItem key={country.id} value={String(country.id)}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={submitting || countries.length === 0}>
                        {submitting ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
