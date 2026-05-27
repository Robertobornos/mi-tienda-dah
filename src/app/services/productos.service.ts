import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {

  private products: Product[] = [
    { id: 1, name: 'Camiseta', price: 19.99, description: 'Camiseta de algodón premium, disponible en varios colores.' },
    { id: 2, name: 'Pantalón', price: 29.99, description: 'Pantalón vaquero de corte slim, tejido resistente.' },
    { id: 3, name: 'Zapatillas', price: 49.99, description: 'Zapatillas deportivas con suela amortiguada y transpirable.' },
    { id: 4, name: 'Gorra', price: 14.99, description: 'Gorra ajustable con visera curva, bordado frontal.' },
    { id: 5, name: 'Mochila', price: 39.99, description: 'Mochila urbana con compartimento para portátil de 15 pulgadas.' },
    { id: 6, name: 'Chaqueta', price: 59.99, description: 'Chaqueta cortavientos impermeable, forro interior polar.' },
  ];

  // Devuelve todos los productos
  getAll(): Product[] {
    return this.products;
  }

  // Devuelve un producto por ID
  getById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  // Añade un nuevo producto
  add(product: Omit<Product, 'id'>): void {
    const newId = Math.max(...this.products.map(p => p.id)) + 1;
    this.products.push({ id: newId, ...product });
  }

  // Elimina un producto por ID (Mejora 2)
  delete(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
}