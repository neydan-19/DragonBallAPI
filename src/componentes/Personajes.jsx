import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Personajes() {
    const [personajes, setPersonajes] = useState([]);
    const [personajesFiltrados, setPersonajesFiltrados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [enlaceSiguiente, setEnlaceSiguiente] = useState(null);
    const [enlaceAnterior, setEnlaceAnterior] = useState(null);
    const [busqueda, setBusqueda] = useState(''); // Campo de búsqueda
    const limite = 8; // Número de personajes por página

    useEffect(() => {
        const cargarPersonajes = async () => {
            try {
                setCargando(true);
                const response = await axios.get(`https://dragonball-api.com/api/characters?page=${paginaActual}&limit=${limite}`);
                
                // Asignar los personajes y los datos de meta y links
                setPersonajes(response.data.items);
                setTotalPaginas(response.data.meta.totalPages);
                setPaginaActual(response.data.meta.currentPage);
                
                // Manejar enlaces de paginación
                setEnlaceSiguiente(response.data.links.next || null);
                setEnlaceAnterior(response.data.links.previous || null);
                
                setCargando(false);
            } catch (error) {
                setError('Hubo un problema en cargar los personajes');
                setCargando(false);
            }
        };

        // Si no hay búsqueda, cargamos la paginación normal
        if (busqueda === '' && personajesFiltrados.length === 0) {
            cargarPersonajes();
        }
    }, [paginaActual]);

    const cargarPersonajesFiltrados = async () => {
        try {
            setCargando(true);
            let personajesTotales = [];
            let pagina = 1;
            let response;

            // Repetimos la solicitud hasta obtener todos los personajes de todas las páginas
            do {
                response = await axios.get(`https://dragonball-api.com/api/characters?page=${pagina}&limit=${limite}`);
                personajesTotales = [...personajesTotales, ...response.data.items];
                pagina++;
            } while (response.data.meta.totalPages >= pagina);

            // Filtramos los personajes por la búsqueda
            const personajesFiltrados = personajesTotales.filter(personaje =>
                personaje.name.toLowerCase().includes(busqueda.toLowerCase())
            );

            setPersonajesFiltrados(personajesFiltrados);
            setCargando(false);
        } catch (error) {
            setError('Hubo un problema en cargar los personajes filtrados');
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        setBusqueda(e.target.value); // Actualizar el campo de búsqueda
    };

    // Filtrar personajes al presionar "Buscar" o "Enter"
    const manejarBusqueda = () => {
        if (busqueda) {
            cargarPersonajesFiltrados();
        }
    };

    // Detectar tecla "Enter" para ejecutar la búsqueda
    const manejarEnter = (e) => {
        if (e.key === 'Enter') {
            manejarBusqueda();
        }
    };

    const paginaSiguiente = () => {
        if (enlaceSiguiente) {
            setPaginaActual(paginaActual + 1);
        }
    };

    const paginaAnterior = () => {
        if (enlaceAnterior) {
            setPaginaActual(paginaActual - 1);
        }
    };

    if (cargando) return <p>Cargando Personajes...</p>;
    if (error) return <p>{error}</p>;

    // Mostrar personajes dependiendo si se está filtrando o no
    const personajesAMostrar = personajesFiltrados.length > 0 ? personajesFiltrados : personajes;

    return (
        <div className="personajes-container">
            <h2>PERSONAJES DEL ANIME</h2>

            {/* Input para buscar personajes */}
            <div className="busqueda-container">
                <input 
                    type="text"
                    placeholder="Buscar personajes por nombre"
                    value={busqueda}
                    onChange={manejarCambioBusqueda}
                    onKeyDown={manejarEnter} // Detectar tecla Enter
                    className="input-busqueda"
                />
                <button onClick={manejarBusqueda} className="boton-buscar">
                    Buscar
                </button>
            </div>

            {/* Paginación arriba (se oculta si hay búsqueda) */}
            {personajesFiltrados.length === 0 && (
                <div className="pagination">
                    <button onClick={paginaAnterior} disabled={!enlaceAnterior}>
                        Anterior
                    </button>
                    <span>Página {paginaActual} de {totalPaginas}</span>
                    <button onClick={paginaSiguiente} disabled={!enlaceSiguiente}>
                        Siguiente
                    </button>
                </div>
            )}

            {/* Mostrar personajes (filtrados o paginados) */}
            <div className="personajes-grid">
                {personajesAMostrar.map((personaje) => (
                    <Link to={`/personajes/${personaje.id}`} key={personaje.id} className="personaje-card">
                        <h3>{personaje.name}</h3>
                        <img src={personaje.image} alt={personaje.name} />
                        <p>{personaje.ki ? `Ki: ${personaje.ki}` : 'Ki no disponible'}</p>
                        <p>{personaje.gender ? `Genero: ${personaje.gender}` : 'Genero no disponible'}</p>
                        <p>{personaje.race ? `Raza: ${personaje.race}` : 'Raza no disponible'}</p>
                    </Link>
                ))}
            </div>

            {/* Paginación abajo (se oculta si hay búsqueda) */}
            {personajesFiltrados.length === 0 && (
                <div className="pagination">
                    <button onClick={paginaAnterior} disabled={!enlaceAnterior}>
                        Anterior
                    </button>
                    <span>Página {paginaActual} de {totalPaginas}</span>
                    <button onClick={paginaSiguiente} disabled={!enlaceSiguiente}>
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

export default Personajes;
