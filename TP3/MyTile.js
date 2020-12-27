class MyTile extends CGFobject {
	constructor(scene, firstX, firstY) {
        super(scene);
        this.cylinder = new MyCylinder(this.scene, 40, 40, 0.01, 0.2, 0.2);
        this.plane = new Plane(this.scene, 10, 10);

        this.firstX = firstX;
        this.firstY = firstY;

        this.board = null;

        this.piece = null;

        this.material = new CGFappearance(this.scene);
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
        
        this.setMaterialPurple();

        if(this.piece == null)
        {
            this.cylinder.display();
        }
        else
        {
            this.piece.display();
        }
        
        this.setMaterialWhite();
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