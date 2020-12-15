import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//MODULOS
import { MaterialModule } from './modulos/material.module';
//FORMULARIOS
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MapComponent } from './components/delivery/map/map.component';
//MODULO GOOGLE MAPS
import { GoogleMapsModule } from '@angular/google-maps';
//MODULO DE EXPORTACIÓN EXCEL
import { MatTableExporterModule } from 'mat-table-exporter';
// COMPONENTES PROPIOS 
import { CartComponent } from './components/user/cart/cart.component';
import { CmainComponent } from './components/chef/cmain/cmain.component';
import { ProfileDataComponent } from './components/user/profile-data/profile-data.component';
import { AddressBookComponent } from './components/user/address-book/address-book.component';
import { ManagerscreenComponent } from './components/manager/managerscreen/managerscreen.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { MenuComponent } from './components/products/menu/menu.component';
import { MainScreenComponent } from './components/cashier/main-screen/main-screen.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { OrdersComponent } from './components/user/orders/orders.component';
import { DmainComponent } from './components/delivery/dmain/dmain.component';
import { UsersComponent } from './components/modales/users/users.component';
import { ArticuloScreenComponent } from './components/manager/articulo-screen/articulo-screen.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoriaArticuloScreenComponent } from './components/manager/categoria-articulo-screen/categoria-articulo-screen.component';
import { MedidaArticuloScreenComponent } from './components/manager/medida-articulo-screen/medida-articulo-screen.component';
import { ModalArticuloComponent } from './components/modales/modal-articulo/modal-articulo.component';
import { ModalCategoriaArticuloComponent } from './components/modales/modal-categoria-articulo/modal-categoria-articulo.component';
import { ModalMedidaArticuloComponent } from './components/modales/modal-medida-articulo/modal-medida-articulo.component';
import { ModalCategoriaPlatoComponent } from './components/modales/modal-categoria-plato/modal-categoria-plato.component';
import { CategoriaPlatoScreenComponent } from './components/manager/categoria-plato-screen/categoria-plato-screen.component';
import { PlatoScreenComponent } from './components/manager/plato-screen/plato-screen.component';
import { ModalCabeceraPlatoComponent } from './components/modales/modal-cabecera-plato/modal-cabecera-plato.component';
import { EstadisticaIngresosScreenComponent } from './components/manager/estadistica-ingresos-screen/estadistica-ingresos-screen.component';
import { EstadisticaPlatosScreenComponent } from './components/manager/estadistica-platos-screen/estadistica-platos-screen.component';
import { EstadisticaClientesScreenComponent } from './components/manager/estadistica-clientes-screen/estadistica-clientes-screen.component';
import { UserManagementComponent } from './components/manager/user-management/user-management.component';
// IMPORTACIONES DE ANGULAR FIREBASE
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { environment } from '../environments/environment';
import { PaymentScreenComponent } from './components/cashier/payment-screen/payment-screen.component';
import { OrderDetailsComponent } from './components/user/order-details/order-details.component';
import { StockBajoComponent } from './components/manager/stock-bajo/stock-bajo.component';
import { FacturacionComponent } from './components/manager/facturacion/facturacion.component';
import { OrderDetailsCashierComponent } from './components/cashier/order-details-cashier/order-details-cashier.component';
import { ModalProductoReventaComponent } from './components/modales/modal-producto-reventa/modal-producto-reventa.component';
import { WorkWithUsComponent } from './components/information/work-with-us/work-with-us.component';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    FooterComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    MenuComponent,
    MainScreenComponent,
    ProfileComponent,
    OrdersComponent,
    DmainComponent,
    MapComponent,
    CartComponent,
    CmainComponent,
    ProfileDataComponent,
    AddressBookComponent,
    ManagerscreenComponent,
    UsersComponent,
    ArticuloScreenComponent,
    ModalArticuloComponent,
    ModalCategoriaArticuloComponent,
    ModalMedidaArticuloComponent,
    CategoriaArticuloScreenComponent,
    MedidaArticuloScreenComponent,
    ModalCategoriaPlatoComponent,
    CategoriaPlatoScreenComponent,
    PlatoScreenComponent,
    ModalCabeceraPlatoComponent,
    EstadisticaIngresosScreenComponent,
    EstadisticaPlatosScreenComponent,
    EstadisticaClientesScreenComponent,
    UserManagementComponent,
    PaymentScreenComponent,
    OrderDetailsComponent,
    StockBajoComponent,
    FacturacionComponent,
    OrderDetailsCashierComponent,
    ModalProductoReventaComponent,
    WorkWithUsComponent
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    MatTableExporterModule
  ],
  entryComponents: [],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
