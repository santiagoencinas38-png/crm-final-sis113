import { Persona } from './Persona.js';

export class Cliente extends Persona {
  private historialCitas: string[] = [];
  private notas: string;

  constructor(id: string, nombre: string, telefono: string, email: string, notas: string = '') {
    super(id, nombre, telefono, email);
    this.notas = notas;
  }

  getRol(): string { return 'Cliente'; }
  getNotas(): string { return this.notas; }
  getHistorial(): string[] { return this.historialCitas; }

  agregarCita(citaId: string): void {
    this.historialCitas.push(citaId);
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      notas: this.notas,
      historialCitas: this.historialCitas
    };
  }
}
