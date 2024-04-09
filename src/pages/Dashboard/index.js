import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"

import Header from "../../components/header";

export default function Dashboard(){
    const {logout} = useContext(AuthContext)

    async function handleLogout(){
        await logout();
    }
    return(
        <div>
            <Header/>
            <h1>Welcome to the dashboard!</h1>
            <button onClick={handleLogout}>Sair da conta</button>
        </div>
    )
}