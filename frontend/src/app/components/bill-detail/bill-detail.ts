import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from '../../services/bill';
import { Bill } from '../../models/bill';

@Component({
  selector: 'app-bill-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bill-detail.html',
  styleUrl: './bill-detail.css',
})
export class BillDetail implements OnInit {
  bill = signal<Bill | null>(null);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage.set('Invalid bill.');
      return;
    }

    this.billService.getById(id).subscribe({
      next: (data) => {
        const response = data as Bill & { Medicines?: Bill['medicines'] };
        this.bill.set({
          ...data,
          medicines: data.medicines ?? response.Medicines ?? []
        });
      },
      error: () => this.errorMessage.set('Failed to load bill.')
    });
  }

  goBack(): void {
    this.router.navigate(['/bills']);
  }

  print(): void {
    window.print();
  }
}