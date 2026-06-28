// Pruebas unitarias - SIS-113 CRM de Citas
// Verifica el comportamiento del Repositorio generico y los modelos POO

// ============================================================
// SIMULACION DE localStorage para pruebas
// ============================================================
const storage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => storage[key] || null,
  setItem: (key: string, value: string) => { storage[key] = value; },
  removeItem: (key: string) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};
(global as any).localStorage = localStorageMock;

// ============================================================
// CLASES (copias simplificadas para pruebas)
// ============================================================
abstract class Persona {
  constructor(
    protected id: string,
    protected nombre: string,
    protected telefono: string,
    protected email: string
  ) {}
  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  abstract getRol(): string;
  toJSON(): object {
    return { id: this.id, nombre: this.nombre, telefono: this.telefono, email: this.email, rol: this.getRol() };
  }
}

class Cliente extends Persona {
  private historialCitas: string[] = [];
  constructor(id: string, nombre: string, telefono: string, email: string) {
    super(id, nombre, telefono, email);
  }
  getRol(): string { return 'Cliente'; }
  agregarCita(citaId: string): void { this.historialCitas.push(citaId); }
  getHistorial(): string[] { return this.historialCitas; }
  toJSON(): object { return { ...super.toJSON(), historialCitas: this.historialCitas }; }
}

class Empleado extends Persona {
  private disponible: boolean = true;
  constructor(id: string, nombre: string, telefono: string, email: string, private especialidades: string[]) {
    super(id, nombre, telefono, email);
  }
  getRol(): string { return 'Empleado'; }
  isDisponible(): boolean { return this.disponible; }
  setDisponible(d: boolean): void { this.disponible = d; }
  toJSON(): object { return { ...super.toJSON(), especialidades: this.especialidades, disponible: this.disponible }; }
}

class Servicio {
  constructor(
    private id: string,
    private nombre: string,
    private precio: number,
    private duracionMinutos: number,
    private categoria: string
  ) {
    if (precio < 0) throw new Error('El precio no puede ser negativo');
    if (duracionMinutos <= 0) throw new Error('La duracion debe ser mayor a 0');
  }
  getId(): string { return this.id; }
  getPrecio(): number { return this.precio; }
  toJSON(): object { return { id: this.id, nombre: this.nombre, precio: this.precio, duracionMinutos: this.duracionMinutos, categoria: this.categoria }; }
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
  eliminar(id: string): void {
    if (!this.items.delete(id)) throw new Error(`${this.nombre} no encontrado`);
  }
  contar(): number { return this.items.size; }
}

// ============================================================
// UTILIDADES DE PRUEBA
// ============================================================
let passed = 0;
let failed = 0;

