import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth-guard/auth.guard';
import { RegistrationComponent } from './registration/registration.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TestComponent } from './test/test.component';
import { PointsComponent } from './points/points.component';
import { PickTeamComponent } from './pick-team/pick-team.component';

const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'test', component: TestComponent },
  { path: 'points', component: PointsComponent },
  { path: 'pick-team', component: PickTeamComponent },

  { path: '', redirectTo: '/pick-team', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
