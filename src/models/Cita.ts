// Estados que puede tener una cita, para evitar strings sueltos por ahí
export enum EstadoCita {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada'
}

export class Cita {
  private readonly id: string;
  private readonly clienteId: string;
  private readonly empleadoId: string;
  private readonly servicioId: string;
  private fecha: Date;
  private estado: EstadoCita;
  private notas: string;

  constructor(
    id: string,
    clienteId: string,
    empleadoId: string,
    servicioId: string,
    fecha: Date,
    notas: string = ''
  ) {
    // Validación básica para no tener datos inconsistentes
    if (!clienteId) throw new Error('El clienteId no puede estar vacío');
    if (!empleadoId) throw new Error('El empleadoId no puede estar vacío');
    if (!servicioId) throw new Error('El servicioId no puede estar vacío');

    this.id = id;
    this.clienteId = clienteId;
    this.empleadoId = empleadoId;
    this.servicioId = servicioId;
    this.fecha = fecha;
    this.estado = EstadoCita.PENDIENTE; // Por defecto toda cita nace pendiente
    this.notas = notas;
  }

  getId(): string { return this.id; }
  getClienteId(): string { return this.clienteId; }
  getEmpleadoId(): string { return this.empleadoId; }
  getServicioId(): string { return this.servicioId; }
  getFecha(): Date { return this.fecha; }
  getEstado(): EstadoCita { return this.estado; }
  getNotas(): string { return this.notas; }

  confirmar(): void {
    // Regla de negocio: no se puede revivir una cita cancelada
    if (this.estado === EstadoCita.CANCELADA) throw new Error('No se puede confirmar una cita cancelada');
    this.estado = EstadoCita.CONFIRMADA;
  }

  cancelar(): void {
    // Si ya se completó el servicio, no tiene sentido cancelarla
    if (this.estado === EstadoCita.COMPLETADA) throw new Error('No se puede cancelar una cita completada');
    this.estado = EstadoCita.CANCELADA;
  }

  completar(): void {
    // Solo permitimos completar si previamente fue confirmada
    if (this.estado !== EstadoCita.CONFIRMADA) throw new Error('Solo se pueden completar citas confirmadas');
    this.estado = EstadoCita.COMPLETADA;
  }

  estaActiva(): boolean {
    return this.estado === EstadoCita.PENDIENTE || this.estado === EstadoCita.CONFIRMADA;
  }

  toJSON(): object {
    // Preparamos el objeto para el almacenamiento en localStorage
    return {
      id: this.id,
      clienteId: this.clienteId,
      empleadoId: this.empleadoId,
      servicioId: this.servicioId,
      fecha: this.fecha.toISOString(),
      estado: this.estado,
      notas: this.notas
    };
  }
}