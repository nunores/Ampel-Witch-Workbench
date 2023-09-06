class Plane extends CGFobject {
	constructor(scene, uDivisions, vDivisions) {
		super(scene);
		this.uDivisions = uDivisions;
		this.vDivisions = vDivisions;
		this.surfaces= [];

		this.makeSurface();
	}

	makeSurface(){

		let controlVertexes = [	// U = 0
			[ // V = 0..1;
				 [-0.5, -0.5, 0.0, 1 ],
				 [-0.5, 0.5, 0.0, 1 ]
				
			],
			// U = 1
			[ // V = 0..1
				 [ 0.5, -0.5, 0.0, 1 ],
				 [ 0.5,  0.5, 0.0, 1 ]							 
			]
		];

		let nurbsSurface = new CGFnurbsSurface(1, 1, controlVertexes);
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