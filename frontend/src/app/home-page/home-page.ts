import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { FilieresGrid } from '../filieres-grid/filieres-grid';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home-page',
  imports: [Footer, CommonModule, Navbar, FilieresGrid],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

}
