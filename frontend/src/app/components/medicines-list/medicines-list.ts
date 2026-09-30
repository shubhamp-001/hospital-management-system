import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicineService } from '../../services/medicine';
import { Medicine } from '../../models/medicine';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-medicines-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicines-list.html',
  styleUrl: './medicines-list.css'
})
export class MedicinesList implements OnInit {
  medicines = signal<Medicine[]>([]);
  stockFilter = signal<'all' | 'low'>('all');
  searchTerm = signal('');
  errorMessage = signal('');

  showForm = false;
  openMenuId: number | null = null;
  editingId: number | null = null;
  formModel: Partial<Medicine> = { name: '', stockQuantity: 0, price: 0, lowStockThreshold: 10 };

  constructor(
    private medicineService: MedicineService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    const source = this.stockFilter() === 'low'
      ? this.medicineService.getLowStock()
      : this.medicineService.getAll();

    source.subscribe({
      next: (data) => this.medicines.set(data),
      error: () => this.errorMessage.set('Failed to load medicines.')
    });
  }

  setStockFilter(value: 'all' | 'low'): void {
    this.stockFilter.set(value);
    this.loadMedicines();
  }

  get filteredMedicines(): Medicine[] {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.medicines();
    return this.medicines().filter(m => m.name.toLowerCase().includes(term));
  }

  stockStatus(m: Medicine): 'out' | 'low' | 'in' {
    if (m.stockQuantity === 0) return 'out';
    if (m.stockQuantity <= m.lowStockThreshold) return 'low';
    return 'in';
  }

  stockLabel(m: Medicine): string {
    const status = this.stockStatus(m);
    return status === 'out' ? 'Out of Stock' : status === 'low' ? 'Low Stock' : 'In Stock';
  }

  toggleMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  toggleForm(): void {
    if (this.showForm) {
      this.cancelEdit();
    } else {
      this.showForm = true;
    }
  }

  startEdit(medicine: Medicine): void {
    this.editingId = medicine.medicineId;
    this.formModel = { ...medicine };
    this.showForm = true;
    this.openMenuId = null;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.showForm = false;
    this.formModel = { name: '', stockQuantity: 0, price: 0, lowStockThreshold: 10 };
  }

  save(): void {
    this.errorMessage.set('');

    if (this.editingId) {
      this.medicineService.update(this.editingId, this.formModel).subscribe({
        next: () => { this.cancelEdit(); this.loadMedicines(); },
        error: () => this.errorMessage.set('Update failed.')
      });
    } else {
      this.medicineService.create(this.formModel).subscribe({
        next: () => { this.cancelEdit(); this.loadMedicines(); },
        error: () => this.errorMessage.set('Create failed.')
      });
    }
  }

  deleteMedicine(id: number): void {
    this.openMenuId = null;
    if (!confirm('Delete this medicine?')) return;

    this.medicineService.delete(id).subscribe({
      next: () => this.loadMedicines(),
      error: () => this.errorMessage.set('Delete failed (may be referenced by a prescription).')
    });
  }

  canWrite(): boolean {
    return this.authService.hasRole('SuperAdmin', 'Pharmacist');
  }
}