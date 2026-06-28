// Enum para categorias de servicio
export enum CategoriaServicio {
  CORTE = 'Corte',
  COLORACION = 'Coloración',
  TRATAMIENTO = 'Tratamiento',
  ESTETICA = 'Estética',
  MEDICO = 'Médico',
  TECNICO = 'Técnico',
  OTRO = 'Otro'
}

// Interface - elemento de competencia 3
export interface IServicio {
  getId(): string;
  getNombre(): string;
  getPrecio(): number;
  getDuracionMinutos(): number;
  getCategoria(): CategoriaServicio;
}

export class Servicio implements IServicio {
  private readonly id: string;
  private readonly nombre: string;
  private precio: number;
  private readonly duracionMinutos: number;
  private readonly categoria: CategoriaServicio;

  // Precio maximo permitido - atributo estatico
  static readonly PRECIO_MAXIMO: number = 10000;

  constructor(
    id: string,
    nombre: string,
    precio: number,
    duracion: number,
    categoria: CategoriaServicio
  ) {
    if (precio < 0) throw new Error('El precio no puede ser negativo');
    if (precio > Servicio.PRECIO_MAXIMO) throw new Error(`El precio no puede superar ${Servicio.PRECIO_MAXIMO}`);
    if (duracion <= 0) throw new Error('La duración debe ser mayor a 0');
    if (!nombre.trim()) throw new Error('El nombre no puede estar vacío');

    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.duracionMinutos = duracion;
    this.categoria = categoria;
  }

  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  getPrecio(): number { return this.precio; }
  getDuracionMinutos(): number { return this.duracionMinutos; }
  getCategoria(): CategoriaServicio { return this.categoria; }

  setPrecio(nuevoPrecio: number): void {
    if (nuevoPrecio < 0) throw new Error('El precio no puede ser negativo');
    if (nuevoPrecio > Servicio.PRECIO_MAXIMO) throw new Error('Precio supera el máximo permitido');
    this.precio = nuevoPrecio;
  }

  // Metodo estatico - elemento de competencia 1
  static compararPorPrecio(a: IServicio, b: IServicio): number {
    return a.getPrecio() - b.getPrecio();
  }

  obtenerFichaTecnica(): string {
    return `[${this.categoria}] ${this.nombre} - Bs. ${this.precio} (${this.duracionMinutos} min)`;
  }

  toJSON(): object {
    return {
      id: this.id,
      nombre: this.nombre,
      precio: this.precio,
      duracionMinutos: this.duracionMinutos,
      categoria: this.categoria
    };
  }
}