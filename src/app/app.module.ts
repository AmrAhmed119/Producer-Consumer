import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolBarComponent } from './Components/tool-bar/tool-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { KonvaModule } from 'ng2-konva';
import {StompService} from "./stomp.service";

@NgModule({
  declarations: [
    AppComponent,
    ToolBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    KonvaModule
  ],
  providers: [StompService],
  bootstrap: [AppComponent]
})
export class AppModule { }
