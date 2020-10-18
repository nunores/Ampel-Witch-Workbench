class MyComponent extends CGFobject {
    constructor(scene, id){
        super(scene);
        this.id = id;
        this.texturePath = null;
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

    setTexturePath(texturePath){
        this.texturePath = texturePath;
    }

    setTransformations(transformations)
    {
        this.transformations = transformations;
    }

    assignTextures()
    {
        this.textureObject = new CGFtexture(this.scene, this.texturePath);
    }

    display(){
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transformations);
        if (this.material != null)
        {
            if (this.texturePath != "null")
            {
                this.material.setTexture(this.textureObject);
            }
            this.scene.stack.push(this.material);
        }

        if (this.texturePath != "null" && this.material == null)
        {
            var new_material = new CGFappearance(this.scene);
            new_material.setTexture(this.textureObject);
            this.scene.stack.push(new_material);
        }

        if (this.scene.stack.length != 0)
            this.scene.stack[this.scene.stack.length - 1].apply();

        
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

                this.children[i].display();
                
            }

        }

        if (this.material != null || this.texturePath != "null")
        {
            this.scene.stack.pop();
        }

        this.scene.defaultAppearance.apply();
        this.scene.popMatrix();

    }


}