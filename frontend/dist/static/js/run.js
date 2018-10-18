
(() => {

    app.taskCollection = new APP.collection.Task((
            localStorage.tasks && JSON.parse(localStorage.tasks)
        ) || []
    )

    app.taskCollection.bind('update change', () => {
        localStorage.tasks = JSON.stringify( app.taskCollection.toJSON() )
    })

    app.tasksView = new APP.view.Tasks({
        collection: app.taskCollection,
    })

    app.setRoutes()

})()
