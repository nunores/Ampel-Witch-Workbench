class MyComponent extends CGFobject {
    constructor(scene, id) {
        super(scene);
        this.id = id;
        this.texturePath = null;
        this.textureObject = null;
        this.transformations = null;
        this.amplification = [];
        this.children = [];
        this.material = null;
    }

    // Set Functions

    setAmplifications(afs, aft) {
        this.amplification.push(afs);
        this.amplification.push(aft);
    }

    setMaterial(material) {
        this.material = material;
    }

    setTexturePath(texturePath) {
        this.texturePath = texturePath;
    }

    setTransformations(transformations) {
        this.transformations = transformations;
    }

    addChildren(child) {
        this.children.push(child);
    }

    assignTextures() {
        this.textureObject = new CGFtexture(this.scene, this.texturePath);
    }

    isLeaf(candidate) {
        return (typeof candidate === 'string');
    }

    // Return the component corresponding to the children candidate
    findChildren(candidate) {
        for (var n = 0; n < this.scene.components.length; n++) {
            if (this.scene.components[n].id == candidate) // Find component corresponding to stored string
            {
                return this.scene.components[n];
            }
        }
    }

    // Sets Materials and Textures appropriately with the help of stacks
    setMaterialsTextures(){
        var temp_material = null;
        var temp_texture = null;

        if (this.material == null) {
            temp_material = this.scene.stack_material.pop();
            this.scene.stack_material.push(temp_material);
            this.scene.stack_material.push(temp_material);
        }
        else {
            temp_material = this.material;
            this.scene.stack_material.push(this.material);
        }

        if (this.texturePath == "null") {
            temp_texture = this.scene.stack_texture.pop();
            this.scene.stack_texture.push(temp_texture);
            this.scene.stack_texture.push(temp_texture);
        }
        else if (this.texturePath == "clear") {
            this.textureObject = null;
            temp_texture = null;
            this.scene.stack_texture.push(this.textureObject);
        }

        else {
            temp_texture = this.textureObject;
            this.scene.stack_texture.push(this.textureObject);
        }

        temp_material.setTexture(temp_texture);
        temp_material.setTextureWrap("REPEAT", "REPEAT");
        temp_material.apply();
    }

    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transformations);

        this.setMaterialsTextures();

        for (var k = 0; k < this.children.length; k++) {
            if (this.isLeaf(this.children[k])) // Checking if is leaf
                this.findChildren(this.children[k]).display();

            else {
                if (this.children[k] instanceof MyRectangle || this.children[k] instanceof MyTriangle)
                    this.children[k].updateTexCoords(this.amplification[0], this.amplification[1]);

                this.children[k].display();
            }
        }

        this.scene.stack_texture.pop();
        this.scene.stack_material.pop();

        this.scene.popMatrix();

    }

}