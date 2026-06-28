import { Persona } from './Persona';

// Enum para especialidades
export enum Especialidad {
  CORTE = 'Corte',
  COLORACION = 'Coloración',
  BARBERIA = 'Barbería',
  TRATAMIENTO = 'Tratamiento',
  ESTETICA = 'Estética',
  MEDICO = 'Médico',
  TECNICO = 'Técnico'
}

export class Empleado extends Persona {
  private especialidades: Especialidad[];
  private disponible: boolean;
  private readonly fechaIngreso: Date;

  // Contador estatico de empleados creados
  private static totalEmpleados: number = 0;

  constructor(
    id: string,
    nombre: string,
    telefono: string,
    email: string,
    especialidades: Especialidad[]
  ) {
    if (especialidades.length === 0) throw new Error('El empleado debe tener al menos una especialidad');
    super(id, nombre, telefono, email);
    this.especialidades = especialidades;
    this.disponible = true;
    this.fechaIngreso = new Date();
    Empleado.totalEmpleados++;
  }

  getRol(): string { return 'Empleado'; }
  getEspecialidades(): Especialidad[] { return this.especialidades; }
  isDisponible(): boolean { return this.disponible; }
  getFechaIngreso(): Date { return this.fechaIngreso; }

  setDisponible(d: boolean): void { this.disponible = d; }

  tieneEspecialidad(esp: Especialidad): boolean {
    return this.especialidades.includes(esp);
  }

  // Metodo estatico
  static getTotalEmpleados(): number { return Empleado.totalEmpleados; }

  obtenerFichaTecnica(): string {
    return `${this.getNombre()} | ${this.getRol()} | ${this.especialidades.join(', ')} | ${this.disponible ? 'Disponible' : 'Ocupado'}`;
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      especialidades: this.especialidades,
      disponible: this.disponible,
      fechaIngreso: this.fechaIngreso.toISOString()
    };
  }
}