( function ( mw ) {

// exit if already defined
if ( mw.PluginManager ) {
	return ;
}

mw.PluginManager = {

	// Holds our plugins classes
	registerdPlugins: {},
	totalPlugins: 0,
	initialisedPlugins: 0,

	// Register a new Plugin
	define: function ( pluginName, pluginClass ) {
		if ( this.registerdPlugins[ pluginName ] ) {
			mw.log( 'PluginManager::register: Plugin "' + pluginName + '" already registered.' );
			return;
		}

		this.registerdPlugins[ pluginName ] = pluginClass;
		this.totalPlugins++;
	},
	getClass: function ( pluginName ) {
		if ( !this.registerdPlugins[ pluginName ] ) {
			mw.log( 'PluginManager::getClass: Plugin "' + pluginName + '" not registered.' );
			return false;
		}
		return this.registerdPlugins[ pluginName ];
	},
	make: function ( pluginName, embedPlayer, callback  ) {
		var PluginClass = this.getClass( pluginName );
		return ( PluginClass ) ? new PluginClass( embedPlayer, callback, pluginName ) : false;
	},
	registerLoader: function ( pluginName ) {
		if ( !this.registerdPlugins[ pluginName ] ) {
			mw.log( 'PluginManager::init: Plugin "' + pluginName + '" not registered.' );
			return;
		}
		var _this = this;
		mw.addKalturaPlugin( pluginName, function ( embedPlayer, callback ) {
			// Check if plugin initialise
			if ( embedPlayer.plugins[ pluginName ] ) {
				//mw.log('PluginManager::init: Plugin "' + pluginName + '" already initialised.');
				callback();
				return;
			}
			embedPlayer.plugins[ pluginName ] = _this.make( pluginName, embedPlayer, callback );
			_this.initialisedPlugins++;
			if ( _this.totalPlugins === _this.initialisedPlugins ) {
				embedPlayer.triggerHelper( 'pluginsReady', embedPlayer.plugins );
			}
		} );
		return this;
	},
	add: function ( pluginName, pluginClass ) {
		this.define( pluginName, pluginClass );
		this.registerLoader( pluginName );
	}
};

} )( mediaWiki );
