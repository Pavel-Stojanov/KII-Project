import {
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useAuthors} from "../hooks/useAuthors.ts";
import {EmptyState, ErrorState, LoadingState} from "../components/PageState";
import {useCountries} from "../hooks/useCountries";
import {useAuth} from "../hooks/useAuth";
import {useState} from "react";
import type {Author, AuthorRequest} from "../types";
import AuthorDialog from "../components/AuthorDialog";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Authors() {
    const {authors, loading, error, createAuthor, updateAuthor, deleteAuthor} = useAuthors();
    const {countries, loading: countriesLoading, error: countriesError} = useCountries();
    const {isAdmin} = useAuth();
    const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
    const [authorDialogOpen, setAuthorDialogOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);

    if (loading || (isAdmin && countriesLoading)) return <LoadingState/>
    if (error) return <ErrorState message={error}/>
    if (isAdmin && countriesError) return <ErrorState message={countriesError}/>

    const handleOpenAddDialog = () => {
        setEditingAuthor(null);
        setAuthorDialogOpen(true);
    };

    const handleOpenEditDialog = (author: Author) => {
        setEditingAuthor(author);
        setAuthorDialogOpen(true);
    };

    const handleSaveAuthor = async (author: AuthorRequest) => {
        if (editingAuthor) {
            await updateAuthor(editingAuthor.id, author);
        } else {
            await createAuthor(author);
        }
    };

    return (
        <>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} sx={{alignItems: {xs: 'stretch', sm: 'center'}, mb: 3}}>
                <Typography variant={'h4'} sx={{flexGrow: 1}}>Authors</Typography>
                {isAdmin && (
                    <Button variant="contained" onClick={handleOpenAddDialog}>
                        Add Author
                    </Button>
                )}
            </Stack>
            {authors.length === 0 ? (
                <EmptyState message="There are no authors available."/>
            ) : (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Surname</TableCell>
                            <TableCell>Country ID</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authors.map(a => (
                            <TableRow key={a.id}>
                                <TableCell>{a.id}</TableCell>
                                <TableCell>{a.name}</TableCell>
                                <TableCell>{a.surname}</TableCell>
                                <TableCell>{a.countryId}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} sx={{justifyContent: 'flex-end'}}>
                                        <Button component={RouterLink} to={`/authors/${a.id}`} size="small" variant="outlined">
                                            View
                                        </Button>
                                        {isAdmin && (
                                            <>
                                                <Button size="small" variant="outlined" onClick={() => handleOpenEditDialog(a)}>
                                                    Edit
                                                </Button>
                                                <Button size="small" variant="outlined" color="error" onClick={() => setAuthorToDelete(a)}>
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
            {isAdmin && authorDialogOpen && (
                <AuthorDialog
                    open={authorDialogOpen}
                    author={editingAuthor}
                    countries={countries}
                    onClose={() => setAuthorDialogOpen(false)}
                    onSubmit={handleSaveAuthor}
                />
            )}
            {isAdmin && authorToDelete && (
                <ConfirmDialog
                    open={Boolean(authorToDelete)}
                    title="Delete Author"
                    description={`Delete "${authorToDelete.name} ${authorToDelete.surname}"?`}
                    onClose={() => setAuthorToDelete(null)}
                    onConfirm={async () => {
                        await deleteAuthor(authorToDelete.id);
                    }}
                />
            )}
        </>
    )
}
