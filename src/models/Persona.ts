// Clase base abstracta - demuestra abstraccion y herencia
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
    if (new.target === Persona) throw new Error('Persona es una clase abstracta');
    if (!id.trim()) throw new Error('El ID no puede estar vacío');
    this.id = id;
    this.nombre = nombre;
    this.telefono = telefono;
    this.email = email;
  }

  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  getTelefono(): string { return this.telefono; }
  getEmail(): string { return this.email; }

  setNombre(nombre: string): void {
    if (!nombre.trim()) throw new Error('El nombre no puede estar vacío');
    this.nombre = nombre;
  }
  setTelefono(tel: string): void {
    if (!tel.trim()) throw new Error('El teléfono no puede estar vacío');
    this.telefono = tel;
  }
  setEmail(email: string): void { this.email = email; }

  // Metodo abstracto - polimorfismo
  abstract getRol(): string;
  abstract obtenerFichaTecnica(): string;

  // Metodo estatico - demuestra miembros de clase
  static compararPorNombre(a: Persona, b: Persona): number {
    return a.getNombre().localeCompare(b.getNombre());
  }

  toJSON(): object {
    return {
      id: this.id,
      nombre: this.nombre,
      telefono: this.telefono,
      email: this.email,
      rol: this.getRol()
    };
  }
}