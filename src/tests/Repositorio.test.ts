// Pruebas unitarias - SIS-113 CRM de Citas
// Cubre: POO, herencia, polimorfismo, enums, genericos, excepciones, metodos estaticos

const storage: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (k: string) => storage[k] || null,
  setItem: (k: string, v: string) => { storage[k] = v; },
  removeItem: (k: string) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

// ============================================================
// ENUMS
// ============================================================
enum EstadoCita { PENDIENTE='pendiente', CONFIRMADA='confirmada', CANCELADA='cancelada', COMPLETADA='completada' }
enum TipoCliente { REGULAR='Regular', VIP='VIP', NUEVO='Nuevo' }
enum Especialidad { CORTE='Corte', COLORACION='Coloración', BARBERIA='Barbería', TRATAMIENTO='Tratamiento' }
enum CategoriaServicio { CORTE='Corte', COLORACION='Coloración', TRATAMIENTO='Tratamiento', OTRO='Otro' }

// ============================================================
// CLASES
// ============================================================
abstract class Persona {
  protected readonly id: string;
  protected nombre: string;
  constructor(id: string, nombre: string, protected telefono: string, protected email: string) {
    if (new.target === Persona) throw new Error('Persona es abstracta');
    if (!id.trim()) throw new Error('ID no puede estar vacío');
    this.id = id; this.nombre = nombre;
  }
  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  abstract getRol(): string;
  abstract obtenerFichaTecnica(): string;
  static compararPorNombre(a: Persona, b: Persona): number { return a.getNombre().localeCompare(b.getNombre()); }
  toJSON(): object { return { id: this.id, nombre: this.nombre, rol: this.getRol() }; }
}

class Cliente extends Persona {
  private historialCitas: string[] = [];
  private tipo: TipoCliente;
  private static totalClientes: number = 0;
  constructor(id: string, nombre: string, tel: string, email: string, private notas: string = '', tipo: TipoCliente = TipoCliente.NUEVO) {
    if (!nombre.trim()) throw new Error('Nombre no puede estar vacío');
    if (!tel.trim()) throw new Error('Teléfono no puede estar vacío');
    super(id, nombre, tel, email);
    this.tipo = tipo; Cliente.totalClientes++;
  }
  getRol(): string { return 'Cliente'; }
  getTipo(): TipoCliente { return this.tipo; }
  getHistorial(): string[] { return this.historialCitas; }
  agregarCita(id: string): void {
    if (!id) throw new Error('ID de cita vacío');
    this.historialCitas.push(id);
    if (this.historialCitas.length >= 10) this.tipo = TipoCliente.VIP;
    else if (this.historialCitas.length >= 1) this.tipo = TipoCliente.REGULAR;
  }
  obtenerFichaTecnica(): string { return `${this.nombre} | ${this.tipo} | ${this.historialCitas.length} citas`; }
  static getTotalClientes(): number { return Cliente.totalClientes; }
  toJSON(): object { return { ...super.toJSON(), tipo: this.tipo, historialCitas: this.historialCitas }; }
}

class Empleado extends Persona {
  private disponible: boolean = true;
  private static totalEmpleados: number = 0;
  constructor(id: string, nombre: string, tel: string, email: string, private especialidades: Especialidad[]) {
    if (especialidades.length === 0) throw new Error('Debe tener al menos una especialidad');
    super(id, nombre, tel, email);
    Empleado.totalEmpleados++;
  }
  getRol(): string { return 'Empleado'; }
  isDisponible(): boolean { return this.disponible; }
  setDisponible(d: boolean): void { this.disponible = d; }
  tieneEspecialidad(e: Especialidad): boolean { return this.especialidades.includes(e); }
  obtenerFichaTecnica(): string { return `${this.nombre} | ${this.especialidades.join(', ')}`; }
  static getTotalEmpleados(): number { return Empleado.totalEmpleados; }
  toJSON(): object { return { ...super.toJSON(), especialidades: this.especialidades, disponible: this.disponible }; }
}

class Servicio {
  static readonly PRECIO_MAXIMO: number = 10000;
  constructor(
    private readonly id: string, private readonly nombre: string,
    private precio: number, private readonly duracionMinutos: number,
    private readonly categoria: CategoriaServicio
  ) {
    if (precio < 0) throw new Error('El precio no puede ser negativo');
    if (precio > Servicio.PRECIO_MAXIMO) throw new Error(`Precio supera el máximo`);
    if (duracionMinutos <= 0) throw new Error('La duración debe ser mayor a 0');
    if (!nombre.trim()) throw new Error('Nombre no puede estar vacío');
  }
  getId(): string { return this.id; }
  getPrecio(): number { return this.precio; }
  getNombre(): string { return this.nombre; }
  getCategoria(): CategoriaServicio { return this.categoria; }
  obtenerFichaTecnica(): string { return `[${this.categoria}] ${this.nombre} - Bs. ${this.precio}`; }
  static compararPorPrecio(a: Servicio, b: Servicio): number { return a.getPrecio() - b.getPrecio(); }
  toJSON(): object { return { id: this.id, nombre: this.nombre, precio: this.precio, duracionMinutos: this.duracionMinutos, categoria: this.categoria }; }
}

