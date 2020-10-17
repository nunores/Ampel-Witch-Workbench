class MyComponent extends CGFobject {
    constructor(scene, id){
        super(scene);
        this.id = id;
        this.texture = null;
        this.textureObject = null;
        this.transformations = null;
        this.children = [];
        this.material = null;

    }

    setMaterial(material)
    {
        this.material = material;
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

    assignTextures()
    {
        this.textureObject = new CGFtexture(this.scene, this.texture);
    }

    display(){
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transformations);
        if (this.texture != "null")
        {
            this.material.setTexture(this.textureObject);
        }
        if (this.texture == "clear")
        {
            //this.material.texture = null;
            this.material.setTexture(null);
        }
        this.material.apply();
        if (this.material != this.scene.defaultAppearance){
            this.material.apply();
        }
        
        if (typeof this.children[0] === 'string') // If the child is not a leaf - need only to check the first one
        {
            for (var i = 0; i < this.children.length; i++)
            {
                for (var n = 0; n < this.scene.components.length; n++)
                {
                    if (this.scene.components[n].id == this.children[i]) // Find component corresponding to stored string
                    {
                        //if (this.material != "null")
                        //    this.material.apply();
                        this.scene.components[n].display();
                        
                    }
                }
            }
        }
        else {

            for (var i = 0; i < this.children.length; i++)
            {

                this.children[i].display();
                
            }

        }

        this.scene.defaultAppearance.apply();
        this.scene.popMatrix();

    }


}