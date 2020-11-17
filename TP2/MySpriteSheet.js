class MySpriteSheet extends CGFobject {

	constructor(scene, texture, sizeM, sizeN) {
		super(scene);
		this.scene = scene;
		this.texture = texture;
		this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.rectangle = new MyRectangle(this.scene, 0, 0, 1, 1);

		this.defaultAppearance = new CGFappearance(this.scene);
		this.defaultTexture = new CGFtexture(this.scene, this.texture);
        this.shader = new CGFshader(this.scene.gl, "./shaders/shader.vert", "./shaders/shader.frag");
        this.shader.setUniformsValues({
            sizeM: this.sizeM, sizeN: this.sizeN
        });
	}

	activateCellMN(m, n) {
		this.shader.setUniformsValues({
			M: m, N: n
		});
	}

	activateCellP(p) {
		let n = Math.floor(p / this.sizeM);
		let m = p % this.sizeM;
		this.activateCellMN(m, n);
	}
	
	display(){
		this.rectangle.display();
	}

}