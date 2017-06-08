//like a branch, but grows downwards

//has a start point (x and y)
//and an end point
//it randomly creates a mostly straight path from start to end
function HalloweenRoot(x,y,maxx,maxy, parent) {
   	//initial variables
	this.x = x;
	this.y = y;
	this.is_dead = false;
	this.is_stasis = false;
	//check to see if off screen
	if(this.x > maxx || this.y > maxy || this.x < 0 || this.y < 0){
		this.is_dead = true;
	}
	this.age = 0;
	this.children = new Array();
	this.num_children = 0;
	this.width = 1;

	this.parent = parent;
	this.length = 10;
	//relative
	
	this.x_end = randomX(this.length) * parent.direction();
	this.y_end = randomY(this.length);
	//absolute
	this.endx = this.x + this.x_end;
	this.endy = this.y + this.y_end;
	this.max_x = maxx;
	this.max_y = maxy;
	//want to make this more flowing, later
	this.path = "M " + this.x + " " +  this.y + " l 0,0" + " " + this.x_end + "," + this.y_end + " z";
	this.color = "45-#000-#000";
	this.stroke = '#fff';
	//test method
	
	this.set_path = function(){
	 	this.path = "M " + this.x + " " +  this.y + " l 0,0" + " " + this.x_end + "," + this.y_end + " z";
	};
	this.test = function(){
		return "Root is working!";
	};
	
	//generates the direction for it's children to grow
	this.direction = function(){
	    if(this.num_children == 2){
	    	return 1;
	    }
		return -1;
	};
	
	this.grow = function(sprite){
		if(this.age/5 < 1){
			this.width = 1;
		}else{
			this.width = this.age/10
		}
		
		this.x_end = this.x_end + (this.x_end/100) * 4;
		this.y_end = this.y_end + (this.y_end/100) * 3;
	    this.endx = this.x + this.x_end;
	    this.endy = this.y + this.y_end;
		this.set_path();
		sprite.animate({'stroke-width': this.width, path: this.path}, 10);
		//keep children with me, as well
		for(var i in this.children){
			this.children[i].x = this.endx;
			this.children[i].y = this.endy;
		}//end for all children
	}//end grow
	
	this.sprout = function(root_list, root_sprite_list){
		if(Math.random() * 300 < 20 && this.num_children < 3){
			root = new HalloweenRoot(this.endx,this.endy,this.max_x,this.max_y, this);
			root_list.push(root);
			root_sprite = paper.path(root.path);
			root_sprite_list.push(root_sprite);
			root_sprite_list[root_sprite_list.length - 1].attr({fill: root.color, stroke: root.stroke, 'stroke-width': root.width});
			this.children.push(root);
		}//end if sprout
	}
	//has a random chance of sprouting more roots
	//passing it it's end point
	//uses index to know where it is in the sprite list
	this.tick = function(root_list, root_sprite_list, index){
	    this.age = this.age + 1;	
		if(this.parent.is_dead){
			this.is_dead = true;
		}//end if dead
		
		if(this.parent.is_stasis){
			this.is_stasis = true;
		}//end if stasis
		
		if(root_list.length < 30 ){
			//don't grow as the tree goes into stasis
			if(!this.is_stasis){
				this.grow(root_sprite_list[index]);
				this.sprout(root_list, root_sprite_list);
			}
		}
		
	};//end tick
	
}

//generates a random end point for the root
//could be positive or negative
function randomX(length){
    if (Math.floor(Math.random() * 100) < 50){
		return (Math.floor(Math.random() * length + 1)) ;
	}else{
		return -(Math.floor(Math.random() * length + 1)) ;
	}
}

//always goes downward, so always a positive y
function randomY(length){
	return (Math.floor(Math.random() * length + 1)) ;
}
