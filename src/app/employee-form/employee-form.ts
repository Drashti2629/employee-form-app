import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { TitleCaseWordsPipe } from '../../pipes/title-case-words.pipe';
import { DepartmentComponent } from "../department/department";

import { CommonModule } from '@angular/common';
import { SkillsFormComponent } from '../skills/skills';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.css'],
  imports: [CommonModule,
    ReactiveFormsModule,
    DepartmentComponent,
    SkillsFormComponent]
})
export class EmployeeFormComponent {
  form: FormGroup;
  @Output() skillsChange = new EventEmitter<any[]>();
  submittedData: any = null;



  constructor(private fb: FormBuilder, private titleCase: TitleCaseWordsPipe) {

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      birthDate: [null],
      joiningDate: [null, Validators.required],
      department: ['', Validators.required],
      subDepartment: ['', Validators.required],
      employeeCode: [{ value: '', disabled: true }],
      skills: this.fb.array([])
    });
    this.form.valueChanges.subscribe(() => this.generateEmployeeCode());
  }

  get f() {
    return this.form.controls;
  }

  private generateEmployeeCode() {
    const first = this.form.get('firstName')?.value;
    const last = this.form.get('lastName')?.value;
    if (first && last && this.f['firstName'].valid && this.f['lastName'].valid) {
      const fPart = this.titleCase.transform(first).slice(0, 3).toUpperCase();
      const lPart = this.titleCase.transform(last).slice(-3).toUpperCase();
      const random = Math.floor(10000 + Math.random() * 90000);
      this.form.get('employeeCode')?.setValue(`${fPart}_${lPart}_${random}`, {
        emitEvent: false
      });
    }
  }


  private joinAfterBirthValidator(group: FormGroup) {
    const birth = group.get('birthDate')?.value;
    const join = group.get('joiningDate')?.value;
    if (birth && join && new Date(join) <= new Date(birth)) {
      return { joinAfterBirth: true };
    }
    return null;
  }

  private ageAtLeast23Validator(group: FormGroup) {
    const birth = group.get('birthDate')?.value;
    const join = group.get('joiningDate')?.value;
    if (birth && join) {
      const birthDate = new Date(birth);
      const joinDate = new Date(join);

      let age = joinDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = joinDate.getMonth() - birthDate.getMonth();
      const dayDiff = joinDate.getDate() - birthDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (age < 23) return { ageAtLeast23: true };
    }
    return null;
  }




  formSubmitted = false;
  invalidFields: string[] = [];

  submit() {
    this.formSubmitted = true;
    this.invalidFields = [];

    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control && control.invalid) {
          this.invalidFields.push(this.getFieldLabel(key));
          control.markAsTouched();
        }
      });
      return;
    }

    this.submittedData = this.form.getRawValue();
    console.log('Form submitted:', this.submittedData);
  }


  getFieldLabel(field: string): string {
    const map: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      birthDate: 'Birth Date',
      joiningDate: 'Joining Date',
      department: 'Department',
      subDepartment: 'Sub Department',
      employeeCode: 'Employee Code'
    };
    return map[field] || field;
  }
  reset() {
    this.form.reset();
  }



  private scrollToFirstInvalid() {
    const firstInvalid = document.querySelector('.ng-invalid') as HTMLElement;
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth' });
      firstInvalid.focus();
    }
  }
  get skillsArray(): FormArray {
    return this.form.get('skills') as FormArray;
  }



  onDeptSelection(ev: { department: string; subDepartment: string }) {
    this.form.patchValue(ev);
  }
  onSkillsChange(skills: any[]) {
    const skillsArray = this.skillsArray;
    skillsArray.clear();

    skills
      .filter(s => s.skill && s.skill.trim() !== '')
      .forEach(skill => {
        skillsArray.push(this.fb.group({
          id: [skill.id || null],
          skill: [skill.skill, Validators.required],
          additionalNotes: [skill.additionalNotes]
        }));
      });
  }

}
