//a stem grows exactly two leaves (no randomness)
//and spawns either another stem or a flower_center (but not both)

//has a start point (x and y)
//and an end point
//it randomly creates a mostly straight path from start to end
function Stem(x,y,maxx,maxy, parent) {
   	//initial variables
	this.x = x;
	this.y = y;
	this.rose = parent.rose;
	this.plain = parent.plain;
	this.invert = parent.invert;
	this.wreathe = parent.wreathe;
	this.seed = false;//not a seed
	this.is_stasis = false;
	this.stem_chance = parent.stem_chance - 10;
	this.is_dead = false;
	this.scale = parent.scale;
	//check to see if off screen
	if(this.x > maxx || this.y > maxy || this.x < 0 || this.y < 0){
		this.is_dead = true;
	}
	this.age = 0;
	this.children = new Array();
	this.pinstripe = parent.pinstripe;
	this.num_children = 0;
	this.is_floating = false;//and always will be
	this.num_stems = 0;
	this.num_leaves = 0;
	this.width = 1 * this.scale;

	this.parent = parent;
	//so the petals can be consistent
	this.red_petal = parent.red_petal;
	this.green_petal = parent.green_petal;
	this.blue_petal = parent.blue_petal;
	this.distance_from_seed = this.parent.distance_from_seed + 1;
	this.length = 10 * this.scale;
	//relative
	this.x_end = 0.1
	this.y_end = randomYBranch(this.length) - 5;
	this.original_x_end = this.x_end;
	this.original_y_end = this.y_end;
	//absolute
	this.endx = this.x + this.x_end;
	this.endy = this.y + this.y_end;
	this.max_x = maxx;
	this.max_y = maxy;
	//want to make this more flowing, later
	this.path = "M " + this.x + " " +  this.y + " l 0,0" + " " + this.x_end + "," + this.y_end + " z";
	this.color = "45-#fff-#eb9";
	this.stroke = '#4AA02C';
	//test method
	
	this.set_path = function(){
	 	this.path = "M " + this.x + " " +  this.y + " l 0,0" + " " + this.x_end + "," + this.y_end + " z";
	};
	this.test = function(){
		return "branch is working!";
	};

	
	this.leaf_direction = function(){
	 	ret = 1;
	 	for(var i = 0; i < this.num_leaves; i++){
	 		ret = ret * -1;
	 	}
		return ret;
	};
	

	
	//animate even if not growing
	this.animate = function(sprite, time){
		if(time){
	 		sprite.animate({'stroke-width': this.width, path: this.path},time);
	 	}else{
	 		sprite.animate({'stroke-width': this.width, path: this.path},1000);
	 	}
	};
	
	this.sprout_stem = function(branch_list, branch_sprite_list){
		
			branch = new Stem(this.endx,this.endy,this.max_x,this.max_y, this);
			branch_list.push(branch);
			branch_sprite = paper.path(branch.path);
			branch_sprite_list.push(branch_sprite);
			branch_sprite_list[branch_sprite_list.length - 1].attr({scale: branch.scale, fill: branch.color, stroke: branch.stroke, 'stroke-width': branch.width});
			this.children.push(branch);
			this.num_children = this.children.length;
			this.num_stems = this.num_branches + 1;

	}//end sprout branch
	
	this.sprout_flower = function(leaf_list, leaf_sprite_list){
			flower = new FlowerHead(this.endx,this.endy,this.max_x,this.max_y, this);
			leaf_list.push(flower);
			leaf_sprite = paper.circle(flower.x, flower.y, flower.radius);
			leaf_sprite_list.push(leaf_sprite);
			leaf_sprite_list[leaf_sprite_list.length - 1].attr({scale: flower.scale,fill: flower.color, stroke: flower.stroke, 'stroke-width': flower.width});
			this.children.push(flower);
			this.num_children = this.children.length;
			this.num_leaves = this.num_leaves + 1;
	}
	
	//sprouts a leaf, randomly
	//the thiner the branch, the more likely it is to sprout leaves.
	this.sprout_leaf = function(leaf_list, leaf_sprite_list){
		
			leaf = new Leaf(this.endx,this.endy,this.max_x,this.max_y, this);
			angle = Math.random() * 90 * this.leaf_direction();
			leaf_list.push(leaf);
			leaf_sprite = paper.path(leaf.path);
			leaf_sprite_list.push(leaf_sprite);
			leaf_sprite_list[leaf_sprite_list.length - 1].attr({scale: leaf.scale ,fill: leaf.color, stroke: leaf.stroke, 'stroke-width': leaf.width});
			leaf_sprite_list[leaf_sprite_list.length - 1].rotate(angle,this.end_x,this.endy);
			leaf.angle = angle;
			this.children.push(leaf);
			this.num_children = this.children.length;
			this.num_leaves = this.num_leaves + 1;
	
	};//end sprout leaf
	
	
	this.animate_tick = function(sprite, wind, time){
			this.x_end = this.original_x_end + wind * 1 ;
			//always increase y (don't go up)
			this.y_end = this.original_y_end + wind*2/wind * 1;
	
			this.endx = this.x + this.x_end;
			this.endy = this.y + this.y_end;
			
			for(var i in this.children){
				this.children[i].x = this.endx;
				this.children[i].y = this.endy;
			}
			
			//this.animate(sprite, time);
			this.set_path();
	};
	//first sprouts two leaves
	//then sprouts another stem or a flower head
	this.tick = function(branch_list, branch_sprite_list, leaf_list, leaf_sprite_list, index){
		if(this.num_leaves < 2){
			this.sprout_leaf(leaf_list, leaf_sprite_list)
		}
		if(this.num_leaves < 2 && this.num_children < 3){
			if(Math.random() * 100 < this.stem_chance){
				this.sprout_stem(branch_list, branch_sprite_list);
			}else{
				this.sprout_flower(branch_list, branch_sprite_list);
				//dont do anything after sprouting;
				this.is_stasis = true;
			}
		}else{
			this.is_stasis = true; //if i've done all i can, rest
		}	//end if sprout anything	
			

	};//end tick
	
}



//generates a random end point for the branch
//could be positive or negative
function randomXBranch(length){
    if (Math.floor(Math.random() * 100) < 50){
		return (Math.floor(Math.random() * length + 1)) ;
	}else{
		return -(Math.floor(Math.random() * length + 1)) ;
	}
}

//always goes downward, so always a positive y
function randomYBranch(length){
	return -(Math.floor(Math.random() * length + 1)) ;
}
