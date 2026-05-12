import {useCategoryStatistics} from "../hooks/useCategoryStatistics.ts";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {ErrorState, LoadingState} from "../components/PageState";


export default function CategoryStatistics() {
    const {statistics, loading, error} = useCategoryStatistics();

    if (loading) return <LoadingState/>;
    if (error) return <ErrorState message={error}/>;

    return (
        <>
            <Typography variant="h4" gutterBottom sx={{textAlign: "center"}}>Statistics per Category</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Category</b></TableCell>
                            <TableCell align="center"><b>Total Books</b></TableCell>
                            <TableCell align="center"><b>Available copies</b></TableCell>
                            <TableCell align="center"><b>Books in bad state</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {statistics.map((stat) => (
                            <TableRow key={stat.category}>
                                <TableCell>{stat.category}</TableCell>
                                <TableCell align="center">{stat.totalBooks}</TableCell>
                                <TableCell align="center">{stat.totalAvailableCopies}</TableCell>
                                <TableCell align="center">{stat.booksInBadState}</TableCell>
                            </TableRow>
                        ))}

                        {statistics.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    There is no statistic data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
