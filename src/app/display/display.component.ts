import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as Babylon from 'babylonjs'

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, AfterViewInit {

  private engine: Babylon.Engine;
  private scene: Babylon.Scene;
  private light: Babylon.HemisphericLight;
  private camera: Babylon.FreeCamera;

  @ViewChild('Mycanvas', {static: true}) canvasElement: ElementRef;

  constructor() { }

  ngOnInit() {
  
  }

  ngAfterViewInit(){
    this.InitializeData();
    this.CreateScene();
    this.engine.runRenderLoop(()=>{
      this.scene.render();
    })
  }

  private InitializeData(): void{
    let canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
    this.engine = new Babylon.Engine(canvas, true);
  }

  private CreateScene(): void{
    this.scene = new Babylon.Scene(this.engine);

    this.camera = new Babylon.FreeCamera('camera', new Babylon.Vector3(0, 5, -10), this.scene);

    this.camera.setTarget(Babylon.Vector3.Zero());

    this.light = new Babylon.HemisphericLight('light1', new Babylon.Vector3(0, 1, 0), this.scene);

    let sphere: Babylon.Mesh = Babylon.MeshBuilder.CreateSphere('sphere', {segments: 16, diameter: 2}, this.scene);

    sphere.position.y = 1;

    let ground = Babylon.MeshBuilder.CreateGround('ground1', {height: 6, width: 6, subdivisions: 2}, this.scene);
    
  }

}
