
APP.model.Task = (() => {

    const set = Backbone.Model.prototype.set;
    Backbone.Model.prototype.set = function(key, val, options) {
      return set.call(this, key, val, _.extend({validate: true}, options));
    }

    return Backbone.Model.extend({
        defaults: {
            title: 'Default task',
            priority: 5,
            complete: false,
        },
        validate(attrs) {
            if ( !attrs.id ) {
                attrs.id = +Math.random().toString().replace('0.', '')
            }
            if ( ! $.trim( attrs.title ) ) {
                return 'Ім\'я повинно бути валідним('
            }
        }
    })
})();
