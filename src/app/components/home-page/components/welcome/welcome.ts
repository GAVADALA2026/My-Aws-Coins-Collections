import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ResumeCoinsCollection } from './component/resume-coins-collections/resume-coins-collection';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule, ResumeCoinsCollection],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {}
