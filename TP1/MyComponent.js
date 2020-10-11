class MyComponent extends CGFobject {
    constructor(scene, id){
        super(scene);
        this.id = id;
        this.texture = null;
        this.transformations = null;
        this.children = [];
        this.material = null;

    }

    addChildren(child)
    {
        this.children.push(child);
    }

    setTexture(texture){
        this.texture = texture;
    }

    setTransformations(transformations)
    {
        this.transformations = transformations;
    }

    assignTransformations(){
        var main_transformations = this.transformations;
        if (typeof this.children[0] === 'string') { // If the child is not a leaf
            for (var i = 0; i < this.children.length; i++){
                for (var n = 0; n < this.scene.components.length; n++){
                    if (this.scene.components[n].id == this.children[i]) // Find component corresponding to stored string
                    {
                        var temp_transformations = this.scene.components[n].transformations;
                        temp_transformations = mat4.multiply(temp_transformations, this.transformations, temp_transformations);
                        this.scene.components[n].setTransformations(temp_transformations);
                        this.scene.components[n].assignTransformations();
                    }
                }
            }
        }
    }
    
    assignTextures()
    {
        var main_texture = this.texture;
        if (typeof this.children[0] === 'string') { // If the child is not a leaf
            for (var i = 0; i < this.children.length; i++){
                for (var n = 0; n < this.scene.components.length; n++){
                    if (this.scene.components[n].id == this.children[i]) // Find component corresponding to stored string
                    {
                        if (this.scene.components[n].texture == "null")
                        {
                            this.scene.components[n].setTexture(main_texture);
                        }
                        this.scene.components[n].assignTextures();
                    }
                }
            }
        } 
    }

    display(){
        if (typeof this.children[0] === 'string') // If the child is not a leaf - need only to check the first one
        {
            for (var i = 0; i < this.children.length; i++)
            {
                for (var n = 0; n < this.scene.components.length; n++)
                {
                    if (this.scene.components[n].id == this.children[i]) // Find component corresponding to stored string
                    {
                        this.scene.components[n].display();
                    }
                }
            }
        }
        else {
            for (var i = 0; i < this.children.length; i++)
            {
                // parseMatrix()   
                this.scene.pushMatrix();
                this.scene.multMatrix(this.transformations);
                this.children[i].display();
                this.scene.popMatrix();
            }
            
        }
    }

}