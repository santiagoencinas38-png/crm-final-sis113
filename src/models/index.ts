// index.ts - Demuestra polimorfismo, metodos estaticos y patrones POO
import { Persona } from './Persona';
import { Cliente, TipoCliente } from './Cliente';
import { Empleado, Especialidad } from './Empleado';
import { Servicio, CategoriaServicio } from './Servicio';
import { Cita, EstadoCita } from './Cita';

// ============================================================
// DEMOSTRACION DE POLIMORFISMO
// Array de tipo base Persona[] con instancias distintas
// ============================================================
export function demostrarPolimorfismo(): void {
  const personas: Persona[] = [
    new Cliente('c1', 'Maria Lopez', '70012345', 'maria@email.com', 'Cliente VIP', TipoCliente.VIP),
    new Cliente('c2', 'Carlos Ruiz', '71234567', 'carlos@email.com'),
    new Empleado('e1', 'Pedro Mamani', '77001122', 'pedro@crm.com', [Especialidad.CORTE, Especialidad.BARBERIA]),
    new Empleado('e2', 'Lucia Quispe', '76543210', 'lucia@crm.com', [Especialidad.COLORACION]),
  ];

  console.log('=== POLIMORFISMO: getRol() y obtenerFichaTecnica() ===');
  personas.forEach(p => {
    console.log(`[${p.getRol()}] ${p.obtenerFichaTecnica()}`);
  });

  // Ordenar por nombre usando metodo estatico
  const ordenados = [...personas].sort(Persona.compararPorNombre);
  console.log('\n=== ORDENADOS POR NOMBRE (metodo estatico) ===');
  ordenados.forEach(p => console.log(` - ${p.getNombre()}`));
}

// ============================================================
// DEMOSTRACION DE ENUMS
// ============================================================
export function demostrarEnums(): void {
  console.log('\n=== ENUMS DEL SISTEMA ===');
  console.log('Estados de Cita:', Object.values(EstadoCita));
  console.log('Categorias de Servicio:', Object.values(CategoriaServicio));
  console.log('Especialidades:', Object.values(Especialidad));
  console.log('Tipos de Cliente:', Object.values(TipoCliente));
}

// ============================================================
// DEMOSTRACION DE METODOS ESTATICOS
// ============================================================
export function demostrarMetodosEstaticos(): void {
  const servicios = [
    new Servicio('s1', 'Corte', 50, 30, CategoriaServicio.CORTE),
    new Servicio('s2', 'Coloracion', 200, 120, CategoriaServicio.COLORACION),
    new Servicio('s3', 'Barba', 30, 20, CategoriaServicio.CORTE),
  ];

  const ordenados = [...servicios].sort(Servicio.compararPorPrecio);
  console.log('\n=== SERVICIOS ORDENADOS POR PRECIO (metodo estatico) ===');
  ordenados.forEach(s => console.log(` - ${s.obtenerFichaTecnica()}`));
  console.log(`Precio maximo permitido: Bs. ${Servicio.PRECIO_MAXIMO}`);
}

// ============================================================
// DEMOSTRACION DE TRANSICIONES DE ESTADO (Cita)
// ============================================================
export function demostrarEstados(): void {
  console.log('\n=== TRANSICIONES DE ESTADO DE CITA ===');
  const cita = new Cita('cit1', 'c1', 'e1', 's1', new Date(), 'Cita de prueba');
  console.log(`Estado inicial: ${cita.getEstado()}`);
  cita.confirmar();
  console.log(`Despues de confirmar: ${cita.getEstado()}`);
  cita.completar();
  console.log(`Despues de completar: ${cita.getEstado()}`);

  // Demostrar excepcion
  try {
    cita.cancelar();
  } catch (e: any) {
    console.log(`Excepcion capturada: ${e.message}`);
  }
}

// Ejecutar todas las demostraciones
demostrarPolimorfismo();
demostrarEnums();
demostrarMetodosEstaticos();
demostrarEstados();