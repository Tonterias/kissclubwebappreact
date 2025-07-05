    import {StrictMode} from 'react'
    import {createRoot} from 'react-dom/client'
    import './index.css'
    import '../src/i18next/i18.ts';
    import App from './App'
    import {BrowserRouter} from "react-router-dom";
    import {AuthProvider} from "./context/AuthContext.tsx";
    import {ToastContainer} from "react-toastify";
    import 'react-toastify/dist/ReactToastify.css';
    import {MatchPopupProvider} from "./context/MatchPopup.tsx";

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <AuthProvider>
                <MatchPopupProvider>
                    <BrowserRouter>
                        <ToastContainer position="top-right" autoClose={3000}/>
                        <App/>
                    </BrowserRouter>
                </MatchPopupProvider>
            </AuthProvider>
        </StrictMode>,
    )
