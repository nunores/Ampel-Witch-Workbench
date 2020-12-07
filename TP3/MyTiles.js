class MyTiles extends CGFobject {
	constructor(scene) {
        super(scene);
        this.firstX = 0;
        this.firstY = 0;
        this.initBuffers();
    }
    
    initBuffers(){

    }


	display(){
		for (let i = 1; i < 12; i++) {
            for(let n = 0; n < i; n++)
            {
                let cylinder = new MyCylinder(this.scene, 40, 40, 0.01, 0.2, 0.2);
                let plane = new Plane(this.scene, 10, 10);
                var matrix = mat4.create();
                matrix = mat4.translate(matrix, matrix, [this.firstX, this.firstY, 0]);
                this.scene.pushMatrix();
                this.scene.multMatrix(matrix);
                let material = new CGFappearance(this.scene);
                material.setAmbient(0, 0, 0.1, 1);
                material.setEmission(0, 0, 0.1, 1);
                material.apply();
                cylinder.display();
                material.setAmbient(1, 1, 1, 1);
                material.setEmission(1, 1, 1, 1);
                material.apply();
                plane.display();
                this.scene.popMatrix();
                this.firstX -= 1.1;
            }
            this.firstX = 0.51*i;
            this.firstY += 1.1;
			
		}
		
    }
}