class Cita {
  private readonly id: string;
  private estado: EstadoCita;
  constructor(id: string, private readonly clienteId: string, private readonly empleadoId: string,
    private readonly servicioId: string, private fecha: Date, private notas: string = '') {
    if (!clienteId) throw new Error('clienteId vacío');
    if (!empleadoId) throw new Error('empleadoId vacío');
    this.id = id; this.estado = EstadoCita.PENDIENTE;
  }
  getId(): string { return this.id; }
  getEstado(): EstadoCita { return this.estado; }
  estaActiva(): boolean { return this.estado === EstadoCita.PENDIENTE || this.estado === EstadoCita.CONFIRMADA; }
  confirmar(): void {
    if (this.estado === EstadoCita.CANCELADA) throw new Error('No se puede confirmar una cita cancelada');
    this.estado = EstadoCita.CONFIRMADA;
  }
  cancelar(): void {
    if (this.estado === EstadoCita.COMPLETADA) throw new Error('No se puede cancelar una cita completada');
    this.estado = EstadoCita.CANCELADA;
  }
  completar(): void {
    if (this.estado !== EstadoCita.CONFIRMADA) throw new Error('Solo se pueden completar citas confirmadas');
    this.estado = EstadoCita.COMPLETADA;
  }
  toJSON(): object { return { id: this.id, estado: this.estado, fecha: this.fecha.toISOString() }; }
}

interface IEntidad { getId(): string; toJSON(): object; }

class Repositorio<T extends IEntidad> {
  private items: Map<string, T> = new Map();
  constructor(private nombre: string) {}
  agregar(item: T): void {
    if (this.items.has(item.getId())) throw new Error(`${this.nombre} ya existe`);
    this.items.set(item.getId(), item);
  }
  obtener(id: string): T {
    const item = this.items.get(id);
    if (!item) throw new Error(`${this.nombre} no encontrado`);
    return item;
  }
  obtenerTodos(): T[] { return Array.from(this.items.values()); }
  eliminar(id: string): void { if (!this.items.delete(id)) throw new Error(`${this.nombre} no encontrado`); }
  contar(): number { return this.items.size; }
}

// ============================================================
// UTILIDADES DE PRUEBA
// ============================================================
let passed = 0; let failed = 0;

function test(nombre: string, fn: () => void): void {
  try { fn(); console.log(`  ✅ ${nombre}`); passed++; }
  catch (e: any) { console.log(`  ❌ ${nombre}\n     ${e.message}`); failed++; }
}

function expect(valor: any) {
  return {
    toBe: (e: any) => { if (valor !== e) throw new Error(`Esperaba ${e}, obtuvo ${valor}`); },
    toBeTruthy: () => { if (!valor) throw new Error(`Esperaba verdadero, obtuvo ${valor}`); },
    toBeFalsy: () => { if (valor) throw new Error(`Esperaba falso, obtuvo ${valor}`); },
    toHaveLength: (n: number) => { if (valor.length !== n) throw new Error(`Esperaba longitud ${n}, obtuvo ${valor.length}`); },
  };
}

function expectThrow(fn: () => void, msg?: string): void {
  try { fn(); throw new Error('Se esperaba excepción pero no se lanzó'); }
  catch (e: any) {
    if (e.message === 'Se esperaba excepción pero no se lanzó') throw e;
    if (msg && !e.message.includes(msg)) throw new Error(`Esperaba "${msg}", obtuvo "${e.message}"`);
  }
}

// ============================================================
// SUITE 1: HERENCIA Y POLIMORFISMO
// ============================================================
console.log('\n📋 SUITE 1: Herencia, Polimorfismo y Clases Abstractas');

test('Cliente hereda de Persona correctamente', () => {
  const c = new Cliente('1', 'Maria', '70012345', 'maria@test.com');
  expect(c instanceof Persona).toBeTruthy();
  expect(c.getRol()).toBe('Cliente');
});

