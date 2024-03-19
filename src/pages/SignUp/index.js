import { useState, useContext } from 'react';
import {Link} from 'react-router-dom'
import '../SignIn/signin.css';
import logo from '../../assets/logo.png'
import { AuthContext } from '../../contexts/auth';


export default function  SignUp(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signUp, loadingAuth } = useContext(AuthContext);

    function handleSubmit(event){
        event.preventDefault();
        if(name && email && password){
            signUp(name, email, password)
        }
        else{
            alert('Preencha todos os campos!')
        }
    }

    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='Logo do sistema'/>
                </div>

                <form onSubmit={handleSubmit}>
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

                    <button type='submit'>
                        {loadingAuth ? 'Carregando...' : 'Cadastrar'}
                    </button>
                </form>
                <Link to="/">Já possui uma conta? Faça login!</Link>
            </div>
        </div>
    )
}