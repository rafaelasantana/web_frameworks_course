import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import login component
import { LoginComponent } from './login/login.component';
// import signup component
import { SignupComponent } from './signup/signup.component';
// import landing page component
import { LandingPageComponent } from './landing-page/landing-page.component';


const routes: Routes = [
  // redirect to /login when page loads
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // for other paths, eg 'login', access by localhost/login
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'landing', component: LandingPageComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
