import {Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useCountries} from "../hooks/useCountries.ts";
import {EmptyState, ErrorState, LoadingState} from "../components/PageState";
import {useAuth} from "../hooks/useAuth";
import {useState} from "react";
import type {Country, CountryRequest} from "../types";
import CountryDialog from "../components/CountryDialog";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Countries(){
    const {countries, loading, error, createCountry, updateCountry, deleteCountry} = useCountries();
    const {isAdmin} = useAuth();
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const [countryDialogOpen, setCountryDialogOpen] = useState(false);
    const [countryToDelete, setCountryToDelete] = useState<Country | null>(null);

    if (loading) return <LoadingState/>
    if (error) return <ErrorState message={error}/>

    const handleOpenAddDialog = () => {
        setEditingCountry(null);
        setCountryDialogOpen(true);
    };

    const handleOpenEditDialog = (country: Country) => {
        setEditingCountry(country);
        setCountryDialogOpen(true);
    };

    const handleSaveCountry = async (country: CountryRequest) => {
        if (editingCountry) {
            await updateCountry(editingCountry.id, country);
        } else {
            await createCountry(country);
        }
    };

    return (
        <>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} sx={{alignItems: {xs: 'stretch', sm: 'center'}, mb: 3}}>
                <Typography variant={'h4'} sx={{flexGrow: 1}}>Countries</Typography>
                {isAdmin && (
                    <Button variant="contained" onClick={handleOpenAddDialog}>
                        Add Country
                    </Button>
                )}
            </Stack>
            {countries.length === 0 ? (
                <EmptyState message="There are no countries available."/>
            ) : (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Continent</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {countries.map(c=>(
                            <TableRow key={c.id}>
                                <TableCell>{c.id}</TableCell>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{c.continent}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} sx={{justifyContent: 'flex-end'}}>
                                        <Button component={RouterLink} to={`/countries/${c.id}`} size="small" variant="outlined">
                                            View
                                        </Button>
                                        {isAdmin && (
                                            <>
                                                <Button size="small" variant="outlined" onClick={() => handleOpenEditDialog(c)}>
                                                    Edit
                                                </Button>
                                                <Button size="small" variant="outlined" color="error" onClick={() => setCountryToDelete(c)}>
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            )}
            {isAdmin && countryDialogOpen && (
                <CountryDialog
                    open={countryDialogOpen}
                    country={editingCountry}
                    onClose={() => setCountryDialogOpen(false)}
                    onSubmit={handleSaveCountry}
                />
            )}
            {isAdmin && countryToDelete && (
                <ConfirmDialog
                    open={Boolean(countryToDelete)}
                    title="Delete Country"
                    description={`Delete "${countryToDelete.name}"?`}
                    onClose={() => setCountryToDelete(null)}
                    onConfirm={async () => {
                        await deleteCountry(countryToDelete.id);
                    }}
                />
            )}
        </>
    )
}
