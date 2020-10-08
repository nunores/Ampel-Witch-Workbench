class MyComponent extends CGFobject {
    constructor(scene){
        super(scene);
        this.textures = null;
        this.transformations = null;
        this.children = [];
        this.material = null;

    }

    addChildren(child)
    {
        this.children.push(child);
    }
    
}