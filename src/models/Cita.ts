export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export class Cita {
  private id: string;
  private clienteId: string;
  private empleadoId: string;
  private servicioId: string;
  private fecha: Date;
  private estado: EstadoCita;
  private notas: string;

  constructor(id: string, clienteId: string, empleadoId: string, servicioId: string, fecha: Date, notas: string = '') {
    if (fecha < new Date()) {
      // Permitimos fechas pasadas para datos de prueba, solo advertimos
      console.warn('Advertencia: la fecha de la cita es en el pasado');
    }
    this.id = id;
    this.clienteId = clienteId;
    this.empleadoId = empleadoId;
    this.servicioId = servicioId;
    this.fecha = fecha;
    this.estado = 'pendiente';
    this.notas = notas;
  }

  getId(): string { return this.id; }
  getClienteId(): string { return this.clienteId; }
  getEmpleadoId(): string { return this.empleadoId; }
  getServicioId(): string { return this.servicioId; }
  getFecha(): Date { return this.fecha; }
  getEstado(): EstadoCita { return this.estado; }
  getNotas(): string { return this.notas; }

  confirmar(): void { this.estado = 'confirmada'; }
  cancelar(): void { this.estado = 'cancelada'; }
  completar(): void { this.estado = 'completada'; }

  toJSON(): object {
    return {
      id: this.id, clienteId: this.clienteId, empleadoId: this.empleadoId,
      servicioId: this.servicioId, fecha: this.fecha.toISOString(),
      estado: this.estado, notas: this.notas
    };
  }
}
