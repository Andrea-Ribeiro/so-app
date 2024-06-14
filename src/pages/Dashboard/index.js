import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import Header from "../../components/header";
import Title from "../../components/Title";

import { FiPlus, FiMessageSquare, FiSearch, FiEdit2} from "react-icons/fi"

import './dashboard.css'
import { toast } from "react-toastify";

export default function Dashboard(){
    const collectionRef = collection(db, 'chamados')
    const [chamados, setChamados] = useState([])

    useEffect(()=>{
        getOrders();
    }, []);

    async function getOrders(){
        let list = [];
        await getDocs(collectionRef)
        .then((snapshot) => { 
            snapshot.forEach(
                (item) => list.push(item.data()),
            )
            setChamados(list)
        })
        .catch((err)=> {
            toast.error("Ocorreu algum erro!\nTente novamente.")
        })
    }

    function convertDate(timestamp){
        let date = timestamp.toDate()
        return date.toLocaleDateString('pt-BR');
    }
    

    return(
        <div>
            <Header/>
           <div className="content">
            <Title name="Tickets">
                <FiMessageSquare size={25} />
            </Title>

            <>
                <Link to="/new" className="new">
                    <FiPlus color="#FFF" size={25}/>
                    Novo chamado
                </Link>

            {chamados.length > 0 && (
                 <table>
                 <thead>
                     <tr>
                         <th scope="col">Cliente</th>
                         <th scope="col">Assunto</th>
                         <th scope="col">Status</th>
                         <th scope="col">Cadastrado em</th>
                         <th scope="col">#</th>
                     </tr>
                 </thead>
                 <tbody>
                     {chamados?.map((item, index) => {
                         return(
                             <tr key={index}>
                                 <td data-label="Cliente">{item?.client?.nomeFantasia}</td>
                                 <td data-label="Assunto">{item?.assunto}</td>
                                 <td data-label="Status" >
                                     <span className="badge" style={{backgroundColor: '#999'}}>
                                     {item?.status}
                                     </span>
                                 </td>
                                 <td data-label="Cadastrado">{convertDate(item?.createdDate)}</td>
                                 <td data-label="#">
                                     <button className="action" style={{backgroundColor: '#3583f6'}}>
                                         <FiSearch color="#FFF" size={17}/>
                                     </button>
                                     <button className="action" style={{backgroundColor: '#f6a935'}}>
                                         <FiEdit2 color="#FFF" size={17}/>
                                     </button>
                                 </td>
                          </tr>
                         )
                     })}
                   
                 </tbody>
             </table>
            )}
               
            </>
           </div>
        </div>
    )
}