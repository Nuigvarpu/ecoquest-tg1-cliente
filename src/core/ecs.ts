// ECS simplificado (RF-04, RF-05): entidades = números, componentes = datos,
// sistemas = funciones que recorren componentes en un orden fijo.
// No depende del dispositivo de salida (RNF-10).

export type Entity = number;

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Components {
  position: Position;
  velocity: Velocity;
  /** Jugador controlado por este cliente. */
  localPlayer: true;
  /** Jugador remoto, identificado por su id de red. */
  remote: { peerId: string };
}

export type ComponentName = keyof Components;

export class World {
  private nextId: Entity = 1;
  private readonly stores: { [K in ComponentName]: Map<Entity, Components[K]> } = {
    position: new Map(),
    velocity: new Map(),
    localPlayer: new Map(),
    remote: new Map(),
  };

  createEntity(): Entity {
    return this.nextId++;
  }

  destroyEntity(e: Entity): void {
    for (const store of Object.values(this.stores)) store.delete(e);
  }

  add<K extends ComponentName>(e: Entity, name: K, value: Components[K]): void {
    this.stores[name].set(e, value);
  }

  get<K extends ComponentName>(e: Entity, name: K): Components[K] | undefined {
    return this.stores[name].get(e);
  }

  /** Entidades que tienen todos los componentes pedidos, en orden de creación. */
  query(...names: ComponentName[]): Entity[] {
    const [first, ...rest] = names;
    const result: Entity[] = [];
    for (const e of this.stores[first].keys()) {
      if (rest.every((n) => this.stores[n].has(e))) result.push(e);
    }
    return result.sort((a, b) => a - b);
  }

  /** Estado serializable para intercambiar con el módulo de red (RF-06). */
  snapshot(): Array<{ id: Entity; x: number; y: number }> {
    return this.query("position").map((id) => {
      const p = this.stores.position.get(id)!;
      return { id, x: p.x, y: p.y };
    });
  }
}
