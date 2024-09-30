import React, {useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Transformaciones from "./Transformaciones";

function DetallePersonaje(){
    const {id} = useParams()
    const [personaje, setPersonaje] = useState(null)
    const [cargando, SetCargando] = useState(true)
    const [error, SetError] = useState(null)

    useEffect(()=>{
        axios
            .get(`https://dragonball-api.com/api/characters/${id}`)
            .then((response)=>{
                setPersonaje(response.data)
                SetCargando(false)
            })
            .catch((error)=>{
                SetError('Hubo un problema al cargar el personaje')
            })
    },[id])

    if(cargando) return <p>Cargando Personaje...</p>
    if(error) return <p>{error}</p>

    return(
        <div className="detalles-grid">
            <div className="detalles-imagen">
                <h2>{personaje.name}</h2>
                <img src={personaje.image} alt="" />
            </div>
            <div className="detalles-personajes">
                <p className="genero">Genero: {personaje.gender}</p>
                <p className="raza">Raza: {personaje.race}</p>
                <p className="ki">ki: {personaje.ki}</p>
                <p className="maxKi">Max Ki: {personaje.maxKi}</p>
                <p className="descripcion">Descripcion: <br />{personaje.description}</p>
            </div>
            <Transformaciones data={personaje.transformations}></Transformaciones>
        </div>
    )
}

export default DetallePersonaje