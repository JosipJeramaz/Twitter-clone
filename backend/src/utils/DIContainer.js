/**
 * Dependency Injection Container
 * Manages object dependencies and their lifecycle
 */
class DIContainer {
  constructor() {
    this.dependencies = new Map();
    this.instances = new Map();
  }

  /**
   * Register a dependency with its factory function
   * @param {string} name - Dependency name
   * @param {Function} factory - Factory function that creates the dependency
   * @param {Object} options - Configuration options
   * @param {boolean} options.singleton - Whether to create only one instance
   */
  register(name, factory, options = { singleton: true }) {
    if (typeof factory !== 'function') {
      throw new Error(`Factory for '${name}' must be a function`);
    }

    this.dependencies.set(name, {
      factory,
      singleton: options.singleton,
      dependencies: options.dependencies || []
    });

    return this;
  }

  /**
   * Register a singleton dependency
   * @param {string} name - Dependency name
   * @param {Function} factory - Factory function
   */
  registerSingleton(name, factory, dependencies = []) {
    return this.register(name, factory, { singleton: true, dependencies });
  }

  /**
   * Register a transient dependency (new instance every time)
   * @param {string} name - Dependency name
   * @param {Function} factory - Factory function
   */
  registerTransient(name, factory, dependencies = []) {
    return this.register(name, factory, { singleton: false, dependencies });
  }

  /**
   * Register an existing instance
   * @param {string} name - Dependency name
   * @param {*} instance - The instance to register
   */
  registerInstance(name, instance) {
    this.instances.set(name, instance);
    return this;
  }

  /**
   * Resolve a dependency and its dependencies recursively
   * @param {string} name - Dependency name to resolve
   * @returns {*} The resolved dependency instance
   */
  resolve(name) {
    // Check if already instantiated (for singletons)
    if (this.instances.has(name)) {
      return this.instances.get(name);
    }

    const dependency = this.dependencies.get(name);
    if (!dependency) {
      throw new Error(`Dependency '${name}' not found. Make sure it's registered.`);
    }

    try {
      // Create new instance by passing the container to the factory
      const instance = dependency.factory(this);

      // Store instance if singleton
      if (dependency.singleton) {
        this.instances.set(name, instance);
      }

      return instance;
    } catch (error) {
      throw new Error(`Failed to resolve dependency '${name}': ${error.message}`);
    }
  }

  /**
   * Check if a dependency is registered
   * @param {string} name - Dependency name
   * @returns {boolean}
   */
  has(name) {
    return this.dependencies.has(name) || this.instances.has(name);
  }

  /**
   * Get all registered dependency names
   * @returns {string[]}
   */
  getRegisteredNames() {
    return [
      ...this.dependencies.keys(),
      ...this.instances.keys()
    ];
  }

  /**
   * Clear all dependencies and instances
   */
  clear() {
    this.dependencies.clear();
    this.instances.clear();
  }

  /**
   * Create a child container that inherits from this one
   * @returns {DIContainer}
   */
  createChild() {
    const child = new DIContainer();
    
    // Copy dependencies (not instances)
    for (const [name, dependency] of this.dependencies) {
      child.dependencies.set(name, dependency);
    }

    // Reference parent for resolution fallback
    child.parent = this;
    
    return child;
  }

  /**
   * Resolve with fallback to parent container
   * @param {string} name - Dependency name
   * @returns {*}
   */
  resolveWithFallback(name) {
    try {
      return this.resolve(name);
    } catch (error) {
      if (this.parent) {
        return this.parent.resolveWithFallback(name);
      }
      throw error;
    }
  }
}

module.exports = DIContainer;