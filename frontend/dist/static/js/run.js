
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

    // $(document.body).append( app.tasksView.render().el )

    // app.addTask = new APP.view.AddTask({
    //     collection: app.taskCollection,
    // });

    app.setRoutes()

})()
