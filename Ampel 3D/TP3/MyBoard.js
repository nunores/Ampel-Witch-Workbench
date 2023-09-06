class MyBoard extends CGFobject {
	constructor(scene) {
        super(scene);
        this.material = new CGFappearance(this.scene);
        this.texture = new CGFtexture(this.scene, "./scenes/images/dark_wood.jpg");
        this.material.setTexture(this.texture);
    }

	display(){
        this.material.apply();
        let plane = new Plane(this.scene, 10, 10);
        let matrix = mat4.create();

        matrix = mat4.translate(matrix, matrix, [-0.4, 5.5, -0.5]);
        matrix = mat4.scale(matrix, matrix, [15, 15, 1]);

        this.setMaterial();

        this.scene.pushMatrix();
        this.scene.multMatrix(matrix);

        plane.display();

        this.scene.popMatrix();
		
    }

    setMaterial(){
        this.material.setAmbient(0, 0, 0.1, 1);
        this.material.setEmission(0, 0, 0.1, 1);
        this.material.apply();
    }
}