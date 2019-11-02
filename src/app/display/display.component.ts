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
  private freecamera: Babylon.FreeCamera;
  private followcamera: Babylon.FollowCamera;
  private frontVector = new Babylon.Vector3(0, 0, 1);

  @ViewChild('Mycanvas', { static: true }) canvasElement: ElementRef;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.InitializeData();
    this.CreateScene();

    this.engine.runRenderLoop(() => {
      
      this.DudefollowTank();
      this.scene.render();
      
    })

  }

  private InitializeData(): void {
    let canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
    this.engine = new Babylon.Engine(canvas, true);
  }

  private CreateScene(): void {
    this.scene = new Babylon.Scene(this.engine);
    this.CreateFreeCamera();
    this.CreateMeshes();
    this.CreateLights();
    this.CreateGround();
    this.CreateDudes();

    //this.DudefollowTank();
  }

  private CreateDudes(): void {
    Babylon.SceneLoader.ImportMesh("", "assets/", "dummy3.babylon", this.scene, this.onMeshImported.bind(this));
    
  }

  private onMeshImported(newMeshes, particleSystems, skeletons) {

    var skeleton = skeletons[0];
    let modelMesh: Babylon.Mesh = newMeshes[0];
    modelMesh.name = 'enemyDude';
    modelMesh.scaling = new Babylon.Vector3(5, 5, 5);
    modelMesh.position = new Babylon.Vector3(0, 0, 5);
    modelMesh.rotation.y = 180;
    modelMesh.position.y += 10.6;

    var idleRange = skeleton.getAnimationRange("YBot_Idle");
    var walkRange = skeleton.getAnimationRange("YBot_Walk");
    var runRange = skeleton.getAnimationRange("YBot_Run");
    var leftRange = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
    var rightRange = skeleton.getAnimationRange("YBot_RightStrafeWalk");

    // RUN
    if (runRange) this.scene.beginAnimation(skeleton, runRange.from, runRange.to, true);

    this.DudefollowTank();


  }

  private CreateFreeCamera(): void {

    this.freecamera = new Babylon.FreeCamera('camera', new Babylon.Vector3(0, 1, -10), this.scene);
    this.freecamera.attachControl(this.canvasElement.nativeElement);
    this.freecamera.position.y += 12;
    this.freecamera.checkCollisions = true;
    this.freecamera.applyGravity = true;
  }

  private CreateMeshes(): void {
    let tank: Babylon.Mesh = Babylon.MeshBuilder.CreateBox('tank', { height: 1, width: 5, depth: 5 }, this.scene);
    let tankMaterial: Babylon.StandardMaterial = new Babylon.StandardMaterial('tankMat', this.scene);
    tankMaterial.diffuseColor = Babylon.Color3.Red();
    tankMaterial.emissiveColor = Babylon.Color3.Blue();
    tank.material = tankMaterial;
    tank.position.y += 10.6;

    this.CreateFollowCamera(tank);
  }

  private CreateFollowCamera(targetMesh: Babylon.Mesh): void {
    this.followcamera = new Babylon.FollowCamera('tankFollowCamera', targetMesh.position, this.scene, targetMesh);
    this.followcamera.radius = 20;
    this.followcamera.heightOffset = 5;
    this.followcamera.rotationOffset = 180;
    this.followcamera.cameraAcceleration = 0.5;
    this.followcamera.maxCameraSpeed = 50;
    this.scene.activeCamera = this.followcamera;
  }

  private CreateLights(): void {
    this.light = new Babylon.HemisphericLight('light1', new Babylon.Vector3(0, 1, 0), this.scene);
  }

  private CreateGround(): void {

    let options = {
      width: 3000,
      height: 3000,
      subdivisions: 20,
      minHeight: 0,
      maxHeight: 30,
      updatable: false
    }
    let ground: Babylon.GroundMesh = Babylon.MeshBuilder.CreateGroundFromHeightMap('terrain', './assets/heightmap.png', options, this.scene);

    let groundMaterial = new Babylon.StandardMaterial('grassmat', this.scene);
    groundMaterial.diffuseTexture = new Babylon.Texture('./assets/grass.jpg', this.scene);

    ground.checkCollisions = true;

    ground.material = groundMaterial;
  }

  public handleKeyBoardEvents(event): void {
    let tank = this.scene.getMeshByName('tank');

    let tankSpeed = 5;
    if (event.key === 'd') {
      tank.rotation.y += 0.1;
      this.frontVector = new Babylon.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
     

    }
    else if (event.key === 'a') {
      tank.rotation.y -= 0.1;
      this.frontVector = new Babylon.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
      //tank.moveWithCollisions(new Babylon.Vector3(-1 * tankSpeed, 0, 0) );
    
    }
    else if (event.key === 'w') {
      tank.moveWithCollisions(this.frontVector.multiplyByFloats(tankSpeed, tankSpeed, tankSpeed));
      this.DudefollowTank();
    }
    else if (event.key === 's') {
      //tank.moveWithCollisions(new Babylon.Vector3(0, 0, -1 * tankSpeed) );
      tank.moveWithCollisions(this.frontVector.multiplyByFloats(-1 * tankSpeed, -1 * tankSpeed, -1 * tankSpeed));
      this.DudefollowTank();
    }
  }

  private DudefollowTank(): void{
    let dudeMesh = this.scene.getMeshByName('enemyDude');
    let tankMesh = this.scene.getMeshByName('tank');

    if(dudeMesh === null || dudeMesh === undefined) return;

    let dudedirection = tankMesh.position.subtract(dudeMesh.position);
    let distance = dudedirection.length();
    let normalizedDir = dudedirection.normalize();
    
    console.log(distance);
   // dudeMesh.position.z = tankMesh.position.z + 2;
   // dudeMesh.moveWithCollisions(normalizedDir);
   let dudespeed = 0.5;
   if(distance > 2)
      dudeMesh.moveWithCollisions(normalizedDir.multiplyByFloats(dudespeed, dudespeed, dudespeed));
    let alpha = Math.atan2(1 * normalizedDir.x, 1 * normalizedDir.z);
    dudeMesh.rotation.y = alpha;
  }

}
