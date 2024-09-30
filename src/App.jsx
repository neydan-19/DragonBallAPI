import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import Personajes from "./componentes/Personajes";
import DetallePersonaje from "./componentes/DetallePersonaje";

function App(){
  return(
    <Router>
      <div className="contenedor-padre">
      <img src="https://fontmeme.com/permalink/240924/4195ff82403363399f4901a49463dc8b.png" alt="fuente-de-dragon-ball-z" border="0" className="titulo"/>
        
        <Routes>
          <Route path="/" element={<Personajes />}></Route>
          <Route path="/personajes/:id" element={<DetallePersonaje />} />       
        </Routes>
      </div>
    </Router>
  )
}

export default App;
