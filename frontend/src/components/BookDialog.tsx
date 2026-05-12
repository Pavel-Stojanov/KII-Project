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
import type {Author, Book, BookRequest} from '../types';
import {BOOK_CATEGORIES, BOOK_STATES} from '../types';
import {getApiErrorMessage} from '../utils/apiError';

interface BookDialogProps {
    open: boolean;
    book: Book | null;
    authors: Author[];
    onClose: () => void;
    onSubmit: (book: BookRequest) => Promise<void>;
}

const createEmptyBook = (authors: Author[]): BookRequest => ({
    name: '',
    category: 'NOVEL',
    authorId: authors[0]?.id ?? '',
    state: 'GOOD',
    availableCopies: 1,
});

const toBookRequest = (book: Book): BookRequest => ({
    name: book.name,
    category: book.category,
    authorId: book.authorId,
    state: book.state,
    availableCopies: book.availableCopies,
});

export default function BookDialog({open, book, authors, onClose, onSubmit}: BookDialogProps) {
    const [formData, setFormData] = useState<BookRequest>(() => book ? toBookRequest(book) : createEmptyBook(authors));
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
                availableCopies: Number(formData.availableCopies),
            });
            onClose();
        } catch (e) {
            setError(getApiErrorMessage(e, 'Book could not be saved.'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <DialogTitle>{book ? 'Edit Book' : 'Add Book'}</DialogTitle>
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
                            select
                            label="Category"
                            value={formData.category}
                            required
                            fullWidth
                            onChange={(e) => setFormData(prev => ({...prev, category: e.target.value as BookRequest['category']}))}
                        >
                            {BOOK_CATEGORIES.map(category => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Author"
                            value={formData.authorId}
                            required
                            fullWidth
                            disabled={authors.length === 0}
                            onChange={(e) => setFormData(prev => ({...prev, authorId: e.target.value}))}
                        >
                            {authors.map(author => (
                                <MenuItem key={author.id} value={String(author.id)}>
                                    {author.name} {author.surname}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="State"
                            value={formData.state}
                            required
                            fullWidth
                            onChange={(e) => setFormData(prev => ({...prev, state: e.target.value as BookRequest['state']}))}
                        >
                            {BOOK_STATES.map(state => (
                                <MenuItem key={state} value={state}>{state}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Available copies"
                            type="number"
                            value={formData.availableCopies}
                            required
                            fullWidth
                            slotProps={{htmlInput: {min: 0}}}
                            onChange={(e) => setFormData(prev => ({...prev, availableCopies: Number(e.target.value)}))}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={submitting || authors.length === 0}>
                        {submitting ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
