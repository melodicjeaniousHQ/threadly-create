import { Injectable } from "@nestjs/common";

/**
 * A simple hashmap implementation using TypeScript's Map.
 */
@Injectable()
export default class HashMapService<K, V> {
    private map: Map<K, V>;
  
    /**
     * Creates a new empty hashmap.
     */
    constructor() {
      this.map = new Map<K, V>();
    }
  
    /**
     * Adds a key-value pair to the hashmap.
     * @param key The key to add.
     * @param value The value associated with the key.
     */
    set(key: K, value: V): void {
      this.map.set(key, value);
    }
  
    /**
     * Retrieves the value associated with a given key.
     * @param key The key to look up.
     * @returns The value associated with the key, or undefined if not found.
     */
    get(key: K): V | undefined {
      return this.map.get(key);
    }
  
    /**
     * Checks if a key exists in the hashmap.
     * @param key The key to check.
     * @returns True if the key exists, false otherwise.
     */
    has(key: K): boolean {
      return this.map.has(key);
    }
  
    /**
     * Deletes a key-value pair from the hashmap.
     * @param key The key to remove.
     */
    delete(key: K): void {
      this.map.delete(key);
    }
  
    /**
     * Returns the total number of key-value pairs in the hashmap.
     * @returns The size of the hashmap.
     */
    size(): number {
      return this.map.size;
    }
  
    /**
     * Removes all key-value pairs from the hashmap.
     */
    clear(): void {
      this.map.clear();
    }
  }
  
  // Example usage:
  const myHashMap = new HashMapService<string, number>();
  myHashMap.set("apple", 5);
  myHashMap.set("banana", 10);
  
  console.log(myHashMap.get("apple")); // Output: 5
  console.log(myHashMap.has("banana")); // Output: true
  myHashMap.delete("apple");
  console.log(myHashMap.size()); // Output: 1
  myHashMap.clear();
  console.log(myHashMap.size()); // Output: 0
  