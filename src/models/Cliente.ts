import { Persona } from './Persona';

export enum TipoCliente {
  REGULAR = 'Regular',
  VIP = 'VIP',
  NUEVO = 'Nuevo'
}

export class Cliente extends Persona {
  private historialCitas: string[];
  private notas: string;
  private tipo: TipoCliente;
  private readonly fechaRegistro: Date;

  // Contador estatico
  private static totalClientes: number = 0;

  constructor(
    id: string,
    nombre: string,
    telefono: string,
    email: string,
    notas: string = '',
    tipo: TipoCliente = TipoCliente.NUEVO
  ) {
    if (!nombre.trim()) throw new Error('El nombre no puede estar vacío');
    if (!telefono.trim()) throw new Error('El teléfono no puede estar vacío');
    super(id, nombre, telefono, email);
    this.historialCitas = [];
    this.notas = notas;
    this.tipo = tipo;
    this.fechaRegistro = new Date();
    Cliente.totalClientes++;
  }

  getRol(): string { return 'Cliente'; }
  getNotas(): string { return this.notas; }
  getHistorial(): string[] { return this.historialCitas; }
  getTipo(): TipoCliente { return this.tipo; }
  getFechaRegistro(): Date { return this.fechaRegistro; }

  setNotas(notas: string): void { this.notas = notas; }

  agregarCita(citaId: string): void {
    if (!citaId) throw new Error('El ID de cita no puede estar vacío');
    this.historialCitas.push(citaId);
    if (this.historialCitas.length >= 10) this.tipo = TipoCliente.VIP;
    else if (this.historialCitas.length >= 1) this.tipo = TipoCliente.REGULAR;
  }

  getTotalCitas(): number { return this.historialCitas.length; }

  // Metodo estatico
  static getTotalClientes(): number { return Cliente.totalClientes; }

  // Polimorfismo - obtener ficha
  obtenerFichaTecnica(): string {
    return `${this.getNombre()} | ${this.tipo} | ${this.historialCitas.length} citas | Tel: ${this.getTelefono()}`;
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      notas: this.notas,
      tipo: this.tipo,
      historialCitas: this.historialCitas,
      fechaRegistro: this.fechaRegistro.toISOString()
    };
  }
}