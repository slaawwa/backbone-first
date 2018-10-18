
Object.assign(APP.helper, {
    $page: $('#page'),
    routerIs: page => {
        const key = Backbone.history.getFragment()
        return app.router.routes[key] === page
    },
    template: id => {
        return _.template( $(`#${id}`).html() )
    },
})
