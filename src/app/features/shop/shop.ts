import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { CartService } from '../../core/services/Cart.Service';
import { Product, Category, Size, Color, AgeGroup } from '../../core/models/shop.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './shop.html'
})
export class ShopComponent implements OnInit {
  private api = inject(ShopService);
  private cart = inject(CartService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  products: Product[] = [];
  categories: Category[] = [];
  sizes: Size[] = [];
  colors: Color[] = [];
  ages: AgeGroup[] = [];
  error = '';
  private apiRoot = environment.apiUrl.replace(/\/api\/?$/, '');

  filter = this.fb.nonNullable.group({
    search: '',
    categoryId: '',
    ageGroupId: '',
    sizeId: '',
    colorId: ''
  });

  ngOnInit(): void {
    this.loadCatalog();
    this.load();
  }

  private loadCatalog(): void {

    this.api.categories().subscribe({
      next: x => this.categories = x,
      error: e => {
        this.error = this.getError(
          e,
          'Categories load failed.'
        );
      }
    });

    this.api.sizes().subscribe({
      next: x => this.sizes = x,
      error: e => {
        this.error = this.getError(
          e,
          'Sizes load failed.'
        );
      }
    });

    this.api.colors().subscribe({
      next: x => this.colors = x,
      error: e => {
        this.error = this.getError(
          e,
          'Colors load failed.'
        );
      }
    });

    this.api.ageGroups().subscribe({
      next: x => this.ages = x,
      error: e => {
        this.error = this.getError(
          e,
          'Age groups load failed.'
        );
      }
    });
  }

  load(): void {

    this.error = '';

    this.api.products(
      this.filter.getRawValue()
    ).subscribe({

      next: x => {
        this.products = x ?? [];
      },

      error: e => {
        this.error = this.getError(
          e,
          'Products load failed.'
        );
      }

    });
  }

  /**
   * Returns the first active variant
   * which actually has stock.
   */
  getAvailableVariant(product: Product): any | null {

    if (!product.variants?.length) {
      return null;
    }

    return product.variants.find(
      variant =>
        variant.isActive &&
        variant.stockQuantity > 0
    ) ?? null;
  }

  hasStock(product: Product): boolean {

    return this.getAvailableVariant(product) !== null;
  }

  add(product: Product): void {

    this.error = '';

    const variant =
      this.getAvailableVariant(product);

    if (!variant) {

      this.error =
        'This product is currently out of stock.';

      return;
    }

    this.cart.addToCart({

      productVariantId:
        variant.id,

      quantity: 1

    }).subscribe({

      next: () => {

        this.router.navigate([
          '/app/cart'
        ]);

      },

      error: e => {

        this.error =
          this.getError(
            e,
            'Could not add product to cart.'
          );

      }

    });
  }

  view(id: string): void {

    this.router.navigate([
      '/app/shop',
      id
    ]);

  }

  /**
   * Handles:
   * - data:image/...;base64,... (uploaded straight from the Admin Console)
   * - https://localhost:5220/uploads/...
   * - /uploads/...
   */
  imageUrl(url: string): string {

    if (!url) {
      return '';
    }

    if (url.startsWith('data:')) {
      return url;
    }

    if (
      url.startsWith('http://') ||
      url.startsWith('https://')
    ) {
      return url;
    }

    if (url.startsWith('/')) {
      return `${this.apiRoot}${url}`;
    }

    return `${this.apiRoot}/${url}`;
  }

  private getError(
    e: any,
    fallback: string
  ): string {

    return (
      e?.error?.message ||
      e?.error?.Message ||
      e?.error?.title ||
      fallback
    );
  }
}