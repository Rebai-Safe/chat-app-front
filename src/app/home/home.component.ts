import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  username = "";

  constructor(private router: Router) {

  }

  connect() {
    console.log("Connecting ...");
    this.router.navigate(['chat', this.username]).then(() => console.log("taken"))

  }
}
