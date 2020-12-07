class DefBarrel extends CGFobject {
	constructor(scene, base, middle, height, slices, stacks) {
		super(scene);
		this.base = base;
        this.middle = middle;
		this.height = height;
		this.slices = slices;
        this.stacks = stacks;
        
        this.ang = 30 * DEGREE_TO_RAD;
        this.h = 4/3 * this.base;
        this.H = 4/3 * (this.middle - this.base);

		this.surfaces= [];

        this.controlPoints1 = [
            [
                [this.base, 0, 0, 1],
                [this.base + this.H, 0, this.H / Math.tan(this.ang), 1],
                [this.base + this.H, 0, this.height - this.H / Math.tan(this.ang), 1],
                [this.base, 0, this.height, 1]
            ],
            [
                [this.base, this.h, 0, 1],
                [this.base + this.H, this.h + this.H, this.H / Math.tan(this.ang), 1],
                [this.base + this.H, this.h + this.H, this.height - this.H/Math.tan(this.ang), 1],
                [this.base, this.h, this.height, 1]
            ],
            [
                [-this.base, this.h, 0, 1],
                [-this.base - this.H, this.h + this.H, this.H / Math.tan(this.ang), 1],
                [-this.base - this.H, this.h + this.H, this.height - this.H / Math.tan(this.ang), 1],
                [-this.base, this.h, this.height, 1]
            ],
            [
                [-this.base, 0, 0, 1],
                [-this.base - this.H, 0, this.H / Math.tan(this.ang), 1],
                [-this.base -this.H, 0, this.height - this.H / Math.tan(this.ang), 1],
                [-this.base, 0, this.height, 1]
            ]
            
        ];



        this.controlPoints2 = [
            [
                [-this.base, 0, 0, 1],
                [-this.base - this.H, 0, this.H / Math.tan(this.ang), 1],
                [-this.base - this.H, 0, this.height - this.H / Math.tan(this.ang), 1],
                [-this.base, 0, this.height, 1]
            ],
            [
                [-this.base, -this.h, 0, 1],
                [-this.base - this.H, -this.h - this.H, this.H / Math.tan(this.ang), 1],
                [-this.base - this.H, -this.h - this.H, this.height - this.H/Math.tan(this.ang), 1],
                [-this.base, -this.h, this.height, 1]
            ],
            [
                [this.base, -this.h, 0, 1],
                [this.base + this.H, -this.h - this.H, this.H / Math.tan(this.ang), 1],
                [this.base + this.H, -this.h - this.H, this.height - this.H / Math.tan(this.ang), 1],
                [this.base, -this.h, this.height, 1]
            ],
            [
                [this.base, 0, 0, 1],
                [this.base + this.H, 0, this.H / Math.tan(this.ang), 1],
                [this.base +this.H, 0, this.height - this.H / Math.tan(this.ang), 1],
                [this.base, 0, this.height, 1]
            ]
        ];

        this.makeSurface();


    }

    makeSurface() {
        let nurbsSurface1 = new CGFnurbsSurface(3, 3, this.controlPoints1);
        let object1 = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface1);
        let nurbsSurface2 = new CGFnurbsSurface(3, 3, this.controlPoints2);
		let object2 = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface2);

        this.surfaces.push(object1);
        this.surfaces.push(object2);
    }
    
    display(){
        for(let i = 0; i < this.surfaces.length; i++)
        {
            this.scene.pushMatrix();
			this.surfaces[i].display();
			this.scene.popMatrix();
        }
    }


}