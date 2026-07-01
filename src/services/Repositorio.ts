// Interface necesaria para asegurar que cualquier T que use el repositorio tenga los métodos básicos
export interface IEntidad {
  getId(): string;
  toJSON(): object;
}

// Clase genérica: trabaja con cualquier entidad que implemente IEntidad
export class Repositorio<T extends IEntidad> {
  private items: Map<string, T> = new Map();
  private nombreEntidad: string;

  constructor(nombreEntidad: string) {
    this.nombreEntidad = nombreEntidad;
  }

  // CRUD: Crear
  agregar(item: T): void {
    if (this.items.has(item.getId())) {
      throw new Error(`${this.nombreEntidad} con ID ${item.getId()} ya existe`);
    }
    this.items.set(item.getId(), item);
    this.guardarEnStorage(); // Persistimos en cada cambio
  }

  // CRUD: Leer
  obtener(id: string): T {
    const item = this.items.get(id);
    if (!item) throw new Error(`${this.nombreEntidad} con ID ${id} no encontrado`);
    return item;
  }

  obtenerTodos(): T[] {
    return Array.from(this.items.values());
  }

  // CRUD: Actualizar
  actualizar(item: T): void {
    if (!this.items.has(item.getId())) {
      throw new Error(`${this.nombreEntidad} con ID ${item.getId()} no existe`);
    }
    this.items.set(item.getId(), item);
    this.guardarEnStorage();
  }

  // CRUD: Eliminar
  eliminar(id: string): void {
    if (!this.items.delete(id)) {
      throw new Error(`${this.nombreEntidad} con ID ${id} no encontrado`);
    }
    this.guardarEnStorage();
  }

  // Persistencia: Serializamos la colección a JSON para guardarla en el navegador
  private guardarEnStorage(): void {
    try {
      const datos = Array.from(this.items.values()).map(i => i.toJSON());
      localStorage.setItem(`crm_${this.nombreEntidad}`, JSON.stringify(datos));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }
  }

  // Recuperación: Volvemos a convertir el JSON a instancias de clase
  cargarDesdeStorage(reconstruct: (data: any) => T): void {
    try {
      const raw = localStorage.getItem(`crm_${this.nombreEntidad}`);
      if (raw) {
        const datos = JSON.parse(raw);
        datos.forEach((d: any) => {
          const item = reconstruct(d);
          this.items.set(item.getId(), item);
        });
      }
    } catch (e) {
      console.error('Error cargando desde localStorage:', e);
    }
  }

  contar(): number { return this.items.size; }
}