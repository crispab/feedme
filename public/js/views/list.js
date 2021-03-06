/*global define */
(function() {
	"use strict";
	define([
		'jquery',
		'underscore',
		'backbone',
		'models/shopping-list',
		'text!templates/list-instance-template.html',
		'text!templates/item-template.html',
		'jqueryui'
	], function($, _, Backbone, ShoppingList, instanceTemplate, itemTemplate) {

		var ListView = Backbone.View.extend({
			el:'#main',

			initialize: function() {
				console.log('ListView.initialize()');
				var that = this;
				this.list = new ShoppingList();
				this.list.on("load", function() {
					that.render();
				});
				this.template = _.template(instanceTemplate);
				this.itemTemplate = _.template(itemTemplate);
			},

			events:{
				'click #addNewShoppingItem':'addNew'
			},

			selectItem:function(id) {
				var that = this;
				this.list.set('_id', id);
				this.list.fetch({success: function() {
					that.list.trigger('load');
				}});
			},

			addNew: function(event) {
				console.log('Add new item');
				event.preventDefault();
				var shoppingList = this.$el.find('#aShoppingList'), target = shoppingList.parent().find('input'), val = target.val();
				this.list.get('items').push({name:val});
				shoppingList.append(this.itemTemplate({item:{name:val}}));
				this.list.save({}, {success:function(data) {
					console.log('list saved!');
				}});
				target.val('');
			},

			render: function() {
				var that = this;
				this.$el.html(this.template({list:this.list.toJSON()}));
				this.$el.find('ul').sortable({
					axis: 'y',
					containment:'parent',
					update:function() {
						var lis = $(this).find('li');
						console.log('list updated!');
						$.each(that.list.get('items'), function(index, item) {
							item.name = $(lis[index]).text();
						});
						that.list.save();
					}
				});
			}
		});

		return ListView;
	});
}());