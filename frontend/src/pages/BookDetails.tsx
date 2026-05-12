import {Button, Divider, Paper, Stack, Typography} from '@mui/material';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {BackButton, EmptyState, ErrorState, LoadingState} from '../components/PageState';
import {useBook} from '../hooks/useBooks';

export default function BookDetails() {
    const {id} = useParams();
    const {book, loading, error} = useBook(id);

    if (loading) return <LoadingState/>;
    if (error) return <ErrorState message={error}/>;
    if (!book) return <EmptyState message="Book was not found."/>;

    return (
        <>
            <BackButton to="/books" label="Back to books"/>
            <Typography variant="h4" gutterBottom>
                {book.name}
            </Typography>
            <Paper sx={{p: 3}}>
                <Stack spacing={2}>
                    <Typography><strong>ID:</strong> {book.id}</Typography>
                    <Divider/>
                    <Typography><strong>Category:</strong> {book.category}</Typography>
                    <Typography><strong>State:</strong> {book.state}</Typography>
                    <Typography><strong>Available copies:</strong> {book.availableCopies}</Typography>
                    <Typography><strong>Author ID:</strong> {book.authorId}</Typography>
                    <Stack direction="row">
                        <Button component={RouterLink} to={`/authors/${book.authorId}`} variant="outlined">
                            View Author
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </>
    );
}
