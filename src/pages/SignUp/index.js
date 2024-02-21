import { useState } from 'react';
import {Link} from 'react-router-dom'
import '../SignIn/signin.css';
import logo from '../../assets/logo.png'


export default function  SignUp(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='Logo do sistema'/>
                </div>

                <form >
                    <h1>Cadastrar</h1>
                    <input 
                    type='text'
                    placeholder='Nome'
                    value={name}
                    onChange = {(e) => setName(e.target.value)}
                    />
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

                    <button type='submit'>Cadastrar</button>
                </form>
                <Link to="/">Já possui uma conta? Faça login!</Link>
            </div>
        </div>
    )
}