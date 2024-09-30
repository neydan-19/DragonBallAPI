import React, {useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Transformaciones({data}){
    return(
        <div className="transformaciones-container">
            <div className="transformaciones-personaje">
                {data.map((transformacion)=>(
                    <div className="transformacion">
                        <h1>{transformacion.name}</h1>
                        <img src={transformacion.image} alt={transformacion.name} />
                        <p>{transformacion.ki}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Transformaciones