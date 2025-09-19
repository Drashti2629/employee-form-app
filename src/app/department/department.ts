import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department.html'
})
export class DepartmentComponent {
  @Output() selectionChange = new EventEmitter<{ department: string; subDepartment: string }>();

  departments: Record<string, string[]> = {
    IT: ['Backend Engineer', 'Frontend Engineer', 'QA Engineer', 'DevOps'],
    HR: ['Recruiter', 'HR Executive', 'HR Manager'],
    Finance: ['Accountant', 'Financial Analyst', 'Payroll Specialist'],
    Operations: ['Operations Associate', 'Logistics Coordinator']
  };

  selectedDept = '';
  selectedSub = '';

  get departmentList(): string[] {
    return Object.keys(this.departments);
  }

  get subDepartmentList(): string[] {
    return this.departments[this.selectedDept] ?? [];
  }

  onDeptChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedDept = select.value;
    this.selectedSub = '';
    this.emit();
  }

  onSubDeptChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedSub = select.value;
    this.emit();
  }

  reset() {
    this.selectedDept = '';
    this.selectedSub = '';
    this.emit();
  }

  private emit() {
    this.selectionChange.emit({
      department: this.selectedDept,
      subDepartment: this.selectedSub
    });
  }
}
