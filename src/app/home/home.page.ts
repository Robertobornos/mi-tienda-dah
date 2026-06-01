import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonIcon, IonAvatar, IonButtons, IonSearchbar,
  ToastController, AlertController, LoadingController,
} from '@ionic/angular/standalone';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { Product } from '../models/product';
import { ProductItemComponent } from '../components/product-item/product-item.component';
import { ProductosService, ProductQueryParams } from '../services/productos.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonButton, IonIcon, IonAvatar, IonButtons, IonSearchbar,
    ProductItemComponent,
  ],
})
export class HomePage {

  products: Product[] = [];
  allProducts: Product[] = [];
  userName: string = '';

  nuevoNombre: string = '';
  nuevoPrecio: number | null = null;
  nuevoDescripcion: string = '';
  nuevoCategoria: string = '';
  categorias: string[] = ['Ropa', 'Calzado', 'Accesorios', 'Deportes'];

  searchText: string = '';

  sortOptions = [
    { label: 'Sin ordenar', value: '' },
    { label: 'Precio ↑', value: 'price_asc' },
    { label: 'Precio ↓', value: 'price_desc' },
    { label: 'Nombre A-Z', value: 'name_asc' },
    { label: 'Nombre Z-A', value: 'name_desc' },
  ];
  selectedSort: string = '';

  constructor(
    private productosService: ProductosService,
    private settingsService: SettingsService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) {}

  async ionViewWillEnter(): Promise<void> {
    this.userName = await this.settingsService.getNombre();
    await this.cargarProductos();
  }

  async cargarProductos(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando productos...',
      spinner: 'crescent',
    });
    await loading.present();

    const params: ProductQueryParams = {};

    if (this.selectedSort) {
      const parts = this.selectedSort.split('_');
      params._sort = parts[0];
      params._order = parts[1] as 'asc' | 'desc';
    }

    this.productosService.getAll(params).subscribe({
      next: (data) => {
        this.allProducts = data;
        this.filtrarProductos();
        loading.dismiss();
      },
      error: async () => {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: '❌ Error al conectar con el servidor. ¿Está JSON Server corriendo?',
          duration: 3000, color: 'danger', position: 'bottom',
        });
        await toast.present();
      },
    });
  }

  filtrarProductos(): void {
    if (!this.searchText.trim()) {
      this.products = this.allProducts;
    } else {
      const texto = this.searchText.toLowerCase();
      this.products = this.allProducts.filter(p =>
        p.name.toLowerCase().includes(texto) ||
        p.description.toLowerCase().includes(texto)
      );
    }
  }

  onSearch(event: any): void {
    this.searchText = event.detail.value ?? '';
    if (this.allProducts.length > 0) {
      this.filtrarProductos();
    } else {
      this.cargarProductos();
    }
  }

  onSortChange(): void {
    this.cargarProductos();
  }

  verDetalle(id: number): void {
    this.router.navigate(['/detalle', id]);
  }

  irAjustes(): void {
    this.router.navigate(['/ajustes']);
  }

  async confirmarGuardado(): Promise<void> {
    if (!this.nuevoNombre || !this.nuevoPrecio || !this.nuevoCategoria) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, rellena todos los campos.',
        duration: 2000, color: 'danger', position: 'bottom',
      });
      await toast.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Añadir "${this.nuevoNombre}" por ${this.nuevoPrecio}€?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: () => this.guardarProducto() },
      ],
    });
    await alert.present();
  }

  async guardarProducto(): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    const nuevoProducto = {
      name: this.nuevoNombre,
      price: this.nuevoPrecio!,
      description: this.nuevoDescripcion || `Categoría: ${this.nuevoCategoria}`,
      category: this.nuevoCategoria,
    };

    this.productosService.create(nuevoProducto).subscribe({
      next: async () => {
        loading.dismiss();
        // Haptics: vibración al añadir producto
        await Haptics.impact({ style: ImpactStyle.Heavy });
        const toast = await this.toastCtrl.create({
          message: `✅ "${this.nuevoNombre}" añadido correctamente.`,
          duration: 2500, color: 'success', position: 'bottom',
        });
        await toast.present();
        this.nuevoNombre = '';
        this.nuevoPrecio = null;
        this.nuevoDescripcion = '';
        this.nuevoCategoria = '';
        await this.cargarProductos();
      },
      error: async () => {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: '❌ Error al guardar el producto.',
          duration: 2500, color: 'danger', position: 'bottom',
        });
        await toast.present();
      },
    });
  }
}