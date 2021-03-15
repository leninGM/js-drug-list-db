// 1. Primero hay creamos la clase Drogas la cual sera la encargada de crear los objectos con la info de las drogas
class Drogas {
  constructor(nombre, url, pais, efectos, id) {
    this.id = id !== "" ? Number(id) : this.id()
    this.nombre = nombre;
    this.url = url;
    this.origen = pais;
    this.efectos = efectos;
  }

  // Esta funcion crea el id del objeto el cual es necesario para identificarlo al momento de editar y eliminar
  id() {
    if(localStorage.listaDeRegistros) {
      let registros =  JSON.parse(localStorage.listaDeRegistros)
      let index = registros.length - 1

      if(index === -1) return 1

      return registros[index].id + 1
    }

    return 1
  }
}

//2. Esta clase se encarga del registro en el localStorage
class Registros {
  registrarNuevoRegistro(registro) {
    if(this.validarBrowser) {
      if (localStorage.listaDeRegistros) {
        var registros = JSON.parse(localStorage.listaDeRegistros);
      } else {
        var registros = [];
      }

      registros.push(registro);
      localStorage.listaDeRegistros = JSON.stringify(registros);
      console.log("Registro agregado con exito");
      return true;
    }

    console.log("El browser no soporta localStorage");
    return false;
  }

  // funcion para obtener todos los registros
    listaDeRegistros() {
    if(localStorage.listaDeRegistros) {
      return JSON.parse(localStorage.listaDeRegistros);
    }

    console.log("No hay registros en el localStorage");
    return null;
  }

  // Esta funcion se encarga de crear los tr con los td en el tbody, se puede refactorizar
  mostrarListaDeRegistros() {
    var registros = this.listaDeRegistros();

    if(registros != undefined) {
      let tabla = document.querySelector("#tabla tbody");
      tabla.innerHTML = "";

      registros.forEach(registro => {
        let tr = document.createElement('tr');
        let nombre = registro.nombre;
        let url = registro.url;
        let origen = registro.origen;
        let efectos = registro.efectos
        let tdNombre = document.createElement('td');
        let tdUrl = document.createElement('td');
        let tdOrigen = document.createElement('td');
        let tdEfectos = document.createElement('td');
        let tdEliminar = document.createElement('td');
        let tdEditar = document.createElement('td');
        tdNombre.innerHTML = nombre;
        tdUrl.innerHTML = url;
        tdOrigen.innerHTML = origen;
        tdEfectos.innerHTML = efectos;

        let eliminar = document.createElement("a");
        eliminar.innerText = "elminar"
        eliminar.href = "#"
        eliminar.addEventListener('click', (e) => {
          e.preventDefault();
          this.eliminarRegistro(registro)
        })

        let editar = document.createElement("a");
        editar.innerText = "editar"
        editar.href = "#"
        editar.addEventListener('click', (e) => {
          e.preventDefault();
          this.editarRegistro(registro)
        })

        tdEliminar.appendChild(eliminar);
        tdEditar.appendChild(editar);
        tr.appendChild(tdNombre);
        tr.appendChild(tdUrl);
        tr.appendChild(tdOrigen);
        tr.appendChild(tdEfectos);
        tr.appendChild(tdEliminar);
        tr.appendChild(tdEditar);

        tabla.appendChild(tr);
      });
    }

    return null
  }

  // esta funcion elimina el registro que mandamos como parametro del array de registros
  eliminarRegistro(registro) {
    var registros = JSON.parse(localStorage.listaDeRegistros);
    registros = registros.filter((obj)=>{
      return obj.id != registro.id;
    })

    localStorage.listaDeRegistros = JSON.stringify(registros);
    console.log("Registro eliminado con exito");

    // limpiamos el formulario para evitar errores
    limpiarFormulario()

    // actualizamos la lista
    this.mostrarListaDeRegistros()
    return true
  }

  // Validamos el browser para saber si soporta el localStorage
  validarBrowser() {
    if (typeof(Storage) !== "undefined") return true;
    return false;
  }

  // esta funcion sirve para poner los valores del registro que queremos registrar en el formulario
  editarRegistro(registro){
    var registros = JSON.parse(localStorage.listaDeRegistros);
    // limpiamos el formulario para evitar errores
    limpiarFormulario()

    for(let i in registros){
      if(registros[i].id == registro.id) {
        let nombre = registro.nombre;
        let url = registro.url;
        let origen = registro.origen;
        let efectos = registro.efectos

        document.getElementById('nombre').value = nombre;
        document.getElementById('url').value = url;
        document.getElementById('pais').value = origen;
        document.getElementById('efectos').value = efectos;
        document.getElementById('registroId').value = registro.id;
        document.getElementById('guardar').innerHTML = "Actualizar registro";
      }
    }
  }

  // esta funcion sirve para actualizar un registro
  actualizarRegistro(registro){
    let registroDeDrogas = new Registros;

    let registros = JSON.parse(localStorage.listaDeRegistros);

    for(let i in registros){
      // actualizamoss el objeto
      if(registros[i].id === registro.id){
        registros[i] = registro;
      }
    }

    // guardamos en el storage
    localStorage.listaDeRegistros = JSON.stringify(registros);

    // Actualizamos la tabla
    registroDeDrogas.mostrarListaDeRegistros();

    // regresamos el texto original al boton
    document.getElementById('guardar').innerHTML = "Crear registro";
    console.log("Registro actualiziado");
  }
}

// 3. Esta funcion se ejecuta cada que se hace un submit del formulario, en ella se crea un objeto de la clase Drogas con la informacion que obtenemos de los campos del formulario, y despues este objeto lo guardamos en el active storage
const registro = (e) => {
  e.preventDefault();


  let nombre = document.getElementById('nombre').value;
  let url = document.getElementById('url').value;
  let pais = document.getElementById('pais').value;
  let efectos = document.getElementById('efectos').value;
  let id = document.getElementById('registroId').value;

  let btnText = document.getElementById('guardar').innerHTML

  const registros = new Registros;

  const registro = new Drogas(nombre, url, pais, efectos, id);

  if(btnText === "Actualizar registro") {
    registros.actualizarRegistro(registro);
    limpiarFormulario();
    return;
  }

  registros.registrarNuevoRegistro(registro);

  registros.mostrarListaDeRegistros();

  limpiarFormulario();
}

// funcion para destruir todos los registros
const destruirRegistros = (e) => {
  e.preventDefault();

  localStorage.clear();

  let tabla = document.querySelector("#tabla tbody");
  tabla.innerHTML = "";
}

// funcion para limpiar el formulario
const limpiarFormulario = () => {
  document.getElementById('nombre').value = "";
  document.getElementById('url').value = "";
  document.getElementById('pais').value = "";
  document.getElementById('efectos').value = "";
  document.getElementById('registroId').value = "";
}


