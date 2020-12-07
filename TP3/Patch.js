class Patch extends CGFobject {
	constructor(scene, npointsU, npointsV, uDivisions, vDivisions, controlPoints) {
		super(scene);
		this.uDivisions = uDivisions;
        this.vDivisions = vDivisions;
		this.npointsU = npointsU;
		this.npointsV = npointsV;
		this.controlPoints = controlPoints;

		this.controlPointsfinal = [];
		this.surfaces= [];

		this.makeSurface();
	}

	makeSurface(){

		let index = 0;

 		for (let i = 0; i < this.controlPoints.length; i++)
		{
			this.controlPoints[i].push(1);
		}
 
		for(let i = 0; i < this.npointsU; i++)
		{
			let array = [];
			for(let n = 0; n < this.npointsV; n++)
			{
				
				array.push(this.controlPoints[index]);
				index++;
			}

			this.controlPointsfinal.push(array);
		}

		let nurbsSurface = new CGFnurbsSurface(this.npointsU - 1, this.npointsV - 1, this.controlPointsfinal);
		let object = new CGFnurbsObject(this.scene, this.uDivisions, this.vDivisions, nurbsSurface);

		this.surfaces.push(object);

	}

	display(){
		for (let index = 0; index < this.surfaces.length; index++) {
			this.scene.pushMatrix();

			this.surfaces[index].display();
			this.scene.popMatrix();
			
		}
		
	}

}