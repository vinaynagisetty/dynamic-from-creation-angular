import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DynamicFormComponent } from './app/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicFormComponent],
  template: `
    <div class="container">
      <app-dynamic-form></app-dynamic-form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
  `]
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);