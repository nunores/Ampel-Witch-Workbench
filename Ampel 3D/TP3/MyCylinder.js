class MyCylinder extends CGFobject {

  constructor(scene, slices, stacks, height, bottomRadius, topRadius) {
    
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.topRadius = topRadius;
    this.bottomRadius = bottomRadius;
    this.height = height;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the cylinder buffers
   */
  initBuffers() {

    this.initAngle = (2 * Math.PI)/this.slices;
    this.stackHeight = this.height/this.stacks;
    this.stackRadiusStep = (this.topRadius - this.bottomRadius)/this.stacks;
    this.currentRadius = this.bottomRadius;
    this.angle = 0;

    this.vertices = [];

    this.indices = [];

    this.normals = [];
    
    this.texCoords = [];

    this.initLateral();
    this.initBottomTop();

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }

  initLateral() {

    for (var i = 0; i <= this.stacks; i++) {
      for (var j = 0; j <= this.slices; j++) {

        this.vertices.push(
          -Math.sin(this.angle) * this.currentRadius,
          Math.cos(this.angle) * this.currentRadius,
          i * this.stackHeight
        );

        this.normals.push(
          -Math.sin(this.angle) * this.currentRadius,
          Math.cos(this.angle) * this.currentRadius,
          0
        );

        this.texCoords.push(j / this.slices, 1 - i / this.stacks);

        this.angle += this.initAngle;
      }
      this.angle = 0;

      this.currentRadius += this.stackRadiusStep;
    }


    for (var i = 0; i < this.stacks; i++) {
      for (var j = 0; j < this.slices; j++) {

        var ind = (i * (this.slices + 1)) + j;

        this.indices.push(ind, ind + 1, ind + this.slices + 2);

        this.indices.push(ind, ind + this.slices + 2, ind + this.slices + 1);

      }
    }

  }

  initBottomTop() {

    const index = this.vertices.length / 3;


    let currentAngle = 0;

    for (let i = 0; i <= this.slices; i++) {
      this.vertices.push(
        Math.cos(currentAngle) * this.bottomRadius,
        Math.sin(currentAngle) * this.bottomRadius,
        0,
        Math.cos(currentAngle) * this.topRadius,
        Math.sin(currentAngle) * this.topRadius,
        this.height
      );

      if (i > 1) this.indices.push(index + i * 2, index + i * 2 - 2, index, index + 1, index + i * 2 - 1, index + 2 * i + 1);

      this.normals.push(0, 0, -1, 0, 0, 1);

      this.texCoords.push((Math.cos(currentAngle) + 1) / 2, (Math.sin(currentAngle) + 1) / 2, (Math.cos(currentAngle) + 1) / 2, (Math.sin(currentAngle) + 1) / 2);

      currentAngle += this.initAngle;
    }

  }
}
