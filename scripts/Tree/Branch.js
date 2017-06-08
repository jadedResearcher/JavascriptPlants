//like a branch, but grows downwards

//has a start point (x and y)
//and an end point
//it randomly creates a mostly straight path from start to end
function Branch(x,y,maxx,maxy, parent) {
   	//initial variables
	this.x = x;
	this.y = y;
	this.seed = false;//not a seed
	this.is_stasis = false;
	this.is_dead = false;
	//check to see if off screen
	if(this.x > maxx || this.y > maxy || this.x < 0 || this.y < 0){
		this.is_dead = true;
	}
	this.age = 0;
	this.children = new Array();
	this.num_children = 0;
	this.is_floating = false;//and always will be
	this.num_branches = 0;
	this.max_leaves = 50;
	this.max_branches = 180;
	this.num_leaves = 0;
	this.width = 1;

	this.parent = parent;
	this.direction = parent.branch_direction();
	this.distance_from_seed = this.parent.distance_from_seed + 1;
	this.length = 10;
	//relative
	if(parent.seed){
		this.x_end = 0.1
		this.y_end = randomYBranch(this.length) - 5;
	}else{
		this.x_end = randomXBranch(this.length) * this.direction;
		this.y_end = randomYBranch(this.length);
	}

	//absolute
	this.endx = this.x + this.x_end;
	this.endy = this.y + this.y_end;
	this.max_x = maxx;
	this.max_y = maxy;
	//want to make this more flowing, later
	this.path = "M " + this.x + " " +  this.y + " l 0,0" + " " + this.x_end + "," + this.y_end + " z";
	this.color = "45-#fff-#eb9";
	this.stroke = '#630';
	//test method
	
	this.set_path = function(){
	 	this.path = "M " + this.x + " " +  this.y + " l 0,0" + " " + this.x_end + "," + this.y_end + " z";
	};
	this.test = function(){
		return "branch is working!";
	};
	
	//generates the direction for it's children to grow
	this.branch_direction = function(){
	 	ret = this.direction;
	 	for(var i; i < this.num_branches + 1; i++){
	 		ret = ret * -1;
	 	}
		return ret;
	};
	
	this.leaf_direction = function(){
	 	ret = 1;
	 	for(var i; i < this.num_leaves; i++){
	 		ret = ret * -1;
	 	}
		return ret;
	};
	
	this.grow = function(sprite){
		var added_length = 0;
		if(this.age/5 < 1){
			this.width = 1;
		}else{
		
			this.width = this.age/(1.5+this.distance_from_seed);
			added_length = this.distance_from_seed/100;

		}
		//don't try to move grow zero
		if(!this.parent.seed){
			this.x_end = this.x_end + (this.x_end/100) * 5;
		}
		this.y_end = this.y_end + (this.y_end/100) * 5 + added_length;
	    this.endx = this.x + this.x_end;
	    this.endy = this.y + this.y_end;
		this.set_path();
		
		//keep children with me, as well
		for(var i in this.children){
			this.children[i].x = this.endx;
			this.children[i].y = this.endy;
			//ignore dead children
			if(this.children[i].is_dead || this.children[i].is_floating){
				this.children.splice(i,1);
			}
		}//end for all children
	}//end grow
	
	//animate even if not growing
	this.animate = function(sprite){
	 	sprite.animate({'stroke-width': this.width, path: this.path}, 10);
	};
	
	this.sprout_branch = function(branch_list, branch_sprite_list){
		if(((Math.random() * 100 + this.distance_from_seed * 2) < 30) || this.parent.seed){
			branch = new Branch(this.endx,this.endy,this.max_x,this.max_y, this);
			branch_list.push(branch);
			branch_sprite = paper.path(branch.path);
			branch_sprite_list.push(branch_sprite);
			branch_sprite_list[branch_sprite_list.length - 1].attr({fill: branch.color, stroke: branch.stroke, 'stroke-width': branch.width});
			this.children.push(branch);
			this.num_children = this.children.length;
			this.num_branches = this.num_branches + 1;
		}//end if sprout
	}//end sprout branch
	
	//sprouts a leaf, randomly
	//the thiner the branch, the more likely it is to sprout leaves.
	this.sprout_leaf = function(leaf_list, leaf_sprite_list){
		if((Math.random() * 1000000 - (this.max_leaves - this.num_leaves)  < 40 - this.width*20)|| this.is_stasis && this.width < 2){
			leaf = new Leaf(this.endx,this.endy,this.max_x,this.max_y, this);
			angle = Math.random() * 180 * this.leaf_direction();
			leaf_list.push(leaf);
			leaf_sprite = paper.path(leaf.path);
			leaf_sprite_list.push(leaf_sprite);
			leaf_sprite_list[leaf_sprite_list.length - 1].attr({scale: "0.5,0.5",fill: leaf.color, stroke: leaf.stroke, 'stroke-width': leaf.width});
			leaf_sprite_list[leaf_sprite_list.length - 1].rotate(angle);
			this.children.push(leaf);
			this.num_children = this.children.length;
			this.num_leaves = this.num_leaves + 1;
		}	
	};//end sprout leaf
	
	//everything a branch does per tick
	//uses index to know where it is in the sprite list
	this.tick = function(branch_list, branch_sprite_list, leaf_list, leaf_sprite_list, index){
	    this.age = this.age + 1;	
		if(this.parent.is_dead){
			this.is_dead = true;
		}//end if dead
		
		if(this.parent.is_stasis){
			this.is_stasis = true;
			
		}//end if stasis

		//handle sprouting

		//don't grow as the tree goes into stasis
			if(!this.is_stasis){
				this.grow(branch_sprite_list[index]);
				//two branches per branch
				if(this.num_branches < 2 && branch_list.length < this.max_branches ){
					this.sprout_branch(branch_list, branch_sprite_list);
				}//end if can sprout								
			}

		
						
		this.animate(branch_sprite_list[index]);
		//sprout leaves at the last minute
		if((this.num_leaves < 2 && leaf_list.length < this.max_leaves) || this.is_stasis){
			this.sprout_leaf(leaf_list, leaf_sprite_list);
		}
		
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
