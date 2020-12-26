class MyBoard extends CGFobject {
	constructor(scene) {
        super(scene);
        this.initBuffers();
        this.material = new CGFappearance(this.scene);
    }
    
    initBuffers(){

    }


	display(){
        let plane = new Plane(this.scene, 10, 10);
        let matrix = mat4.create();

        matrix = mat4.translate(matrix, matrix, [-0.4, 5.5, -0.1]);
        matrix = mat4.scale(matrix, matrix, [12, 12, 1]);

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