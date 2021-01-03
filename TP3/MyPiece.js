class MyPiece extends MyComponent {
	constructor(scene, type) {
        super(scene, "id");
        this.tile = null;
        this.type = type; // yellow, red, green, redCylinder, greenCylinder   
        super.addChildren(new MyCylinder(this.scene, 40, 40, 0.2, 0.3, 0.3));
        super.setAmplifications(1, 1);
        super.setTransformations(mat4.create());

        this.setMaterial(type);
    }

    /**
     * 
     * @param {*} tile - Tile to be set
     */
    setTile(tile){
        this.tile = tile;
    }

    unsetTile(){
        this.tile = null;
    }

    getTile(){
        return this.tile;   
    }


    /**
     * 
     * @param {*} type - Type to be set
     */
    setType(type){
        this.type = type;
    }

    unsetType(){
        this.type = null;
    }

    getType(){
        return this.type;
    }

    getMaterial(){
        return this.material;
    }


    /**
     * 
     * @param {*} type - Type of piece
     */
    setMaterial(type){
        if(type === 'yellow'){
            this.material = new CGFappearance(this.scene);
            this.material.setDiffuse(100, 92, 0, 1);
        }
        else if (type === 'red'){
            this.material = new CGFappearance(this.scene);
            this.material.setDiffuse(255, 0, 0, 1);

        }
        else if (type === 'green'){
            this.material = new CGFappearance(this.scene);
            this.material.setDiffuse(0, 128, 0, 1);

        }
    }
}