test('Empleado hereda de Persona correctamente', () => {
  const e = new Empleado('2', 'Pedro', '77001122', 'pedro@test.com', [Especialidad.CORTE]);
  expect(e instanceof Persona).toBeTruthy();
  expect(e.getRol()).toBe('Empleado');
});

test('Polimorfismo: getRol() difiere segun subclase', () => {
  const personas: Persona[] = [
    new Cliente('p1', 'Ana', '111', 'ana@test.com'),
    new Empleado('p2', 'Luis', '222', 'luis@test.com', [Especialidad.COLORACION])
  ];
  expect(personas[0].getRol()).toBe('Cliente');
  expect(personas[1].getRol()).toBe('Empleado');
});

test('Polimorfismo: obtenerFichaTecnica() difiere segun subclase', () => {
  const personas: Persona[] = [
    new Cliente('p3', 'Ana', '111', 'ana@test.com'),
    new Empleado('p4', 'Luis', '222', 'luis@test.com', [Especialidad.CORTE])
  ];
  const fichas = personas.map(p => p.obtenerFichaTecnica());
  expect(fichas[0].includes('citas')).toBeTruthy();
  expect(fichas[1].includes('Corte')).toBeTruthy();
});

test('Metodo estatico: compararPorNombre ordena correctamente', () => {
  const personas: Persona[] = [
    new Cliente('x1', 'Zara', '111', 'z@test.com'),
    new Cliente('x2', 'Ana', '222', 'a@test.com'),
  ];
  const ordenados = [...personas].sort(Persona.compararPorNombre);
  expect(ordenados[0].getNombre()).toBe('Ana');
});

// ============================================================
// SUITE 2: ENUMS
// ============================================================
console.log('\n🏷️  SUITE 2: Enums del Sistema');

test('EstadoCita tiene los 4 estados correctos', () => {
  expect(EstadoCita.PENDIENTE).toBe('pendiente');
  expect(EstadoCita.CONFIRMADA).toBe('confirmada');
  expect(EstadoCita.CANCELADA).toBe('cancelada');
  expect(EstadoCita.COMPLETADA).toBe('completada');
});

test('TipoCliente tiene los 3 tipos correctos', () => {
  expect(TipoCliente.NUEVO).toBe('Nuevo');
  expect(TipoCliente.REGULAR).toBe('Regular');
  expect(TipoCliente.VIP).toBe('VIP');
});

test('Cliente inicia como NUEVO y sube a REGULAR al agregar cita', () => {
  const c = new Cliente('tc1', 'Test', '111', 'test@test.com');
  expect(c.getTipo()).toBe(TipoCliente.NUEVO);
  c.agregarCita('cita-1');
  expect(c.getTipo()).toBe(TipoCliente.REGULAR);
});

test('Cliente sube a VIP al tener 10 o mas citas', () => {
  const c = new Cliente('tc2', 'VIP Test', '111', 'vip@test.com');
  for (let i = 0; i < 10; i++) c.agregarCita(`cita-${i}`);
  expect(c.getTipo()).toBe(TipoCliente.VIP);
});

test('Empleado verifica especialidad con enum', () => {
  const e = new Empleado('e1', 'Pedro', '111', 'p@test.com', [Especialidad.CORTE, Especialidad.BARBERIA]);
  expect(e.tieneEspecialidad(Especialidad.CORTE)).toBeTruthy();
  expect(e.tieneEspecialidad(Especialidad.COLORACION)).toBeFalsy();
});

// ============================================================
// SUITE 3: TRANSICIONES DE ESTADO (Cita)
// ============================================================
console.log('\n📅 SUITE 3: Transiciones de Estado de Cita');

test('Cita inicia en estado PENDIENTE', () => {
  const c = new Cita('c1', 'cli1', 'emp1', 'srv1', new Date());
  expect(c.getEstado()).toBe(EstadoCita.PENDIENTE);
  expect(c.estaActiva()).toBeTruthy();
});

test('Cita pasa de PENDIENTE a CONFIRMADA', () => {
  const c = new Cita('c2', 'cli1', 'emp1', 'srv1', new Date());
  c.confirmar();
  expect(c.getEstado()).toBe(EstadoCita.CONFIRMADA);
});

test('Cita pasa de CONFIRMADA a COMPLETADA', () => {
  const c = new Cita('c3', 'cli1', 'emp1', 'srv1', new Date());
  c.confirmar(); c.completar();
  expect(c.getEstado()).toBe(EstadoCita.COMPLETADA);
  expect(c.estaActiva()).toBeFalsy();
});

test('Excepcion: no se puede completar cita sin confirmar', () => {
  const c = new Cita('c4', 'cli1', 'emp1', 'srv1', new Date());
  expectThrow(() => c.completar(), 'Solo se pueden completar citas confirmadas');
});

