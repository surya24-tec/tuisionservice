import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Material {
  id?: number;
  title: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  uploadedAt?: string;
}

@Component({
  selector: 'app-teacher-materials',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './teacher-materials.component.html',
  styleUrl: './teacher-materials.component.css'
})
export class TeacherMaterialsComponent implements OnInit {
  materials: Material[] = [];
  isLoading = false;
  isUploading = false;
  showForm = false;

  newMaterial: Partial<Material> = { title: '', description: '' };
  selectedFile: File | null = null;
  isDragOver = false;

  constructor(
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.isLoading = true;
    const raw = localStorage.getItem('teacher_materials');
    this.materials = raw ? JSON.parse(raw) : [];
    this.isLoading = false;
  }

  onDragOver(e: DragEvent): void { e.preventDefault(); this.isDragOver = true; }
  onDragLeave(): void { this.isDragOver = false; }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) this.selectedFile = file;
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) this.selectedFile = input.files[0];
  }

  openUploadForm(): void {
    this.newMaterial = { title: '', description: '' };
    this.selectedFile = null;
    this.showForm = true;
  }

  closeForm(): void { this.showForm = false; }

  uploadMaterial(): void {
    if (!this.newMaterial.title) {
      this.showSnack('Title is required', 'error');
      return;
    }

    this.isUploading = true;
    const material: Material = {
      id: Date.now(),
      title: this.newMaterial.title!,
      description: this.newMaterial.description || '',
      fileName: this.selectedFile?.name || 'Reference Material',
      fileType: this.selectedFile?.type || 'application/octet-stream',
      fileUrl: this.selectedFile ? URL.createObjectURL(this.selectedFile) : undefined,
      uploadedAt: new Date().toISOString()
    };

    this.materials = [material, ...this.materials];
    localStorage.setItem('teacher_materials', JSON.stringify(this.materials));
    this.isUploading = false;
    this.showSnack('Material uploaded successfully!', 'success');
    this.closeForm();
    this.loadMaterials();
  }

  deleteMaterial(material: Material): void {
    if (!confirm(`Delete "${material.title}"?`)) return;
    this.materials = this.materials.filter(item => item.id !== material.id);
    localStorage.setItem('teacher_materials', JSON.stringify(this.materials));
    this.showSnack('Deleted!', 'success');
    this.loadMaterials();
  }

  getFileIcon(fileType?: string): string {
    if (!fileType) return 'insert_drive_file';
    if (fileType.includes('pdf')) return 'picture_as_pdf';
    if (fileType.includes('image')) return 'image';
    if (fileType.includes('video')) return 'videocam';
    if (fileType.includes('word') || fileType.includes('document')) return 'description';
    return 'insert_drive_file';
  }

  private showSnack(msg: string, type: 'success' | 'error'): void {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: type === 'success' ? ['snack-success'] : ['snack-error'] });
  }
}
