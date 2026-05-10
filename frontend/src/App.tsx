import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import AuthProvider from './auth/AuthProvider';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Books from './pages/Books';
import Authors from './pages/Authors';
import Countries from './pages/Countries';
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import CategoryStatistics from "./pages/CategoryStatistics.tsx";
import BookDetails from './pages/BookDetails';
import AuthorDetails from './pages/AuthorDetails';
import CountryDetails from './pages/CountryDetails';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/> {/* Ова ги ресетира основните стилови на прелистувачот */}
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Layout/>}>
                            <Route index element={<Home/>}/>
                            <Route path="login" element={<Login/>}/>
                            <Route path="register" element={<Register/>}/>
                            <Route element={<ProtectedRoute/>}>
                                <Route path="books" element={<Books/>}/>
                                <Route path="books/:id" element={<BookDetails/>}/>
                                <Route path="authors" element={<Authors/>}/>
                                <Route path="authors/:id" element={<AuthorDetails/>}/>
                                <Route path="countries" element={<Countries/>}/>
                                <Route path="countries/:id" element={<CountryDetails/>}/>
                                <Route path="statistics" element={<CategoryStatistics/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
