import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonGrid, IonRow, IonCol, IonBadge, IonButton, IonIcon, IonItem, IonLabel,
  IonInput,
  AlertController, ToastController, LoadingController,
} from '@ionic/angular/standalone';

import { Product } from '../models/product';
import { ProductosService } from '../services/productos.service';

@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.page.html',
  styleUrls: ['detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonBadge, IonButton, IonIcon, IonItem, IonLabel,
    IonInput,
  ],
})
export class DetallePage implements OnInit {

  product: Product | undefined;
  modoEdicion: boolean = false;

  // Copia para editar sin modificar el original
  editNombre: string = '';
  editPrecio: number = 0;
  editDescripcion: string = '';
  editCategoria: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    await this.cargarProducto(id);
  }

  // GET por ID desde el servidor
  async cargarProducto(id: number): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();

    this.productosService.getById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.iniciarEdicion();
        loading.dismiss();
      },
      error: async () => {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: '❌ No se pudo cargar el producto.',
          duration: 2500, color: 'danger', position: 'bottom',
        });
        await toast.present();
      },
    });
  }

  iniciarEdicion(): void {
    if (!this.product) return;
    this.editNombre = this.product.name;
    this.editPrecio = this.product.price;
    this.editDescripcion = this.product.description;
    this.editCategoria = this.product.category ?? '';
  }

  activarEdicion(): void {
    this.modoEdicion = true;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.iniciarEdicion(); // restaurar valores originales
  }

  // PUT: guardar edición en el servidor
  async guardarEdicion(): Promise<void> {
    if (!this.product) return;

    const loading = await this.loadingCtrl.create({ message: 'Guardando cambios...' });
    await loading.present();

    const productoActualizado: Product = {
      ...this.product,
      name: this.editNombre,
      price: this.editPrecio,
      description: this.editDescripcion,
      category: this.editCategoria,
    };

    this.productosService.update(this.product.id, productoActualizado).subscribe({
      next: async (data) => {
        this.product = data;
        this.modoEdicion = false;
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: '✅ Producto actualizado correctamente.',
          duration: 2500, color: 'success', position: 'bottom',
        });
        await toast.present();
      },
      error: async () => {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: '❌ Error al actualizar el producto.',
          duration: 2500, color: 'danger', position: 'bottom',
        });
        await toast.present();
      },
    });
  }

  // DELETE con confirmación
  async confirmarEliminar(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar producto',
      message: `¿Estás seguro de que quieres eliminar "${this.product?.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.eliminar() },
      ],
    });
    await alert.present();
  }

  async eliminar(): Promise<void> {
    if (!this.product) return;

    const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
    await loading.present();

    this.productosService.delete(this.product.id).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: `🗑️ "${this.product?.name}" eliminado correctamente.`,
          duration: 2500, color: 'warning', position: 'bottom',
        });
        await toast.present();
        this.router.navigate(['/home']);
      },
      error: async () => {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: '❌ Error al eliminar el producto.',
          duration: 2500, color: 'danger', position: 'bottom',
        });
        await toast.present();
      },
    });
  }

  volver(): void {
    this.router.navigate(['/home']);
  }
}