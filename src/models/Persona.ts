// Clase base abstracta - demuestra abstraccion y herencia
export abstract class Persona {
  protected id: string;
  protected nombre: string;
  protected telefono: string;
  protected email: string;

  constructor(id: string, nombre: string, telefono: string, email: string) {
    this.id = id;
    this.nombre = nombre;
    this.telefono = telefono;
    this.email = email;
  }

  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  getTelefono(): string { return this.telefono; }
  getEmail(): string { return this.email; }

  setNombre(nombre: string): void { this.nombre = nombre; }
  setTelefono(tel: string): void { this.telefono = tel; }
  setEmail(email: string): void { this.email = email; }

  // Metodo abstracto - polimorfismo
  abstract getRol(): string;

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
