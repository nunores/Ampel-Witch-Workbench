/**
* MyCylinder
* @constructor
*/

class MyCylinder extends CGFobject {
	constructor(scene, slices, stacks, height, base_radius, top_radius) {
		super(scene);
		this.slices = slices;
		this.stacks = stacks;
		this.height = height;
		this.base_radius = base_radius;
		this.top_radius = top_radius;

		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var stack_alpha = this.height / this.stacks;
		var radius_alpha = (this.top_radius - this.base_radius) / this.stacks;
		var slice_alpha = (2 * Math.PI) / this.slices;
		var z_height = 0;

		for (var n = 0; n < this.stacks + 1; n++) {
			for (var i = 0; i < this.slices; i++) {
				this.vertices.push(
					Math.cos(i * slice_alpha) * this.base_radius,
					Math.sin(i * slice_alpha) * this.base_radius,
					z_height
				);
			}

 			this.normals.push(
				Math.cos(i * slice_alpha) * this.base_radius,
				Math.sin(i * slice_alpha) * this.base_radius,
				0

			);

			this.texCoords.push(n / this.slices, 1 - i / this.stacks);

			z_height += stack_alpha;
			this.base_radius += radius_alpha;

        }
        
        this.vertices.push(0,0,0);
        this.vertices.push(0,0,this.height);

        /*for (var i = 0; i < this.stacks; i++)
        {
            if (i == this.stacks - 1)
            {
                //this.indices.push(i, 0, this.vertices.length - 1);
                //this.indices.push(this.vertices.length - 1, 0, i);
            }
            else{
                //this.indices.push(i , i + 1, this.vertices.length - 1);
                //this.indices.push(this.vertices.length - 1, i + 1, i);
            }
        }
        
        for (var i = 0; i < this.stacks; i++)
        {
			this.indices.push(this.vertices.length - 5 + i, this.vertices.length, this.vertices.length - 4 + i);
        }*/

		for (var i = 0; i < this.stacks - 1; i++) {
			for (var n = 0; n < this.slices; n++) {
                if (n == this.slices - 1)
                {
                    this.indices.push(
						n + this.slices * i, n + this.slices * i - this.slices + 1, n + this.slices * i + this.slices,
                        n + this.slices * i + this.slices, n + this.slices * i + 1, n + this.slices * i - this.slices + 1
					)
					
					// Reverse Order
                    this.indices.push(
						n + this.slices * i + this.slices, n + this.slices * i - this.slices + 1, n + this.slices * i,
						n + this.slices * i - this.slices + 1, n + this.slices * i + 1, n + this.slices * i + this.slices
                    )
				}
				else {
					this.indices.push(
						n + (i * (this.slices)), n + (i * (this.slices)) + 1, n + (i * (this.slices)) + this.slices,
						n + (i * (this.slices)) + 1, n + (i * (this.slices)) + this.slices, n + (i * (this.slices)) + this.slices + 1
					);
					
					// Reverse Order
					this.indices.push(
						n + (i * (this.slices)) + this.slices, n + (i * (this.slices)) + 1, n + (i * (this.slices)), 
						n + (i * (this.slices)) + this.slices + 1, n + (i * (this.slices)) + this.slices, n + (i * (this.slices)) + 1
					)
				}
			}
		}

		// Drawing top and bottom circles
    
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}