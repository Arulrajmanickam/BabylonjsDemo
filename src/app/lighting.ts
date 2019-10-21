
import * as Babylon from 'babylonjs';

export class MeshLighting{

  private dirLight: Babylon.DirectionalLight;
  private pointLight: Babylon.PointLight;
  private hemisphericLight: Babylon.HemisphericLight;

    /**
     *
     */
    constructor(private scene: Babylon.Scene) {
        
        
    }

    public TurnOnLighting(): void{
        this.scene.lightsEnabled = false;
    }

    public TurnOffLighting(): void{
        this.scene.lightsEnabled = false;
    }

    // public CreateDirectionalLight(): void{
    //     this.dirLight = new Babylon.DirectionalLight('light', new Babylon.Vector3(1, -1, 10), this.scene);
    // }

    // public CreatePointLight(): void{
    //     this.pointLight = new Babylon.PointLight('light', new Babylon.Vector3(0, 1, -1), this.scene);
    // }

    public CreatHemisphericLight(): void{
        this.hemisphericLight = new Babylon.HemisphericLight('light', new Babylon.Vector3(0, 1, 0), this.scene);
        this.hemisphericLight.intensity = 0.7;
    }
}