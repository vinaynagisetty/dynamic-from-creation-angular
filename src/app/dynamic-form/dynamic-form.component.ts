import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Dynamic User Details Form</h2>
      
      <div class="field-toggles">
        <h3>Select Fields to Include:</h3>
        <div *ngFor="let field of availableFields" class="checkbox-item">
          <input
            type="checkbox"
            [id]="'toggle-' + field.name"
            [checked]="field.enabled"
            (change)="toggleField(field.name)">
          <label [for]="'toggle-' + field.name">{{ field.label }}</label>
        </div>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
        <ng-container *ngFor="let field of availableFields">
          <div *ngIf="field.enabled" class="form-field">
            <label [for]="field.name">{{ field.label }}</label>
            
            <ng-container [ngSwitch]="field.type">
              <input *ngSwitchCase="'text'"
                [id]="field.name"
                type="text"
                [formControlName]="field.name">
                
              <input *ngSwitchCase="'number'"
                [id]="field.name"
                type="number"
                [formControlName]="field.name">
                
              <input *ngSwitchCase="'email'"
                [id]="field.name"
                type="email"
                [formControlName]="field.name">
                
              <select *ngSwitchCase="'select'"
                [id]="field.name"
                [formControlName]="field.name">
                <option value="">Select {{ field.label }}</option>
                <option *ngFor="let option of field.options" [value]="option">
                  {{ option }}
                </option>
              </select>
              
              <textarea *ngSwitchCase="'textarea'"
                [id]="field.name"
                [formControlName]="field.name"
                rows="3">
              </textarea>
            </ng-container>

            <div class="error-message" *ngIf="userForm.get(field.name)?.errors?.['required'] && 
                userForm.get(field.name)?.touched">
              {{ field.label }} is required
            </div>
            <div class="error-message" *ngIf="userForm.get(field.name)?.errors?.['email'] && 
                userForm.get(field.name)?.touched">
              Please enter a valid email
            </div>
          </div>
        </ng-container>

        <button type="submit" [disabled]="!userForm.valid">Submit</button>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .field-toggles {
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: #fff;
      border-radius: 4px;
    }

    .checkbox-item {
      margin: 0.5rem 0;
    }

    .form-field {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    textarea {
      resize: vertical;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      background-color: #007bff;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }
  `]
})
export class DynamicFormComponent implements OnInit {
  userForm: FormGroup;
  availableFields: any[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', enabled: true },
    { name: 'age', label: 'Age', type: 'number', enabled: true },
    { name: 'gender', label: 'Gender', type: 'select', enabled: true, 
      options: ['Male', 'Female', 'Other'] },
    { name: 'email', label: 'Email', type: 'email', enabled: true },
    { name: 'address', label: 'Address', type: 'textarea', enabled: true }
  ];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({});
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    const group: any = {};
    
    this.availableFields.forEach(field => {
      if (field.enabled) {
        const validators = [Validators.required];
        if (field.type === 'email') {
          validators.push(Validators.email);
        }
        group[field.name] = ['', validators];
      }
    });

    this.userForm = this.fb.group(group);
  }

  toggleField(fieldName: string) {
    const field = this.availableFields.find(f => f.name === fieldName);
    if (field) {
      field.enabled = !field.enabled;
      this.initializeForm();
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
    } else {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}