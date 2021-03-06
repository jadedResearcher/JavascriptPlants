//bamboo leaves are long,a nd point out from their branch in a fan shape.
function BambooLeaf(x,y,maxx,maxy, parent){
	this.x = x;
	this.y = y;
	this.parent = parent;
	this.age = 0;
	this.path = "M" + this.x + " " + this.y + "c 0,0 -2.34693,-4.07748 -2.00321,-4.80482 0.34373,-0.72734 2.42296,-7.25683 3.49316,-7.2142 1.0702,0.0426 4.34532,6.67016 4.12005,7.28574 -0.22527,0.61557 -1.52522,4.90962 -2.27264,5.25656 -0.74742,0.34695 -3.11135,0.0247 -3.33736,-0.52328 z";
        this.red =  Math.min(this.parent.red +  Math.floor(Math.random() * 10),255);
	this.green =  Math.min(this.parent.green +  Math.floor(Math.random() * 10),255);
	this.blue = Math.min(this.parent.blue/2 + Math.floor(Math.random() * 5),255);
	
	this.color = '45-rgb(100,255,10)-rgb(' + this.red + ',' + this.green + ',' + this.blue +')';
	//45-#fff-#eb9
	this.stroke = '#010';

	this.scale = parent.scale;
	this.max_x = maxx;
	this.is_dead = false;
	this.on_ground = false;
	this.is_stasis = false;
	this.is_floating = false;
	this.max_y = maxy;
	this.float_direction = parent.leaf_direction();
	
	this.test = function(){
		return "Leaf is working!";
	};
	//so that leaves stay attached to their parents
	this.set_path = function(){
		this.path = "M" + this.x + " " + this.y + "c 0,0 -2.34693,-4.07748 -2.00321,-4.80482 0.34373,-0.72734 2.42296,-7.25683 3.49316,-7.2142 1.0702,0.0426 4.34532,6.67016 4.12005,7.28574 -0.22527,0.61557 -1.52522,4.90962 -2.27264,5.25656 -0.74742,0.34695 -3.11135,0.0247 -3.33736,-0.52328 z";
	};
	
	this.grow = function(sprite){
	    scale_amount = "" + (this.age/5)+1 + "," + (this.age/5)+1;	
	};
	
	this.animate = function(sprite, time){
		this.set_path();
		if(time){
			sprite.animate({path: this.path}, time);
			//sprite.rotate(this.angle);
		}else{
			sprite.animate({path: this.path}, 0);
		}
		sprite.attr({fill: this.color});
	}
	//floating is animated differently
	this.animate_floating = function(sprite){
		sprite.animate({path:this.path, rotation: 10 * wind},4000);
		sprite.attr({fill: this.color});
	};
	


	this.animate_tick = function(sprite,wind, time){
		//this.animate(sprite,time);
	}
	this.tick = function(sprite, wind){
		this.set_path();
		//return "Leaf is working!";
		this.age = this.age + 1;
		if(this.parent.is_dead || this.x < 0 || this. y < 0 || this.x > this.max_x || this.y > this.max_y){
			this.is_dead = true;
		}//end die
		

		
		if(this.y > this.max_y - 85){
			this.on_ground = true;
		}

		
		if(this.parent.is_stasis  ){
			this.is_stasis = true;
		}//end if stasis

		//only grow if you're not floating
		if(!this.is_floating){
			this.grow(sprite);
			//this.animate(sprite, wind);
		}
	};//end tick
}//end Leaf
