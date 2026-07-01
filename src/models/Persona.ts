// Clase base abstracta - no se puede instanciar directamente, solo sirve de molde
export abstract class Persona {
  protected readonly id: string;
  protected nombre: string;
  protected telefono: string;
  protected email: string;

  constructor(
    id: string,
    nombre: string,
    telefono: string,
    email: string
  ) {
    // Evitamos que alguien haga un "new Persona()" por error
    if (new.target === Persona) throw new Error('Persona es una clase abstracta');
    
    // Validaciones básicas antes de asignar
    if (!id.trim()) throw new Error('El ID no puede estar vacío');
    
    this.id = id;
    this.nombre = nombre;
    this.telefono = telefono;
    this.email = email;
  }

  // Getters para acceder a los datos protegidos
  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  getTelefono(): string { return this.telefono; }
  getEmail(): string { return this.email; }

  // Setters con validación de integridad
  setNombre(nombre: string): void {
    if (!nombre.trim()) throw new Error('El nombre no puede estar vacío');
    this.nombre = nombre;
  }
  
  setTelefono(tel: string): void {
    if (!tel.trim()) throw new Error('El teléfono no puede estar vacío');
    this.telefono = tel;
  }
  
  setEmail(email: string): void { this.email = email; }

  // Métodos abstractos: obligan a las clases hijas a implementar su propia lógica
  abstract getRol(): string;
  abstract obtenerFichaTecnica(): string;

  // Método de utilidad para ordenar listas de personas, funciona sin instanciar la clase
  static compararPorNombre(a: Persona, b: Persona): number {
    return a.getNombre().localeCompare(b.getNombre());
  }

  // Serialización para guardar en el navegador
  toJSON(): object {
    return {
      id: this.id,
      nombre: this.nombre,
      telefono: this.telefono,
      email: this.email,
      rol: this.getRol() // Incluimos el rol dinámico
    };
  }
}