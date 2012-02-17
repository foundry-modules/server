/*!
 * jquery.server.
 * Extension of jquery.ajax with ability to parse server commands.
 *
 * Copyright (c) 2011 Jason Ramos
 * www.stackideas.com
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

var parser = [];

var defaultOptions = {
	type: 'POST',
	data: {
		tmpl: 'component',
		format: 'ajax',
		no_html: 1
	},
	dataType: 'json'
};

var methods = {
	initialize: function(o) {

		var options = $.extend(true, {}, defaultOptions, o);

		if (!options.url || options.url=='')
			return $.console.error('$.server: Url is invalid.');

		options.success =
			function(commands, textStatus, jqXHR)
			{
				// Restore user-defined success callback
				jqXHR.success = o.success || function(){};
				jqXHR.fail    = o.fail || function(){};

				$.each(commands, function(i, command)
				{
					var nativeParser = parser[command.type],
						customParser = o[command.type];

					if ($.isFunction(nativeParser)) {

						nativeParser.apply(this, [command.data, textStatus, jqXHR]);

					} else if ($.isFunction(customParser)) {

						customParser.apply(this, command.data);
					}
				});
			};

		return $.ajax(options);
	},

	parser: function(type, func)
	{
		if ($.isFunction(func))
			parser[type] = func;
	},

	removeParser: function(type)
	{
		delete parser[type];
	}
}

/**
* Native $.server command parsers
*/
parser['script'] =
	function(data)
	{
		if (typeof data[0] == 'string')
		{
			try { eval(data[0]) } catch(err) {};
			return;
		}

		/**
		* Execute each method and assign returned object back to the chain.
		*
		* Foundry().attr('checked', true);
		* 	is equivalent to:
		* window['Foundry']('.element')[attr]('checked', true);
		*/
		var chain = window, chainBroken = false;

		$.each(data, function(i, chainer)
		{
			try {
				switch(chainer.type)
				{
					case 'get':
						chain = chain[chainer.property];
						break;

					case 'set':
						chain[chainer.property] = chainer.value;
						chainBroken=true;
						break;

					case 'call':
						chain = chain[chainer.method].apply(chain, chainer.args);
						break;
				}
			} catch(err) {
				chainBroken = true;
			}
		});
	};

parser['success'] =
	function(data, textStatus, jqXHR)
	{
		jqXHR.success.apply(this, data);
	};

parser['fail'] =
	function(data, textStatus, jqXHR)
	{
		jqXHR.fail.apply(this, data);
	};

$.server = function(method) {
	if ( methods[method] ) {
		return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.initialize.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on $.server' );
	}
}
