#Tyto Leaflet

A plugin for the [Tyto Framework](http://tyto.io) to easily include leaflet.js maps in your app.
####This plugin is included with Tyto by default

##Installation
clone the repository into your plugins directory in `app/plugins/` or download the zip file, unpack it and place into the plugins folder.

Then open your application's config file in `app/config.js` and add 'tyto-leaflet' or 'tyto-leaflet-master', this must match the folder name, to the plugins array.

#####note: if the folder name is anything other than tyto-leaflet, then you must edit the config.js in the leaflet plugin folder and change the extName variable to match the folder name.

##Usage
Simply use the `<leaflet></leaflet>` tag in your view to display a map with the default settings. To view more options view the original directive page at [http://tombatossals.github.io/angular-leaflet-directive/](http://tombatossals.github.io/angular-leaflet-directive/).

Remember to give the element a specified height in order to see the map.

CSS:

	.angular-leaflet-map{
		height: 300px;
	}
