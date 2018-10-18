
window.app = {
    vent: _.extend({}, Backbone.Events),
    html: (html, method='html') => {
        return APP.helper.$page[method]( html )
    },
    setRoutes: () => {

        app.router = new app.APP.router()

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
            app.vent.trigger('tasksView:show')
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

