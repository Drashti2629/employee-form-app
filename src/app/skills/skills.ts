import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.css']
})
export class SkillsFormComponent {
  form: FormGroup;
  allSkills = ['Angular', 'React', 'Node.js', 'Python', 'Java'];
  filtered: any[][] = [[]];
  @Output() skillsChange = new EventEmitter<any[]>();


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      skills: this.fb.array([this.createSkillGroup()])
    });
    this.updateFiltered();
  }
  @Input() set initialSkills(skills: any[]) {
    if (skills && skills.length) {
      const fa = this.form.get('skills') as FormArray;
      fa.clear();
      skills.forEach(skill => {
        fa.push(this.createSkillGroupWithValue(skill));
      });
      this.updateFiltered();
    }
  }
  createSkillGroupWithValue(skill?: any): FormGroup {
    return this.fb.group({
      skill: [skill?.skill || '', Validators.required],
      additionalNotes: [skill?.additionalNotes || '']
    });
  }

  get skillsArray(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  createSkillGroup(): FormGroup {
    return this.fb.group({
      skill: ['', Validators.required],
      additionalNotes: ['']
    });
  }

  filterSkills(index: number) {
    const value = this.skillsArray.at(index).get('skill')?.value?.toLowerCase() || '';
    this.filtered[index] = this.allSkills.filter(s => s.toLowerCase().includes(value));
    this.emitSkills(); // <-- emit after filtering
  }

  pickSuggestion(i: number, skill: string) {
    this.skillsArray.at(i).get('skill')?.setValue(skill);
    this.filtered[i] = [];
    this.emitSkills(); // <-- emit after picking suggestion
  }

  addRow() {
    // only add a new row if the last row is not empty
    const last = this.skillsArray.at(this.skillsArray.length - 1);
    if (!last || last.get('skill')?.value) {
      this.skillsArray.push(this.createSkillGroup());
      this.updateFiltered();
      this.emitSkills();
    }
  }


  removeRow(i: number) {
    this.skillsArray.removeAt(i);
    this.updateFiltered();
    this.emitSkills(); // <-- emit after removing
  }



  updateFiltered() {
    this.filtered = this.skillsArray.controls.map(() => []);
  }

  emitSkills() {
    this.skillsChange.emit(this.skillsArray.value);
  }
  submit() {
    debugger
    if (this.form.invalid) {
      console.log('Form invalid!');
      return;
    }
    console.log(this.form.value);
  }
}
