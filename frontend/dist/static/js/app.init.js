
window.app = {
    vent: _.extend({}, Backbone.Events),
    setRoutes: () => {

        app.router = new APP.router()

        Backbone.history.start()
    },
}

window.APP = {
    app,
    helper: {},
    model: {},
    collection: {},
    view: {},
    router: Backbone.Router.extend({
        routes: {
            '': 'home',
            'task/:id': 'taskView',
            '*other': 'other',
        },
        home() {
            console.log('INDEX')
        },
        taskView(id) {
            console.log('taskView:', id)
            app.vent.trigger('taskView:show', id)
        },
        other(other) {
            console.log('other:', other)
        },
    }),
}

app.APP = APP

