require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { 
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoCheklist
} =  require('./helpers/inquirer');

const Tareas = require('./models/tareas');



const main = async() => {
  
    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB) { //Load Tasks
      tareas.cargarTareasFromArray(tareasDB)
    }

    do {
      //Print Menu
      opt = await inquirerMenu();
      
      switch (opt) {
        case '1':
            //Add Option
            const desc =  await leerInput('Descipcion: ');
            tareas.crearTarea( desc )
          break;

          case '2':
            tareas.listadoCompleto();       
          break;

          case '3': //Listar Pendientes
            tareas.listarPendientesCompletadas(true);
          break;

          case '4': //Listar completadas
            tareas.listarPendientesCompletadas(false);
          break;

          case '5': //Completado | Pendiente
             const ids = await mostrarListadoCheklist( tareas.listadoArr );
             tareas.toggleCompletadas( ids )
          break;

          case '6': //Eliminar Tareas
            const id = await listadoTareasBorrar( tareas.listadoArr );
            
            if (id !== '0') {
            const ok = await confirmar('¿Está seguro?');
            
            if (ok) {
              tareas.borrarTarea( id );
              console.log('Tarea Borrada Correctamente');
            }
          }
              
          break;

      }

      guardarDB( tareas.listadoArr );

      await pausa();

    } while(opt !== '0')

}

main();