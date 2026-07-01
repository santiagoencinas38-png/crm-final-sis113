import { Persona } from './Persona';

// Enum para estandarizar las áreas de trabajo y evitar errores de dedo
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

  // Contador global para trackear cuántos empleados se han registrado en el sistema
  private static totalEmpleados: number = 0;

  constructor(
    id: string,
    nombre: string,
    telefono: string,
    email: string,
    especialidades: Especialidad[]
  ) {
    // Validamos que no creen un empleado "fantasma" sin habilidades
    if (especialidades.length === 0) throw new Error('El empleado debe tener al menos una especialidad');
    
    super(id, nombre, telefono, email);
    
    this.especialidades = especialidades;
    this.disponible = true; // Por defecto entran listos para trabajar
    this.fechaIngreso = new Date();
    Empleado.totalEmpleados++;
  }

  // Implementación de métodos abstractos de Persona
  getRol(): string { return 'Empleado'; }
  getEspecialidades(): Especialidad[] { return this.especialidades; }
  isDisponible(): boolean { return this.disponible; }
  getFechaIngreso(): Date { return this.fechaIngreso; }

  setDisponible(d: boolean): void { this.disponible = d; }

  // Utilidad para verificar si el empleado puede realizar un servicio específico
  tieneEspecialidad(esp: Especialidad): boolean {
    return this.especialidades.includes(esp);
  }

  // Método estático para consultar el total sin instanciar la clase
  static getTotalEmpleados(): number { return Empleado.totalEmpleados; }

  // Retorna un resumen rápido del estado del empleado para la interfaz
  obtenerFichaTecnica(): string {
    return `${this.getNombre()} | ${this.getRol()} | ${this.especialidades.join(', ')} | ${this.disponible ? 'Disponible' : 'Ocupado'}`;
  }

  // Serialización extendida usando la base de la clase Persona
  toJSON(): object {
    return {
      ...super.toJSON(),
      especialidades: this.especialidades,
      disponible: this.disponible,
      fechaIngreso: this.fechaIngreso.toISOString()
    };
  }
}