test('Excepcion: no se puede cancelar cita completada', () => {
  const c = new Cita('c5', 'cli1', 'emp1', 'srv1', new Date());
  c.confirmar(); c.completar();
  expectThrow(() => c.cancelar(), 'No se puede cancelar una cita completada');
});

test('Excepcion: no se puede confirmar cita cancelada', () => {
  const c = new Cita('c6', 'cli1', 'emp1', 'srv1', new Date());
  c.cancelar();
  expectThrow(() => c.confirmar(), 'No se puede confirmar una cita cancelada');
});

// ============================================================
// SUITE 4: METODOS ESTATICOS Y VALIDACIONES
// ============================================================
console.log('\n⚡ SUITE 4: Métodos Estáticos y Validaciones');

test('Servicio.PRECIO_MAXIMO es 10000', () => {
  expect(Servicio.PRECIO_MAXIMO).toBe(10000);
});

test('Servicio.compararPorPrecio ordena correctamente', () => {
  const servicios = [
    new Servicio('s1', 'Corte', 50, 30, CategoriaServicio.CORTE),
    new Servicio('s2', 'Tinte', 200, 90, CategoriaServicio.COLORACION),
    new Servicio('s3', 'Barba', 30, 20, CategoriaServicio.CORTE),
  ];
  const ordenados = [...servicios].sort(Servicio.compararPorPrecio);
  expect(ordenados[0].getNombre()).toBe('Barba');
  expect(ordenados[2].getNombre()).toBe('Tinte');
});

test('Excepcion: precio negativo en Servicio', () => {
  expectThrow(() => new Servicio('s', 'Test', -1, 30, CategoriaServicio.CORTE), 'negativo');
});

test('Excepcion: precio supera maximo en Servicio', () => {
  expectThrow(() => new Servicio('s', 'Test', 99999, 30, CategoriaServicio.CORTE), 'máximo');
});

test('Excepcion: empleado sin especialidades', () => {
  expectThrow(() => new Empleado('e', 'Test', '111', 'e@test.com', []), 'especialidad');
});

test('Excepcion: cita con clienteId vacio', () => {
  expectThrow(() => new Cita('c', '', 'emp1', 'srv1', new Date()), 'vacío');
});

// ============================================================
// SUITE 5: REPOSITORIO GENERICO
// ============================================================
console.log('\n🗄️  SUITE 5: Repositorio<T> Genérico');

test('Repositorio<Cliente> agrega y recupera correctamente', () => {
  const repo = new Repositorio<Cliente>('clientes');
  repo.agregar(new Cliente('r1', 'Test', '111', 't@t.com'));
  expect(repo.obtener('r1').getNombre()).toBe('Test');
});

test('Repositorio<Empleado> funciona con tipo diferente', () => {
  const repo = new Repositorio<Empleado>('empleados');
  repo.agregar(new Empleado('r2', 'Test', '111', 't@t.com', [Especialidad.CORTE]));
  expect(repo.contar()).toBe(1);
});

test('Repositorio<Servicio> funciona con tipo diferente', () => {
  const repo = new Repositorio<Servicio>('servicios');
  repo.agregar(new Servicio('r3', 'Corte', 50, 30, CategoriaServicio.CORTE));
  expect(repo.contar()).toBe(1);
});

test('Repositorio lanza error en ID duplicado', () => {
  const repo = new Repositorio<Cliente>('cli2');
  repo.agregar(new Cliente('dup', 'Test', '111', 't@t.com'));
  expectThrow(() => repo.agregar(new Cliente('dup', 'Test2', '222', 't2@t.com')), 'ya existe');
});

test('Repositorio lanza error al buscar ID inexistente', () => {
  const repo = new Repositorio<Cliente>('cli3');
  expectThrow(() => repo.obtener('no-existe'), 'no encontrado');
});

test('Repositorio elimina y actualiza conteo', () => {
  const repo = new Repositorio<Cliente>('cli4');
  repo.agregar(new Cliente('del1', 'Test', '111', 't@t.com'));
  repo.eliminar('del1');
  expect(repo.contar()).toBe(0);
});

// ============================================================
// RESULTADO FINAL
// ============================================================
console.log('\n' + '='.repeat(55));
console.log(`📊 RESULTADO: ${passed} pruebas pasaron, ${failed} fallaron`);
console.log('='.repeat(55));
if (failed === 0) {
  console.log('🎉 Todas las pruebas pasaron exitosamente!\n');
} else {
  console.log(`⚠️  ${failed} prueba(s) fallaron.\n`);
  process.exit(1);
}