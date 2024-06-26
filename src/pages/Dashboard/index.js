import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { format } from "date-fns";

import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import Header from "../../components/header";
import Title from "../../components/Title";
import Modal from "../../components/Modal";

import { FiPlus, FiMessageSquare, FiSearch, FiEdit2} from "react-icons/fi"

import './dashboard.css'

export default function Dashboard(){
    const collectionRef = collection(db, 'chamados')
    const [chamados, setChamados] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDoc, setLastDoc] = useState()
    const [loadingMore, setLoadingMore] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [order, setOrder] = useState({})
 
    useEffect(()=>{
        getOrders();
    }, []);

    async function getOrders(){
        const q = query(collectionRef, orderBy('createdDate', 'desc'), limit(10));

        const querySnapshot = await getDocs(q)
        setChamados([]);
        await updateState(querySnapshot)
        setLoading(false);
       
    }

    async function getMore(){
        setLoadingMore(true);
        const q =query(collectionRef, orderBy('createdDate', 'desc'), limit(10), startAfter(lastDoc));
        const querySnapshot = await getDocs(q)
        await updateState(querySnapshot)
    }

    async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;

        if (!isCollectionEmpty){
            let lista = [];
            querySnapshot.forEach(
                (doc) => {
                    let object = doc.data();
                    object.id = doc.id;
                    lista.push(object);
                },
            )

            setChamados(chamados => [...chamados, ...lista])
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1])
        }else{
            setIsEmpty(true);
        }
        setLoadingMore(false);
    }

    function toogleModal(item){
       setOpenModal(!openModal);
       setOrder(item);
    }

    return(
        <div>
            <Header/>
           <div className="content">
            <Title name="Tickets">
                <FiMessageSquare size={25} />
            </Title>

            <>
            {loading  && (
                <div className="container dashboard">
                    <span> Loading...</span>
                </div>)
                }

            {!loading && <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25}/>
                Novo chamado
            </Link>}

            {!loading && chamados.length > 0 && (
                <>
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
                                     <span className="badge" style={{backgroundColor: item.status === 'aberto' ? '#5cb85c' : '#999'}}>
                                     {item?.status}
                                     </span>
                                 </td>
                                 <td data-label="Cadastrado">{format(item?.createdDate.toDate(), 'dd/MM/yyy')}</td>
                                 <td data-label="#">
                                     <button className="action" style={{backgroundColor: '#3583f6'}} onClick={()=> toogleModal(item)}>
                                         <FiSearch color="#FFF" size={17}/>
                                     </button>
                                     <Link to={`/new/${item?.id}`} className="action" style={{backgroundColor: '#f6a935'}}>
                                         <FiEdit2 color="#FFF" size={17}/>
                                     </Link>
                                 </td>
                          </tr>
                         )
                     })}
                   
                 </tbody>
             </table>
              {!loadingMore && !isEmpty && <button className="btn-more" onClick={()=>getMore()}>Buscar mais...</button>}
             </>
            )}
               
            </>
           </div>

           {openModal && <Modal data={order} close={()=>setOpenModal(!openModal)} />}
        </div>
    )
}