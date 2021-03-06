//a flower head
//sprouts a bunch of petals
//and keeps track of where to sprout
//the petal, and how to orient it.
function FlowerHead(x,y,maxx,maxy, parent, scale, red, green, blue, no_light){
	this.x = x;
	this.y = y;
	this.age = 0;
	//this.path = "M" + this.x + " " + this.y + "a 6.5,6.5 0 1 1 -13,0 6.5,6.5 0 1 1 13,0 z";
	this.color = "45-#fdd017-#af7817";
	this.stroke = '#010';
	this.angle = 0;
	this.index = 0;
	this.parent = parent;
	if(parent){
		this.rose = parent.rose;
		this.plain = parent.plain;
		this.invert = parent.invert;
		this.wreathe = parent.wreathe;
		this.scale = parent.scale;
		this.pinstripe = parent.pinstripe;
	}else{
		this.scale = 1;
	}
	this.angles = [10, 0, 180];
	//used for picking a random angle
	this.choice = Math.round(Math.random() * 2);


	this.num_children = 0;
	this.children = new Array();
	//for the petals
	if(red){
		this.scale = scale;
		this.red_petal = red;
		this.green_petal = green;
		this.blue_petal = blue;
		this.pinstripe = false;
		//is a pinstripe flower seed
		if(Math.random() * 100 < 30){
			this.pinstripe = true;
		}
	}else{
		this.red_petal = parent.red_petal;
		this.green_petal = parent.green_petal;
		this.blue_petal = parent.blue_petal;
	}
	this.width = 1;
	this.max_x = maxx;
	this.is_dead = false;
	this.shading = ")-#000";
	if(Math.random() * 100 < 50){
		this.shading = ")-#fff";
	}
	if(no_light == true){
		this.shading = ")-#000";
		this.pinstripe = false;
	}
	if(no_light == false){
		this.shading = ")-#fff";
		this.pinstripe = false;
	}
	this.radius = 10 * this.scale;
	this.on_ground = false;
	this.is_stasis = false;
	this.is_floating = false;
	this.max_y = maxy;

	this.test = function(){
		return "Leaf is working!";
	};
	//so that leaves stay attached to their parents
	this.set_path = function(){
		this.path = "M" + this.x + " " + this.y + "a 6.5,6.5 0 1 1 -13,0 6.5,6.5 0 1 1 13,0 z";
	};
	
	this.grow = function(sprite){
	    scale_amount = "" + (this.age/5)+1 + "," + (this.age/5)+1;	
	};
	
	this.animate = function(sprite, time){

		sprite.animate({cx: this.x, cy: this.y}, time);
	}
	//floating is animated differently
	this.animate_floating = function(sprite){
		sprite.animate({path:this.path, rotation: 10 * wind},4000);
		sprite.attr({fill: this.color});
	};
	
	this.get_outer_x = function(angle){
		return this.x + this.radius * Math.sin(angle * Math.PI/180)
	};
	
	this.get_outer_y = function(angle){
		return this.y + this.radius * Math.cos(angle * Math.PI/180)
	};
	

	

	
	this.tick = function(branch_list, branch_sprite_list, petal_list, petal_sprite_list, index){
		
		if(this.index < 10){
	
		 //make all flowers striped
		 if(this.pinstripe == true){
			if(this.shading == ")-#000"){
				this.shading = ")-#fff";
			}else{
			this.shading = ")-#000";
			}
			}
			
			petal = new Petal(this.get_outer_x(this.angle)-(this.radius/2)*this.scale,this.get_outer_y(this.angle) + (this.radius/2) / this.scale ,this.max_x,this.max_y, this);
			petal.position_degree = this.angle;
			petal_list.push(petal);
			petal_sprite = paper.path(petal.path);
			petal_sprite_list.push(petal_sprite);
			petal_sprite_list[petal_sprite_list.length - 1].attr({scale: petal.scale, fill: petal.color, stroke: petal.stroke, 'stroke-width': petal.width});
			if(this.wreathe == true){
				petal.angle = 90-this.angle;
				petal_sprite_list[petal_sprite_list.length - 1].rotate(90 - this.angle);
			}else if(this.invert == true){
				petal.angle = 10 - this.angle;
				petal_sprite_list[petal_sprite_list.length - 1].rotate(10 - this.angle);
			}else if (this.rose == true){
				petal.angle = this.angle;
				petal_sprite_list[petal_sprite_list.length - 1].rotate(this.angle);
			}else if (this.plain == true){
				petal.angle = 180 - this.angle;
				petal_sprite_list[petal_sprite_list.length - 1].rotate(180 - this.angle);
			}else{
				//pick a style randomly
				if(this.angles[this.choice] != 0){
					petal.angle = this.angles[this.choice];
					petal_sprite_list[petal_sprite_list.length - 1].rotate(this.angles[this.choice] - this.angle);
				}else{
					petal.angle = this.angle;
					petal_sprite_list[petal_sprite_list.length - 1].rotate(this.angle);
		 		}//end correcting for rose
			}
			this.angle += 36;
			this.index += 1;
			this.num_children += 1;
			this.children.push(petal);
		}
		
		//only tick once
		if(this.index >= 10){		
			this.is_stasis = true;
		}
	};//end tick
	
	this.animate_tick = function(sprite, wind, time){
		for(var i in this.children){
				this.children[i].x = this.get_outer_x(this.children[i].position_degree);
				this.children[i].y = this.get_outer_y(this.children[i].position_degree) + (this.radius/2) / this.scale;
		}
		//this.animate(sprite, time);

	}
}//end Leaf
