import {Button, Divider, Paper, Stack, Typography} from '@mui/material';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {BackButton, EmptyState, ErrorState, LoadingState} from '../components/PageState';
import {useAuthor} from '../hooks/useAuthors';

export default function AuthorDetails() {
    const {id} = useParams();
    const {author, loading, error} = useAuthor(id);

    if (loading) return <LoadingState/>;
    if (error) return <ErrorState message={error}/>;
    if (!author) return <EmptyState message="Author was not found."/>;

    return (
        <>
            <BackButton to="/authors" label="Back to authors"/>
            <Typography variant="h4" gutterBottom>
                {author.name} {author.surname}
            </Typography>
            <Paper sx={{p: 3}}>
                <Stack spacing={2}>
                    <Typography><strong>ID:</strong> {author.id}</Typography>
                    <Divider/>
                    <Typography><strong>Name:</strong> {author.name}</Typography>
                    <Typography><strong>Surname:</strong> {author.surname}</Typography>
                    <Typography><strong>Country ID:</strong> {author.countryId}</Typography>
                    <Stack direction="row">
                        <Button component={RouterLink} to={`/countries/${author.countryId}`} variant="outlined">
                            View Country
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </>
    );
}
