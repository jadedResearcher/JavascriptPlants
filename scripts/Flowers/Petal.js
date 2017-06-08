//a petal is attached to a flower head. Doesn't really tick

function Petal(x,y,maxx,maxy, parent){
	this.x = x;
	this.y = y;
	this.age = 0;
	this.path = "M" + this.x + " " + this.y + "c 0,0 -2.34693,-4.07748 -2.00321,-4.80482 0.34373,-0.72734 2.42296,-7.25683 3.49316,-7.2142 1.0702,0.0426 4.34532,6.67016 4.12005,7.28574 -0.22527,0.61557 -1.52522,4.90962 -2.27264,5.25656 -0.74742,0.34695 -3.11135,0.0247 -3.33736,-0.52328 z";
	//all petals belonging to the same flower are roughly the same color
	this.red_petal = parent.red_petal;
	this.green_petal = parent.green_petal;
	this.blue_petal = parent.blue_petal;
	shading = parent.shading;
	this.color = "45-rgb(" + this.red_petal + "," + this.green_petal + "," + this.blue_petal+shading;
	this.stroke = '#010';
	this.scale = parent.scale;
	this.parent = parent;
	this.max_x = maxx;
	this.is_dead = false;
	this.on_ground = false;
	this.is_stasis = false;
	this.is_floating = false;
	this.max_y = maxy;
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
		sprite.animate({path: this.path}, time);
		sprite.attr({fill: this.color});
	}
	//floating is animated differently
	this.animate_floating = function(sprite){
		sprite.animate({path:this.path, rotation: 10 * wind},4000);
		sprite.attr({fill: this.color});
	};
	
	this.color_change = function(){
		if(this.red < 215){
		this.red = this.red + Math.random() * 20;
		}
		if(this.green > 10){
		this.green = this.green - Math.random() * 5;
		}

	};//end color change
	
	this.set_color = function(){
		var red = this.red; //goes up with age
		var green = this.green; //goes down with age
		var blue = this.blue;
		
		this.color = "rgb(" + red + "," + green + "," + blue+")";

	}//end set color
	
	this.tick = function(sprite, wind){
	
	};//end tick
	
	this.animate_tick = function(sprite,wind,time){
		//this.animate(sprite,time);
	}
}//end Leaf