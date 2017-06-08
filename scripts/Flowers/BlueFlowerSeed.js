//the start of every flower
//dies, eventually.
//sprouts a single stick, upwards from it
//and a few roots, below it
function BlueFlowerSeed(x,y,maxx,maxy, scale) {
   	//initial variables
	this.x = x;
	this.y = y;
	this.endx = x;
	this.distance_from_seed = 0;
	this.endy = y;
	this.seed = true;
	this.stem_chance = 110;
	this.is_dead = false;
	this.is_stasis = false;
	this.age = 0;
	this.scale = scale;
	this.num_roots = 0;
	this.num_branches = 0;
	this.pinstripe = false;
	//is a pinstripe flower seed
	if(Math.random() * 100 < 30){
	this.pinstripe = true;
	}
	this.max_x = maxx;
	this.max_y = maxy;
	this.path = "M" + this.x + " " +  this.y + " c 0,0 1.73239,-6.69333 3.22855,-5.66964 1.49615,1.02368 2.87455,5.30251 2.87419,5.55152 -4.7e-4,0.32572 0.14048,1.95591 -0.27561,2.4411 -0.32546,0.37952 -0.91701,1.35958 -1.96862,1.7324 -0.62769,0.22252 -2.23028,0.0166 -2.79545,-0.47247 -0.4011,-0.3471 -1.26546,-1.08082 -1.10244,-1.81114 0.0488,-0.21892 -0.22056,-1.44093 0.0393,-1.77177 z";
	this.color = "45-#000-#f95";
	//so the petals can be consistent
	this.red_petal = Math.random() * 55;
	this.green_petal = Math.random() * 55;
	this.blue_petal = Math.random() * 200 +50;
	this.stroke = '#000';
	//test method
	this.test = function(){
		return "Seed is working!";
	};
	
	//generates the direction for it's children to grow
	this.direction = function(){
	    if(this.num_roots == 2){
	    	return 1;
	    }
		return -1;
	};
	
	this.branch_direction = function(){
		return 1;
	}
	
	//seed creates two roots, then does nothing.
	this.tick = function(root_list, root_sprite_list, branch_list, branch_sprite_list){
		this.age = this.age + 1;
		if (this.age > 10){
		//	this.is_dead = true;
		//don't die, just stop growing and being an object
			this.is_stasis = true;
		}//end if dead

		
		if (this.num_branches == 0 && this.age > 5){
		    this.num_branches = this.num_branches + 1;
		    branch = new Stem(this.x,this.y,this.max_x,this.max_y, this);
			branch_list.push(branch);
			branch_sprite = paper.path(branch.path);
			branch_sprite_list.push(branch_sprite);
			branch_sprite_list[branch_sprite_list.length - 1].attr({fill: branch.color, stroke: branch.stroke, 'stroke-width': branch.width});
		
		}//end if branches
	};
}

