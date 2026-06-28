import { Persona } from './Persona.js';

export class Empleado extends Persona {
  private especialidades: string[];
  private disponible: boolean;

  constructor(id: string, nombre: string, telefono: string, email: string, especialidades: string[]) {
    super(id, nombre, telefono, email);
    this.especialidades = especialidades;
    this.disponible = true;
  }

  getRol(): string { return 'Empleado'; }
  getEspecialidades(): string[] { return this.especialidades; }
  isDisponible(): boolean { return this.disponible; }
  setDisponible(d: boolean): void { this.disponible = d; }

  toJSON(): object {
    return {
      ...super.toJSON(),
      especialidades: this.especialidades,
      disponible: this.disponible
    };
  }
}
