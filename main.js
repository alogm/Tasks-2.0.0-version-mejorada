// funcion de de bootstrap que permite lanzar un mensaje de confirmacion
// al agregar una nueva tarea
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

const alertTrigger = document.getElementById('liveAlertBtn')
if (alertTrigger) {
  alertTrigger.addEventListener('click', () => {
    appendAlert('Se agrego tarea correctamente', 'success')
  })
}

// Terminan las funciones de bootstrap

// Comienza las funciones para guardar tares, dividir y eliminar

// Se crea este metodo para cuando escuche el evento de submit, se ejecuta la funcion addTask
document.getElementById('formato').addEventListener('submit', addTask);

// Funcion que permite guardar tareas en localStorage
function addTask(e){
    e.preventDefault(); // evita que al enviar el formulario la pantalla se recargue

    // Obtiene el valor del campo mediante el id del html (textarea) y lo guarda en la variable tareas
    let tareas = document.getElementById('floatingTextarea').value;

    // busca en el localStorage si ya ha tareas guardadas con el valor de tasks
    // si exxiste la guarda en formato JSON con JSON.parse
    // Si no hay tareas guardadas crea un arreglo vacio []
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

    const task = {
        id: tasks.length + 1, // Permite aunmetar el id con el que se crea la tarea esto permite que cada id sea unico
        tareas, // aqui va a contener la tarea ingresada por el usuario
        completed: false // false indica que la tarea aun no esta completada
    };

    tasks.push(task); // Añade un nuevo obketo task al arreglo tasks

    //Convierte el arreglo tasks a un formato JSON (texto) y lo guarda en el 
    // localStorage bajo la clave 'tasks'. Esto permite almacenar las tareas de 
    // forma persistente en el navegador.
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // llama a la funcion pantalla para cargar la actualizacion con la tarea agregada
    pantalla();

    //resetea textarea para que despues de agregar la tarea este nuevamente en blanco 
    document.getElementById('formato').reset();
}

// Funcion que permite mostrar las tareas guardadas en la pantalla  
function pantalla(){
    // Recupera las tareas guardadas en localStorage y las convierte en array de objetos
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    // Selecciona por su id del html para monstrar las tareas 
    let taskView = document.getElementById('tasks');
    taskView.innerHTML = '';

    // Recorre cada tarea almacenada en tasks para crear un label por cada tarea
    // de igual manera crea a cada uno un checkbox para poeder validar si la tarea 
    // esta completada o sigue pendiente
    for (let i = 0; i < tasks.length; i++){
        let tarea = tasks[i].tareas;
        let completed =tasks[i].completed;

        taskView.innerHTML += 
        `<div>
            <div>
                <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="checkbox${i}" ${completed ? 'checked' : ''}>
                    <label class="form-check-label" for="flexCheckDefault">
                    ${tarea}
                    </label>
                </div>
            </div>
        </div>`;
    }

    // Aqui se añade un evento para manejar el cambio del estado del checkbox
    // Cada vez que el usuario marque o desmarque un checkbox, la tarea 
    // correspondiente se actualiza en el array tasks cambiando su estado completed.
    // Finalmente, las tareas se vuelven a guardar en localStorage para que los 
    // cambios sean persistentes.

    for(let i = 0; i < tasks.length; i++){
        let checkbox = document.getElementById(`checkbox${i}`);
        checkbox.addEventListener('change', function(){
            tasks[i].completed = checkbox.checked;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });
    }
}

// Esta funcion permite eliminar una tarea en especifico mediante su id 
// la funcion solo se activa al estar marcado el checkbox que permite 
// saber si esta completa la tares
function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')); // Obtiene el array de tareas del localStorage
    tasks = tasks.filter(task => task.id !== id); // Filtra las tareas, eliminando la que tiene el id proporcionado
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Actualiza el localStorage con el nuevo array de tareas (sin la tarea eliminada)
    pantalla(); // Llama a la función pantalla() para actualizar la interfaz y mostrar las tareas restantes
}

// Permite filtrar las tareas activas que aun no esten marcadas con el checkbox
function active(){
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let activeTasks = tasks.filter(task => !task.completed);
    updateTaskView(activeTasks);
}

// filtra las tareas que estan completadas mediante el checkbox
function completed(){
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let completedTasks = tasks.filter(task =>task.completed);
    updateTaskView(completedTasks);
}

// actualiza el estado de la pantalla
// las funcion de deleteTask elimina la tarea miesntras esta funcion se encarga de 
// actualizar la visualizacion aqui se agrega el button de delete
function updateTaskView(tasks){
    let taskView = document.getElementById('tasks');
    taskView.innerHTML = '';

    tasks.forEach((task) =>{
        let tareas = task.tareas;
        let completed = task.completed;

        let taskElement = document.createElement('div');
        taskElement.innerHTML =
        `<div class="task-item">
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <input type="checkbox" id="checkbox${task.id}" class="form-check-input" ${completed ? 'checked' : ''}>
                    <span>${tareas}</span>
                </div>
                <button type="button" class="btn btn-danger delete-link" data-id="${task.id}">Eliminar</button>
            </div>
        </div>`;

        let deleteLink = taskElement.querySelector('.delete-link');
        deleteLink.addEventListener('click', function(){
            deleteTask(task.id);
        });
        taskView.appendChild(taskElement);
    });
}

// Mediante el estado del checkbox puede validar su estado y 

// Permite ver todas la tareas activas o completadas
document.getElementById('allBtn').addEventListener('click', function(){
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    updateTaskView(tasks)
});

// Permite ver solo las tareas que aun no se an completadas que siguen sin estar marcadas con el checkbox
document.getElementById('activeBtn').addEventListener('click', active);
// Permite ver las tareas que  esten completadas que esten marcadas con el checkbo
document.getElementById('completedBtn').addEventListener('click', completed);

// El evento DOMContentLoaded se dispara cuando todo el HTML ha sido cargado 
// y procesado por el navegador, antes de que se carguen los recursos externos 
// como imágenes o estilos.
document.addEventListener('DOMContentLoaded', function(){
    pantalla();
})