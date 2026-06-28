// Interface - elemento de competencia 3
export interface IServicio {
  getId(): string;
  getNombre(): string;
  getPrecio(): number;
  getDuracionMinutos(): number;
}

export class Servicio implements IServicio {
  private id: string;
  private nombre: string;
  private precio: number;
  private duracionMinutos: number;
  private categoria: string;

  constructor(id: string, nombre: string, precio: number, duracion: number, categoria: string) {
    if (precio < 0) throw new Error('El precio no puede ser negativo');
    if (duracion <= 0) throw new Error('La duracion debe ser mayor a 0');
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
  getCategoria(): string { return this.categoria; }

  toJSON(): object {
    return { id: this.id, nombre: this.nombre, precio: this.precio, duracionMinutos: this.duracionMinutos, categoria: this.categoria };
  }
}
