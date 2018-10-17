
APP.model.Task = Backbone.Model.extend({
    defaults: {
        title: 'Default task',
        priority: 5,
        complete: false,
    },
    validate(attrs) {
        console.log(' validate')
        if ( ! $.trim( attrs.title ) ) {
            return 'Ім\'я повинно бути валідним('
        }
    }
})
