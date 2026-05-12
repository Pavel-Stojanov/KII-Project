import {
    Button,
    Paper,
    Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useBooks} from "../hooks/useBooks.ts";
import {EmptyState, ErrorState, LoadingState} from "../components/PageState";
import {useAuth} from "../hooks/useAuth";
import {useAuthors} from "../hooks/useAuthors";
import {useState} from "react";
import type {Book, BookRequest} from "../types";
import BookDialog from "../components/BookDialog";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Books() {
    const {books, loading, error, createBook, updateBook, deleteBook} = useBooks();
    const {authors, loading: authorsLoading, error: authorsError} = useAuthors();
    const {isAdmin} = useAuth();
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [bookDialogOpen, setBookDialogOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

    if (loading || (isAdmin && authorsLoading)) return <LoadingState/>
    if (error) return <ErrorState message={error}/>
    if (isAdmin && authorsError) return <ErrorState message={authorsError}/>

    const handleOpenAddDialog = () => {
        setEditingBook(null);
        setBookDialogOpen(true);
    };

    const handleOpenEditDialog = (book: Book) => {
        setEditingBook(book);
        setBookDialogOpen(true);
    };

    const handleSaveBook = async (book: BookRequest) => {
        if (editingBook) {
            await updateBook(editingBook.id, book);
        } else {
            await createBook(book);
        }
    };

    return (
        <>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} sx={{alignItems: {xs: 'stretch', sm: 'center'}, mb: 3}}>
                <Typography variant={'h4'} sx={{flexGrow: 1}}>
                    Books
                </Typography>
                {isAdmin && (
                    <Button variant="contained" onClick={handleOpenAddDialog}>
                        Add Book
                    </Button>
                )}
            </Stack>
            {books.length === 0 ? (
                <EmptyState message="There are no books available."/>
            ) : (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Available Copies</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map(b=> (
                            <TableRow key={b.id}>
                                <TableCell>{b.id}</TableCell>
                                <TableCell>{b.name}</TableCell>
                                <TableCell>{b.category}</TableCell>
                                <TableCell>{b.state}</TableCell>
                                <TableCell>{b.availableCopies}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} sx={{justifyContent: 'flex-end'}}>
                                        <Button component={RouterLink} to={`/books/${b.id}`} size="small" variant="outlined">
                                            View
                                        </Button>
                                        {isAdmin && (
                                            <>
                                                <Button size="small" variant="outlined" onClick={() => handleOpenEditDialog(b)}>
                                                    Edit
                                                </Button>
                                                <Button size="small" variant="outlined" color="error" onClick={() => setBookToDelete(b)}>
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
            {isAdmin && bookDialogOpen && (
                <BookDialog
                    open={bookDialogOpen}
                    book={editingBook}
                    authors={authors}
                    onClose={() => setBookDialogOpen(false)}
                    onSubmit={handleSaveBook}
                />
            )}
            {isAdmin && bookToDelete && (
                <ConfirmDialog
                    open={Boolean(bookToDelete)}
                    title="Delete Book"
                    description={`Delete "${bookToDelete.name}"?`}
                    onClose={() => setBookToDelete(null)}
                    onConfirm={async () => {
                        await deleteBook(bookToDelete.id);
                    }}
                />
            )}
        </>
    )
}
