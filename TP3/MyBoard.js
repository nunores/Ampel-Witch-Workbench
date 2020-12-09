class MyBoard extends CGFobject {
	constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers(){

    }


	display(){
        let plane = new Plane(this.scene, 10, 10);
        var matrix = mat4.create();
        matrix = mat4.translate(matrix, matrix, [-0.4, 5.5, -0.1]);
        matrix = mat4.scale(matrix, matrix, [12, 12, 1]);
        let material = new CGFappearance(this.scene);
        material.setAmbient(0, 0, 0.1, 1);
        material.setEmission(0, 0, 0.1, 1);
        material.apply();
        this.scene.pushMatrix();
        this.scene.multMatrix(matrix);
        plane.display();
        this.scene.popMatrix();
		
    }
}