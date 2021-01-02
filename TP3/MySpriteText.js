class MySpriteText extends MySpriteSheet {

    constructor(scene, text){
        super(scene, "./scenes/images/font.png", 16, 16);
        this.shadertext = text;
    }

    changeText(text){
        this.shadertext = text;
    }

    display(){
        
        this.scene.pushMatrix();
        this.scene.stack_texture.push(this.defaultTexture);
        this.scene.stack_material.push(this.defaultAppearance);
        

        this.scene.setActiveShaderSimple(this.shader);
        this.defaultAppearance.setTexture(this.defaultTexture);
        this.defaultAppearance.apply();

        for (let i = 0; i < this.shadertext.length; i++)
        {
            this.activateCellP(this.shadertext[i].charCodeAt(0));
            super.display();
            this.scene.translate(1, 0, 0); // Prints char and moves to the right
        }


        this.scene.stack_material.pop();
        this.scene.stack_texture.pop();
        this.scene.popMatrix();
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }

}