import { useState } from 'react';
import {Link} from 'react-router-dom'
import './signin.css';
import logo from '../../assets/logo.png'


export default function  SignIn(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='Logo do sistema'/>
                </div>

                <form>
                    <h1>Entrar</h1>
                    <input 
                    type='email'
                    placeholder='email@example.com'
                    value={email}
                    onChange = {(e) => setEmail(e.target.value)}
                    />
                    <input 
                    type='password'
                    placeholder='********'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type='submit'>Acessar</button>
                </form>
                <Link to="/register">Criar uma conta</Link>
            </div>
        </div>
    )
}