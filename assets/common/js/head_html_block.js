// <![CDATA[



var kind;
kind = 'HTML';

function get_header_html_text() {
	var html_text='';
	if (kind == 'HTML') {
		
		var sidePositionPanel = 'left',
			//logo_style
			elements_body = 'body',
			elements_logo_style = '.logo, .logo span, .logo a',
			elements_heading_font_style = '.logo, h1, h2, h3, h4, h5, h6, .btn, .h2_href_fr a, .note p',
			elements_h1_style = 'h1, h1 a',
			elements_h2_style = 'h2, h2 span, h2 a',
			elements_h3_style = 'h3, h3 span, h3 a',
			elements_content_style = "body, code, input[type='text'], textarea",
			elements_content_href_style = 'a',
			elements_background_style = '.body_pattern',
			st_logo_font_color="#ffffff",
			st_logo_font_size="48",
			//headers_style
			h1_font_color="#e93232",
			h1_font_size="30",
			h2_font_color="#default",
			h2_font_size="18",
			h3_font_color="#fff",
			h3_font_size="14",
			// global style
			content_font_style="Arial",
			content_font_size="12",
			content_line_spacing='1.5', // em
			content_font_color="#default",
			content_links_font_color="#default",
			//background style
			background_color="#fff",
			background_img="bg_20_sm.jpg",
			background_Full_Image = "none",
			background_rep = "repeat",
			background_Image_Size = "auto auto",
			background_Image,
			background_Other = true; // false
			
		if (background_img == "") {
			background_Image= "none";
		} else if (background_Full_Image == '') {
			background_Image="http://cdn.dcodes.net/backgrounds/u_background/"+background_img;
		} else if (background_Other) {
			background_Image="http://cdn.dcodes.net/backgrounds/u_background/"+background_img;
		} else {
			background_Image="box_setting/images/bg_images/"+background_img;
		}
		
		var box_options = {
			// header style settings
			sidePositionPanel: 				sidePositionPanel,
			elements_heading_font_style: 	elements_heading_font_style,
			elements_body: 					elements_body,
			elements_logo_style: 			elements_logo_style,
			elements_h1_style: 				elements_h1_style,
			elements_h2_style: 				elements_h2_style,
			elements_h3_style: 				elements_h3_style,
			elements_content_style: 		elements_content_style,
			elements_content_href_style: 	elements_content_href_style,
			elements_background_style: 		elements_background_style,
			header_google_font: 			header_google_font,
			header_font_style: 				header_font_style,
			st_logo_font_color: 			st_logo_font_color,
			st_logo_font_size: 				st_logo_font_size,
			h1_font_color: 					h1_font_color,
			h1_font_size: 					h1_font_size,
			h2_font_color: 					h2_font_color,
			h2_font_size: 					h2_font_size,
			h3_font_color: 					h3_font_color,
			h3_font_size: 					h3_font_size,
			content_font_style: 			content_font_style,
			body_font_size: 				content_font_size,
			body_line_spacing: 				content_line_spacing, // em
			body_font_color: 				content_font_color,
			body_links_font_color: 			content_links_font_color,
			background_overlay: 			"0.0",
			background_color: 				background_color,
			background_Image: 				background_Image,
			background_Full_Image: 			background_Full_Image,
			background_Image_Size: 			background_Image_Size,
			background_Image_Repeat: 		background_rep
			//background_Image: 			"none"
		}			
		
		function loadScripts(array,callback){  
			var loader = function(src,handler){  
				var script = document.createElement("script");  
				script.src = src;
				script.onload = script.onreadystatechange = function(){  
				  script.onreadystatechange = script.onload = null;  
				  if(/MSIE ([6-9]+\.\d+);/.test(navigator.userAgent))window.setTimeout(function(){handler();},10,this);  
				  else handler();  
				}  
				var head = document.getElementsByTagName("head")[0];  
				(head || document.body).appendChild( script );  
			};  
			(function(){  
				if(array.length!=0){  
					loader(array.shift(),arguments.callee);  
				}else{  
					callback && callback();  
				}  
			})();  
		}
	}
}

get_header_html_text();



function get_img_old(width,height,index,object)  {
	var big_width=width*2,
		big_height=height*2;
	if (big_width>800) {big_width=800;}
	if (big_height>600) {big_height=600;}
	
	//http://cdn.pimg.co/p/800x600/111111
	var obj_src  = 'http://cdn.pimg.co/p/'+width+'x'+height+'/'+index+index+index,
		parent_href = 'http://cdn.pimg.co/p/'+big_width+'x'+big_height+''+'/'+index+index+index,
		alt='img';
	
	if (kind == 'HTML') {
		//var category='beauty',prefics='b';
		var category='animals',prefics='an';
		if (index==10||index==11||index==12||index==13||index==14) {category = 'buildings';prefics = 'bd';}
		if (index==15||index==16||index==17||index==18||index==19) {category = 'nature';prefics = 'n';}
		if (index==20||index==21||index==22||index==23||index==24) {category = 'abstract';prefics = 'a';}
		if (index==25||index==26||index==27||index==28||index==29) {category = 'animals';prefics = 'an';}
		if (index==30||index==31||index==32||index==33||index==34) {category = 'people';prefics = 'p';}
		//if (index==35||index==36||index==37||index==38||index==39) {category = 'people';prefics = 'p';}
		//if (index==30||index==31||index==32||index==33||index==34) {category = 'animals';prefics = 'an';}
		if (index==35||index==36||index==37||index==38||index==39) {category = 'animals';prefics = 'an';}
		
		alt = category+'/img-'+index;
		//http://pimg.co/s/b/15/1000/800/c
		//http://pimg.co/s/category/index/wieghtxheight/allign
		obj_src = "http://pimg.co/s/"+prefics+"/"+index+"/"+width+"x"+height+"/c";
		parent_href = "http://pimg.co/s/"+prefics+"/"+index+"/"+big_width+"x"+big_height+"/c"; 
	}
	
	object.width = width;
	object.height = height;
	if (object.alt == '') {object.alt = alt;}
	
	object.src = obj_src;
	object.setAttribute("onload", " ");
	
	if ((object.parentNode.className=='prettyPhoto') || (object.parentNode.className=='prettyPhoto preloader')) {
		object.parentNode.href=parent_href;
	}
}

function SetTestImgById(ObgId,width,height,index) {
	var NowObj = document.getElementById(ObgId);
	if (NowObj != null) {
		get_img(width,height,index,NowObj);
	}
}
// ]]>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       