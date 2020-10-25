class MyComponent extends CGFobject {
    constructor(scene, id){
        super(scene);
        this.id = id;
        this.texturePath = null;
        this.textureObject = null;
        this.transformations = null;
        this.amplification = [];
        this.children = [];
        this.material = null;


    }

    setAmplifications(afs, aft)
    {
        this.amplification.push(afs);
        this.amplification.push(aft);
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

    // TODO: findChildren()

    display(){
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transformations);
        var temp_material = null;
        var temp_texture = null;

        if (this.material == null)
        {
            temp_material = this.scene.stack_material.pop();
            this.scene.stack_material.push(temp_material);
            this.scene.stack_material.push(temp_material);
        }
        else
        {
            temp_material = this.material;
            this.scene.stack_material.push(this.material);
        }
        
        if (this.texturePath == "null")
        {
            temp_texture = this.scene.stack_texture.pop();
            this.scene.stack_texture.push(temp_texture);
            this.scene.stack_texture.push(temp_texture);
        }
        else if(this.texturePath == "clear")
        {
            this.textureObject = null;
            temp_texture = null;
            this.scene.stack_texture.push(this.textureObject);
        }

        else{
            temp_texture = this.textureObject;
            this.scene.stack_texture.push(this.textureObject);
        }

        temp_material.setTexture(temp_texture);
        temp_material.setTextureWrap("REPEAT","REPEAT");
        temp_material.apply();
        
        
        /*if (this.material != null)
        {
            if (this.texturePath != "null" && this.texturePath != "clear") ////<--
            {
                this.material.setTexture(this.textureObject);
                this.material.setTextureWrap("REPEAT","REPEAT");

            }
            if (this.texturePath == "null")
            {
                if(this.scene.stack.length != 0){
                    this.material.setTexture(this.scene.stack[this.scene.stack.length - 1].texture);
                    this.material.setTextureWrap("REPEAT","REPEAT");

                }

            }
            this.scene.stack.push(this.material);
        }

        if (this.texturePath != "null" && this.texturePath != "clear" && this.material == null)
        {
            var new_material = new CGFappearance(this.scene);
            new_material.setTexture(this.textureObject);
            new_material.setTextureWrap("REPEAT","REPEAT");
            this.scene.stack.push(new_material);
        }

        if (this.scene.stack.length != 0)
            this.scene.stack[this.scene.stack.length - 1].apply();*/
            
        
        for (var k = 0; k < this.children.length; k++)
        {
            if (typeof this.children[k] === 'string') // Checking if is leaf
            {
                for (var n = 0; n < this.scene.components.length; n++)
                {
                    if (this.scene.components[n].id == this.children[k]) // Find component corresponding to stored string
                    {
                        this.scene.components[n].display();
                        
                    }
                }
            }
            else
            {
                if (this.children[k] instanceof MyRectangle || this.children[k] instanceof MyTriangle)
                {
                    this.children[k].updateTexCoords(this.amplification[0], this.amplification[1]);
                }
                this.children[k].display();
            }
        }

        this.scene.stack_texture.pop();
        this.scene.stack_material.pop();

        //this.scene.defaultAppearance.apply();
        this.scene.popMatrix();

    }


}