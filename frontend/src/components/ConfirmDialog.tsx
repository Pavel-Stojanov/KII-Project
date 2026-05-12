import {useState} from 'react';
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {getApiErrorMessage} from '../utils/apiError';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Delete',
    onClose,
    onConfirm,
}: ConfirmDialogProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        setSubmitting(true);
        setError(null);

        try {
            await onConfirm();
            onClose();
        } catch (e) {
            setError(getApiErrorMessage(e, 'Delete failed.'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>Cancel</Button>
                <Button onClick={handleConfirm} color="error" variant="contained" disabled={submitting}>
                    {submitting ? 'Deleting...' : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
