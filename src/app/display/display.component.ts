import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as Babylon from 'babylonjs'
import { MeshModel } from '../Model';
import { MeshUIEvents } from '../UIEvents';
import { MeshLighting } from '../lighting';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, AfterViewInit {

  private engine: Babylon.Engine;
  private scene: Babylon.Scene;

  private camera: Babylon.ArcRotateCamera;

  private modelUtils: MeshModel;
  private lightingUtils: MeshLighting;
  private UIEventsUtils: MeshUIEvents;

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
    this.scene.clearColor = new Babylon.Color4(0.964, 0.964, 0.964, 1);


    this.camera = new Babylon.ArcRotateCamera('camera', 0,0,10, new Babylon.Vector3(0, 0, 0), this.scene);
    this.camera.setPosition(new Babylon.Vector3(0,0,20));

    this.camera.attachControl(this.canvasElement.nativeElement, true);

    
    this.modelUtils = new MeshModel(this.scene);
    this.lightingUtils = new MeshLighting(this.scene);
    this.UIEventsUtils = new MeshUIEvents(this.scene);

    this.lightingUtils.CreatHemisphericLight();
    //this.lightingUtils.CreatePointLight();
    //this.lightingUtils.TurnOffLighting();

    let box: Babylon.Mesh = Babylon.MeshBuilder.CreateBox('box', {height:5, width: 5, depth: 5},
     this.scene);

    box.enableEdgesRendering();
    box.edgesWidth = 5.0;
    box.edgesColor = new Babylon.Color4(0.0039,0.039,0.2627,1);

    box.position.y = 1;
    
  }

}