function test(nombre: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✅ ${nombre}`);
    passed++;
  } catch (e: any) {
    console.log(`  ❌ ${nombre}`);
    console.log(`     Error: ${e.message}`);
    failed++;
  }
}

function expect(valor: any) {
  return {
    toBe: (esperado: any) => {
      if (valor !== esperado) throw new Error(`Se esperaba ${esperado} pero se obtuvo ${valor}`);
    },
    toEqual: (esperado: any) => {
      if (JSON.stringify(valor) !== JSON.stringify(esperado))
        throw new Error(`Se esperaba ${JSON.stringify(esperado)} pero se obtuvo ${JSON.stringify(valor)}`);
    },
    toBeTruthy: () => {
      if (!valor) throw new Error(`Se esperaba valor verdadero pero se obtuvo ${valor}`);
    },
    toBeFalsy: () => {
      if (valor) throw new Error(`Se esperaba valor falso pero se obtuvo ${valor}`);
    },
    toThrow: (msg?: string) => {
      throw new Error('Usar expect(() => fn()).toThrow() con funcion');
    },
    toHaveLength: (len: number) => {
      if (valor.length !== len) throw new Error(`Se esperaba longitud ${len} pero se obtuvo ${valor.length}`);
    },
    toBeGreaterThan: (n: number) => {
      if (valor <= n) throw new Error(`Se esperaba mayor a ${n} pero se obtuvo ${valor}`);
    }
  };
}

function expectThrow(fn: () => void, mensajeEsperado?: string): void {
  try {
    fn();
    throw new Error('Se esperaba una excepcion pero no se lanzo ninguna');
  } catch (e: any) {
    if (e.message === 'Se esperaba una excepcion pero no se lanzo ninguna') throw e;
    if (mensajeEsperado && !e.message.includes(mensajeEsperado))
      throw new Error(`Se esperaba error con "${mensajeEsperado}" pero se obtuvo "${e.message}"`);
  }
}

// ============================================================
// SUITE 1: CLASE PERSONA (abstraccion y herencia)
// ============================================================
console.log('\n📋 SUITE 1: Persona, Cliente y Empleado (Herencia y POO)');

test('Cliente hereda correctamente de Persona', () => {
  const c = new Cliente('1', 'Maria Lopez', '70012345', 'maria@email.com');
  expect(c instanceof Persona).toBeTruthy();
  expect(c.getRol()).toBe('Cliente');
  expect(c.getNombre()).toBe('Maria Lopez');
});

test('Empleado hereda correctamente de Persona', () => {
  const e = new Empleado('2', 'Pedro Mamani', '77001122', 'pedro@crm.com', ['Corte', 'Barba']);
  expect(e instanceof Persona).toBeTruthy();
  expect(e.getRol()).toBe('Empleado');
});

test('Polimorfismo: getRol() retorna valor distinto segun subclase', () => {
  const personas: Persona[] = [
    new Cliente('1', 'Ana', '111', 'ana@a.com'),
    new Empleado('2', 'Luis', '222', 'luis@a.com', ['Corte'])
  ];
  expect(personas[0].getRol()).toBe('Cliente');
  expect(personas[1].getRol()).toBe('Empleado');
});

test('Cliente puede agregar citas al historial', () => {
  const c = new Cliente('3', 'Carlos', '70099999', 'carlos@email.com');
  c.agregarCita('cita-001');
  c.agregarCita('cita-002');
  expect(c.getHistorial()).toHaveLength(2);
});

test('Empleado cambia disponibilidad correctamente', () => {
  const e = new Empleado('4', 'Lucia', '76543210', 'lucia@crm.com', ['Coloracion']);
  expect(e.isDisponible()).toBeTruthy();
  e.setDisponible(false);
  expect(e.isDisponible()).toBeFalsy();
});

// ============================================================
// SUITE 2: CLASE SERVICIO (interfaces y excepciones)
// ============================================================
console.log('\n💼 SUITE 2: Servicio (Interfaces y Manejo de Excepciones)');

test('Servicio se crea correctamente con datos validos', () => {
  const s = new Servicio('s1', 'Corte de cabello', 50, 30, 'Corte');
  expect(s.getPrecio()).toBe(50);
  expect(s.getId()).toBe('s1');
});

test('Excepcion: precio negativo lanza error', () => {
  expectThrow(
    () => new Servicio('s2', 'Test', -10, 30, 'Corte'),
    'precio no puede ser negativo'
  );
});

test('Excepcion: duracion cero lanza error', () => {
  expectThrow(
    () => new Servicio('s3', 'Test', 50, 0, 'Corte'),
    'duracion debe ser mayor'
  );
});

test('Excepcion: duracion negativa lanza error', () => {
  expectThrow(
    () => new Servicio('s4', 'Test', 50, -15, 'Corte'),
    'duracion debe ser mayor'
  );
});

// ============================================================
// SUITE 3: REPOSITORIO GENERICO
// ============================================================
console.log('\n🗄️  SUITE 3: Repositorio<T> (Genericos)');

test('Repositorio agrega y recupera clientes correctamente', () => {
  const repo = new Repositorio<Cliente>('clientes');
  const c = new Cliente('c1', 'Test Cliente', '70000001', 'test@email.com');
  repo.agregar(c);
  const recuperado = repo.obtener('c1');
  expect(recuperado.getNombre()).toBe('Test Cliente');
});

test('Repositorio cuenta elementos correctamente', () => {
  const repo = new Repositorio<Cliente>('clientes2');
  repo.agregar(new Cliente('c1', 'Ana', '111', 'ana@a.com'));
  repo.agregar(new Cliente('c2', 'Luis', '222', 'luis@a.com'));
  repo.agregar(new Cliente('c3', 'Maria', '333', 'maria@a.com'));
  expect(repo.contar()).toBe(3);
});

test('Repositorio lanza error al agregar ID duplicado', () => {
  const repo = new Repositorio<Cliente>('clientes3');
  repo.agregar(new Cliente('dup1', 'Original', '111', 'a@a.com'));
  expectThrow(
    () => repo.agregar(new Cliente('dup1', 'Duplicado', '222', 'b@b.com')),
    'ya existe'
  );
});

test('Repositorio lanza error al buscar ID inexistente', () => {
  const repo = new Repositorio<Cliente>('clientes4');
  expectThrow(
    () => repo.obtener('no-existe'),
    'no encontrado'
  );
});

test('Repositorio elimina elementos correctamente', () => {
  const repo = new Repositorio<Cliente>('clientes5');
  repo.agregar(new Cliente('del1', 'Eliminar', '999', 'del@a.com'));
  expect(repo.contar()).toBe(1);
  repo.eliminar('del1');
  expect(repo.contar()).toBe(0);
});

test('Repositorio funciona con Empleados (genericidad)', () => {
  const repo = new Repositorio<Empleado>('empleados');
  repo.agregar(new Empleado('e1', 'Pedro', '77001122', 'pedro@crm.com', ['Corte']));
  repo.agregar(new Empleado('e2', 'Lucia', '76543210', 'lucia@crm.com', ['Coloracion']));
  expect(repo.contar()).toBe(2);
  expect(repo.obtenerTodos()).toHaveLength(2);
});

test('Repositorio funciona con Servicios (genericidad)', () => {
  const repo = new Repositorio<Servicio>('servicios');
  repo.agregar(new Servicio('sv1', 'Corte', 50, 30, 'Corte'));
  repo.agregar(new Servicio('sv2', 'Tinte', 150, 90, 'Coloracion'));
  expect(repo.contar()).toBe(2);
});

// ============================================================
// RESULTADO FINAL
// ============================================================
console.log('\n' + '='.repeat(50));
console.log(`📊 RESULTADO: ${passed} pruebas pasaron, ${failed} fallaron`);
console.log('='.repeat(50));
if (failed === 0) {
  console.log('🎉 Todas las pruebas pasaron exitosamente!\n');
} else {
  console.log(`⚠️  ${failed} prueba(s) fallaron. Revisar errores.\n`);
  process.exit(1);
}