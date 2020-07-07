// <![CDATA[
// For a full list of font names you can use, visit http://www.google.com/webfonts or use the dCodes font styler for real-time previews.  (dcodes -> Format -> Google Web Fonts)
var elements_heading_font_style = '.logo, h1, h2, h3, h4, h5, h6, .btn, .h2_href_fr a, .note p',
	header_google_font = 'PT+Sans',     //google name of font('Trebuchet+MS')
	header_font_style = 'PT Sans';       //full name of font  ('Trebuchet MS')
	
function get_header_html_text() {
	var html_text = '<link href="https://fonts.googleapis.com/css?family='+header_google_font+'" type="text/css" rel="stylesheet">'+
	'\n<style>'+ 
	'\n'+elements_heading_font_style+' { font-family:"'+header_font_style+'", "Lato", "Trebuchet MS", Arial, "Helvetica CY", "Nimbus Sans L", sans-serif; }'+
	'\n</style>';
	return (html_text);
}

document.writeln(get_header_html_text());

// ]]>

