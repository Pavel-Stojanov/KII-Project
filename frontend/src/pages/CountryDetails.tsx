import {Divider, Paper, Stack, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import {BackButton, EmptyState, ErrorState, LoadingState} from '../components/PageState';
import {useCountry} from '../hooks/useCountries';

export default function CountryDetails() {
    const {id} = useParams();
    const {country, loading, error} = useCountry(id);

    if (loading) return <LoadingState/>;
    if (error) return <ErrorState message={error}/>;
    if (!country) return <EmptyState message="Country was not found."/>;

    return (
        <>
            <BackButton to="/countries" label="Back to countries"/>
            <Typography variant="h4" gutterBottom>
                {country.name}
            </Typography>
            <Paper sx={{p: 3}}>
                <Stack spacing={2}>
                    <Typography><strong>ID:</strong> {country.id}</Typography>
                    <Divider/>
                    <Typography><strong>Name:</strong> {country.name}</Typography>
                    <Typography><strong>Continent:</strong> {country.continent}</Typography>
                </Stack>
            </Paper>
        </>
    );
}
