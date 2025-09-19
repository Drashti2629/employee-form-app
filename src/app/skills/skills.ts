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
  allSkills = [
    { id: 1, name: 'Angular' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Node.js' },
    { id: 4, name: 'Python' },
    { id: 5, name: 'Java' }
  ];


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
      id: [skill?.id || ''],
      skill: [skill?.skill || '', Validators.required],
      additionalNotes: [skill?.additionalNotes || '']
    });
  }


  get skillsArray(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  createSkillGroup(): FormGroup {
    return this.fb.group({
      id: [''],
      skill: ['', Validators.required],
      additionalNotes: ['']
    });
  }


  filterSkills(index: number) {
    const value = this.skillsArray.at(index).get('skill')?.value?.toLowerCase() || '';
    this.filtered[index] = this.allSkills.filter(s => s.name.toLowerCase().includes(value));
  }


  pickSuggestion(i: number, skillObj: { id: number, name: string }) {
    this.skillsArray.at(i).patchValue({
      skill: skillObj.name,
      id: skillObj.id
    });
    this.filtered[i] = [];
    this.emitSkills();
  }




  addRow() {

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
    this.emitSkills();
  }



  updateFiltered() {
    this.filtered = this.skillsArray.controls.map(() => []);
  }

  emitSkills() {
    this.skillsChange.emit(this.skillsArray.value);
  }

}
