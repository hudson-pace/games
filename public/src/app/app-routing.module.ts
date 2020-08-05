import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './helpers/auth-guard';
import { MoveAroundComponent } from './games/move-around/move-around.component';
import { BattleshipComponent } from './games/battleship/battleship.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'games/move-around', component: MoveAroundComponent},
  { path: 'games/battleship', component: BattleshipComponent},
  { path: '**', redirectTo: '' } // default to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
