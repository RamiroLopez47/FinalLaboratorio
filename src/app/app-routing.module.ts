import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { MenuComponent } from './components/products/menu/menu.component';
import { MainScreenComponent } from './components/cashier/main-screen/main-screen.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { DmainComponent } from './components/delivery/dmain/dmain.component';
import { CartComponent } from './components/user/cart/cart.component';
import { CmainComponent } from './components/chef/cmain/cmain.component';
import { ManagerscreenComponent } from './components/manager/managerscreen/managerscreen.component';
import { IsAuthGuard } from './guards/is-auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { IsCashierGuard } from './guards/is-cashier.guard';
import { IsDeliveryGuard } from './guards/is-delivery.guard';
import { IsChefGuard } from './guards/is-chef.guard';
import { IsManagerGuard } from './guards/is-manager.guard';
import { IsCLientGuard } from './guards/is-client.guard';
import { WorkWithUsComponent } from './components/information/work-with-us/work-with-us.component';
import { CatalogoGuard } from './guards/catalogo.guard';


const routes: Routes = [
  { path: "home", component: LandingComponent },
  { path: "user/login", component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: "user/register", component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: "user/profile", component: ProfileComponent, canActivate: [IsAuthGuard, IsCLientGuard] },
  { path: "user/cart", component: CartComponent, canActivate: [IsAuthGuard, IsCLientGuard] },
  { path: "manager", component: ManagerscreenComponent, canActivate: [IsAuthGuard, IsManagerGuard] },
  { path: "delivery", component: DmainComponent, canActivate: [IsAuthGuard, IsDeliveryGuard] },
  { path: "menu", component: MenuComponent,canActivate: [CatalogoGuard] },
  { path: "cashier", component: MainScreenComponent, canActivate: [IsAuthGuard, IsCashierGuard] },
  { path: "chef", component: CmainComponent, canActivate: [IsAuthGuard, IsChefGuard] },
  { path: "information/workwithus", component: WorkWithUsComponent},
  { path: "**", pathMatch: "full", redirectTo: "home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
