import {useState, type FormEvent} from 'react';
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from '@mui/material';
import type {Country, CountryRequest} from '../types';
import {getApiErrorMessage} from '../utils/apiError';

interface CountryDialogProps {
    open: boolean;
    country: Country | null;
    onClose: () => void;
    onSubmit: (country: CountryRequest) => Promise<void>;
}

const emptyCountry: CountryRequest = {
    name: '',
    continent: '',
};

const toCountryRequest = (country: Country): CountryRequest => ({
    name: country.name,
    continent: country.continent,
});

export default function CountryDialog({open, country, onClose, onSubmit}: CountryDialogProps) {
    const [formData, setFormData] = useState<CountryRequest>(() => country ? toCountryRequest(country) : emptyCountry);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await onSubmit({
                name: formData.name.trim(),
                continent: formData.continent.trim(),
            });
            onClose();
        } catch (e) {
            setError(getApiErrorMessage(e, 'Country could not be saved.'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <DialogTitle>{country ? 'Edit Country' : 'Add Country'}</DialogTitle>
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
                            label="Continent"
                            value={formData.continent}
                            required
                            fullWidth
                            onChange={(e) => setFormData(prev => ({...prev, continent: e.target.value}))}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
