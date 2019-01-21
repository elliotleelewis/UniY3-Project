import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EditorComponent } from './pages/editor/editor.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ViewComponent } from './pages/view/view.component';

@NgModule({
	declarations: [
		AppComponent,
		// Components
		LayoutComponent,
		// Pages
		EditorComponent,
		HomeComponent,
		LoginComponent,
		RegisterComponent,
		ViewComponent,
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
		FormsModule,
		RouterModule.forRoot([
			{ path: '', pathMatch: 'full', component: HomeComponent },
			{ path: 'login', component: LoginComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'view/:id', component: ViewComponent },
			{ path: 'editor', component: EditorComponent },
			{ path: 'editor/:id', component: EditorComponent },
		]),
		NgbModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
