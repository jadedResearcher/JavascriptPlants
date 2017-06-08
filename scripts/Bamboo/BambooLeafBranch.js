//like a branch, but grows downwards

//has a start point (x and y)
//and an end point
//it randomly creates a mostly straight path from start to end
function BambooLeafBranch(x,y,maxx,maxy, parent) {
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
	this.length = 15;
	this.red =  Math.min(this.parent.red +  Math.floor(Math.random() * 10),255);
	this.green = Math.min(this.parent.green + Math.floor(Math.random() * 20),255);
	this.blue = Math.min(this.parent.blue + Math.floor(Math.random() * 5),255);
	//relative
	if(parent.seed){
		this.x_end = 0.1
		this.y_end = randomYLeafBranch(this.length) - 5;
	}else{
		this.x_end = randomXLeafBranch(this.length) * this.direction;
		this.y_end = randomYLeafBranch(this.length);
	}

	//absolute
	this.endx = this.x + this.x_end;
	this.endy = this.y + this.y_end;
	this.max_x = maxx;
	this.max_y = maxy;
	//want to make this more flowing, later
	this.path = "M " + this.x + " " +  this.y + " l 0,0" + " " + this.x_end + "," + this.y_end + " z";
	this.color = "45-#fff-#eb9";
	this.stroke = 'rgb(' + this.red + ',' + this.green + ',' + this.blue +')';
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
		
			this.width = this.age/(1.5+this.distance_from_seed*3);
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
	//less likely to branch up high.
	this.sprout_branch = function(branch_list, branch_sprite_list){
		if(((Math.random() * 100 ) < 20 - this.distance_from_seed*2) || this.parent.seed){
			branch = new BambooLeafBranch(this.endx,this.endy,this.max_x,this.max_y, this);
			branch_list.push(branch);
			branch_sprite = paper.path(branch.path);
			branch_sprite_list.push(branch_sprite);
			branch_sprite_list[branch_sprite_list.length - 1].attr({fill: branch.color, stroke: branch.stroke, 'stroke-width': branch.width});
			this.children.push(branch);
			this.num_children = this.children.length;
			this.num_branches = this.num_branches + 1;
		}//end if sprout
	}//end sprout branch
	
	
	//sprouts a number of leaves determined by how long I am.
	this.sprout_leaves = function (leaf_list, leaf_sprite_list){
	    //the var this.length merely is my intended max length
	    var real_length = Math.sqrt(Math.pow((this.x - this.endx),2) + Math.pow((this.y - this.endy),2) );
	    var sub_length = 10;
	    for(var i = 0; i < real_length; i+=sub_length){
	        //keep going in direction of branch (not just always left/right)
	        if(this.x > this.parent.x){
	            leaf_x = this.x + i;
	        }else{
	            leaf_x = this.x - i;
	        }
	        //using basic algebra to get here, assumes that start of branch is 0,0
	        //true slope doesn't work for some reason, this does(ish)
	        m = (this.y- this.endy)/(this.x-this.endx);
	        b = this.y-(m)*this.x;
	        leaf_y = m*leaf_x + b;
                //take into account leafs width (don't want it centered at x,y), move left or right.
                dir = (this.x - this.endx)/Math.abs(this.x - this.endx);
	        leaf = new BambooLeaf(leaf_x+10*dir,leaf_y,this.max_x,this.max_y, this);
	        //how to calculate angle...want half to be going one direction, half the other...direction based on angle of branch, as well
	        theta = Math.atan(leaf_x/leaf_y);
	        var angle = theta * 180/Math.PI;
                //half are angled one way, half the other, angled towards direction branch is going
	        if(i%(sub_length*2) == 0){
	           angle = dir*((theta * 180/Math.PI)+45);
	        }else{
	           angle = dir*((theta * 180/Math.PI)+90+45);
	        }
	       // angle = theta * 180/Math.PI;;
	        leaf_list.push(leaf);
	        leaf_sprite = paper.path(leaf.path);
	        //dots should follow line perfectly, but they don't. this is why leaves are having problems. 
	        //dot = paper.circle(leaf_x, leaf_y, 2,2);
	        //dot.attr({fill: "#f00", 'fill-opacity': 0.1});
	        leaf_sprite_list.push(leaf_sprite);
	        leaf_sprite_list[leaf_sprite_list.length - 1].attr({scale: "5.5,0.8",fill: leaf.color, 'fill-opacity': 1.0, 'stroke-opacity':0.2,stroke: leaf.stroke, 'stroke-width': leaf.width});
	        leaf_sprite_list[leaf_sprite_list.length - 1].rotate(angle,leaf_x, leaf_y);
	    this.children.push(leaf);
	    this.num_children = this.children.length;
	    this.num_leaves = this.num_leaves + 1;
	    }
	    //put one leaf on tip
	    
	}
	
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
		if((this.num_leaves < 1  && leaf_list.length < this.max_leaves) && this.is_stasis){
			this.sprout_leaves(leaf_list, leaf_sprite_list);
		}
		
	};//end tick
	
}

//generates a random end point for the branch
//could be positive or negative
function randomXLeafBranch(length){
    if (Math.floor(Math.random() * 100) < 50){
		return (Math.floor(Math.random() * length + 1)) ;
	}else{
		return -(Math.floor(Math.random() * length + 1)) ;
    }
}

//bamboo branches can go anywhere, slightly more likely to be up
function randomYLeafBranch(length){
    if (Math.floor(Math.random() * 100) < 80){
		return (Math.floor(Math.random() + 1)) ;
	}else{
		return -(Math.floor(Math.random()  + 1)) ;
    }
}
