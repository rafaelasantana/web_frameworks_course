import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import login component
import { LoginComponent } from './login/login.component';
// import signup component
import { SignupComponent } from './signup/signup.component';


const routes: Routes = [
  // the component that has the empty path is the first one to load
  // for other paths, eg 'login', access by localhost/login
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // can also redirect to /signup when page loads
  { path: '', redirectTo: '/signup', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
