class MyPiece extends MyComponent {
	constructor(scene) {
        super(scene, "id");
        this.tile = null;
        this.type = null;   
        super.addChildren(new MyCylinder(this.scene, 40, 40, 0.2, 0.3, 0.3));
        super.setAmplifications(1, 1);
        super.setTransformations(mat4.create());
        this.material = new CGFappearance(this.scene);
    }

    setTile(tile){
        this.tile = tile;
    }

    unsetTile(){
        this.tile = null;
    }

    getTile(){
        return this.tile;   
    }

    setType(type){
        this.type = type;
    }

    unsetType(){
        this.type = null;
    }

    getType(){
        return this.type;
    }

}