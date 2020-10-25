class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);

		this.x1 = x1;
		this.y1 = y1;
		this.z1 = z1;

		this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;

		this.x3 = x3;
		this.y3 = y3;
		this.z3 = z3;

		this.initBuffers();
	}


	initBuffers() {
		this.vertices = [this.x1, this.y1, this.z1, this.x2, this.y2, this.z2, this.x3, this.y3, this.z3];

		this.indices = [0, 1, 2, 2, 1, 0];
		this.texCoords = [];

		this.normals = [
			0,0,1,
			0,0,1,
			0,0,1
		]

		// Calculating Distances

		this.distance_a = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.z1, 2));
		this.distance_b = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2) + Math.pow(this.z3 - this.z2, 2));
		this.distance_c = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));

		this.cos_alpha = (this.distance_a * this.distance_a - this.distance_b * this.distance_b + this.distance_c * this.distance_c) / (2 * this.distance_a * this.distance_c);
		this.sin_alpha = Math.sqrt(1 - this.cos_alpha * this.cos_alpha);
		

		this.texCoords = [
			0, 1,
			1, 1,
			0.5, 0
		]

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTexCoords(length_u, length_v){
		this.texCoords=[
			0, 0,
			this.distance_a/length_u, 0,
			this.distance_c * this.cos_alpha / length_u, this.distance_c * this.sin_alpha / length_v
		];

		this.updateTexCoordsGLBuffers();
	}

}
