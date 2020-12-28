class MyTile extends CGFobject {
	constructor(scene, firstX, firstY) {
        super(scene);
        this.plane = new Plane(this.scene, 20, 20);

        this.firstX = firstX;
        this.firstY = firstY;

        this.board = null;

        this.piece = null;

        this.material = new CGFappearance(this.scene);
        this.textureObject = new CGFtexture(this.scene, "./scenes/images/light_wood.jpg");

        this.material.setTexture(this.textureObject);
        this.material.setDiffuse(189, 154, 122, 1);
        this.material.setAmbient(0, 0, 0, 1);

    }

    setPiece(piece){
        this.piece = piece;
    }

    unsetPiece(){
        this.piece = null;
    }

    getPiece(){
        return this.piece;
    }


	display(){
        let matrix = mat4.create();
        matrix = mat4.translate(matrix, matrix, [this.firstX, this.firstY, 0]);
        this.scene.pushMatrix();

        this.scene.multMatrix(matrix);
        
        //this.setMaterialPurple();

        if(this.piece != null)
        { 
            this.piece.display();
        }

        this.material.apply();
        
        //this.setMaterialWhite();
        this.plane.display();

        let matrix1 = mat4.create();
        matrix1 = mat4.translate(matrix1, matrix1, [0, 0, 0.5]);
        matrix1 = mat4.rotate(matrix1, matrix1, 180 * DEGREE_TO_RAD, [0, 1, 0]);
        matrix1 = mat4.translate(matrix1, matrix1, [0, 0, 1]);
        this.scene.multMatrix(matrix1);

        this.plane.display();

        let matrix2 = mat4.create();
        matrix2 = mat4.translate(matrix2, matrix2, [0, 0, -0.25]);
        matrix2 = mat4.scale(matrix, matrix2, [1, 1, 0.5]);
        matrix2 = mat4.translate(matrix2, matrix2, [0.5, 0, 0]);
        matrix2 = mat4.rotate(matrix2, matrix2, 90 * DEGREE_TO_RAD, [0, 1, 0]);
        this.scene.multMatrix(matrix2);

        this.plane.display();

        let matrix3 = mat4.create();
        matrix3 = mat4.rotate(matrix3, matrix3, 90 * DEGREE_TO_RAD, [0, 0, 1]);
        matrix3 = mat4.translate(matrix3, matrix3, [0, 0, -0.5]);
        matrix3 = mat4.translate(matrix3, matrix3, [0.5, 0, 0]);
        matrix3 = mat4.rotate(matrix3, matrix3, 90 * DEGREE_TO_RAD, [0, 1, 0]);
        this.scene.multMatrix(matrix3);

        this.plane.display();

        let matrix4 = mat4.create();
        matrix4 = mat4.rotate(matrix4, matrix4, 180 * DEGREE_TO_RAD, [1, 0, 0]);
        matrix4 = mat4.translate(matrix4, matrix4, [0, 0, 0.5]);
        matrix4 = mat4.translate(matrix4, matrix4, [0.5, 0, 0]);
        matrix4 = mat4.rotate(matrix4, matrix4, 90 * DEGREE_TO_RAD, [0, 1, 0]);
        this.scene.multMatrix(matrix4);

        this.plane.display();

        let matrix5 = mat4.create();
        matrix5 = mat4.translate(matrix5, matrix5, [-0.5, 0, -0.5]);
        matrix5 = mat4.rotate(matrix5, matrix5, -90 * DEGREE_TO_RAD, [0, 1, 0]);
        matrix5 = mat4.rotate(matrix5, matrix5, 270 * DEGREE_TO_RAD, [0, 1, 0]);
        matrix5 = mat4.rotate(matrix5, matrix5, 90 * DEGREE_TO_RAD, [0, 1, 0]);
        this.scene.multMatrix(matrix5);

        this.plane.display();

        this.scene.popMatrix();
		
    }

    setMaterialPurple(){
        this.material.setAmbient(0, 0, 0.1, 1);
        this.material.setEmission(0, 0, 0.1, 1);
        this.material.apply();
    }

    setMaterialWhite(){
        this.material.setAmbient(1, 1, 1, 1);
        this.material.setEmission(1, 1, 1, 1);
        this.material.apply();
    }
}