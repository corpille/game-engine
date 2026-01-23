import { System, SystemCtor } from '../types';

export function resolveOrder<T extends System>(systems: T[]): T[] {
  // Map constructor → instance
  const byType = new Map<SystemCtor, T>();
  for (const system of systems) {
    byType.set(system.constructor as SystemCtor, system);
  }

  // Build adjacency list (dependency graph)
  const graph = new Map<T, Set<T>>();
  const inDegree = new Map<T, number>();

  // Initialize graph
  for (const system of systems) {
    graph.set(system, new Set());
    inDegree.set(system, 0);
  }

  // Build edges
  for (const system of systems) {
    // runsAfter: A runs after B  =>  B → A
    for (const dep of system.runsAfter ?? []) {
      const depSystem = byType.get(dep);
      if (!depSystem) continue;

      graph.get(depSystem)!.add(system);
      inDegree.set(system, inDegree.get(system)! + 1);
    }

    // runsBefore: A runs before B  =>  A → B
    for (const dep of system.runsBefore ?? []) {
      const depSystem = byType.get(dep);
      if (!depSystem) continue;

      graph.get(system)!.add(depSystem);
      inDegree.set(depSystem, inDegree.get(depSystem)! + 1);
    }
  }

  // Kahn’s algorithm
  const queue: T[] = [];
  for (const [system, degree] of inDegree) {
    if (degree === 0) queue.push(system);
  }

  const result: T[] = [];

  while (queue.length > 0) {
    const system = queue.shift()!;
    result.push(system);

    for (const next of graph.get(system)!) {
      const degree = inDegree.get(next)! - 1;
      inDegree.set(next, degree);
      if (degree === 0) queue.push(next);
    }
  }

  // Cycle detection
  if (result.length !== systems.length) {
    const unresolved = systems.filter((s) => !result.includes(s)).map((s) => s.constructor.name);

    throw new Error(`System dependency cycle detected:\n` + unresolved.map((n) => ` - ${n}`).join('\n'));
  }

  return result;
}
