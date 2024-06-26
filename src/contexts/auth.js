import {useState, createContext, useEffect} from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut
} from 'firebase/auth'
import { auth, db } from '../services/firebaseConnection'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

export const AuthContext = createContext({});


function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(()=>{
        async function loadUser(){
            const storageUser = localStorage.getItem('@tickets')
            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }
            setLoading(false)
        }
        loadUser();
    },[])

    function renderUser(data){
        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success(`Bem vindo ${data.nome}!`);
        navigate("/dashboard")
    }

    async function signIn(email, password){
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
        .then( async (value)=> {
            let uid = value.user.uid;
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef)

            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl
            }
           renderUser(data);
        })

        .catch((error)=>{
            console.log(error)
            setLoadingAuth(false)
            toast.error("Error ao efetuar login...\n Tente novamente!")
        })
    }

    async function signUp(name, email, password){
        setLoadingAuth(true);
        await createUserWithEmailAndPassword(auth, email, password)
        .then(async (value) => {
            let uid = value.user.uid;

            await setDoc(doc(db, "users", uid), {
                nome: name,
                avatarUrl: null
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                }
               renderUser(data);
            })
        })
        .catch((error)=>{
            console.log(error);
            setLoadingAuth(false);
        })
    }

    function storageUser(data){
        localStorage.setItem('@tickets', JSON.stringify(data))
    }

    async function logout(){
        await signOut(auth);
        localStorage.removeItem('@tickets');
        setUser(null);
    }

    return(
        <AuthContext.Provider 
        value={{
            signed: !!user, // Torna o user booleano
            user,
            signUp,
            signIn,
            logout,
            loadingAuth,
            loading,
            storageUser,
            setUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;