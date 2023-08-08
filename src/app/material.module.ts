import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatGridListModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ],
  exports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatGridListModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ],
})
export class MaterialModule {}
