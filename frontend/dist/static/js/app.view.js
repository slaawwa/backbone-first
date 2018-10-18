
APP.view.Task = Backbone.View.extend({
    tagName: 'li',
    model: APP.model.Task,

    template: APP.helper.template('taskView'),

    events: {
        'click .deleteBtn': 'deleteTask',
        'click .editBtn': 'editTask',
        'change .taskCompleteEdit': 'statusTask',
        'dblclick .title': 'editTask',
    },

    deleteTask() {

        this.model.destroy()

        return this
    },

    editTask(e) {
        if (e.type === 'click') {

            // location.hash = `task/${this.model.cid}`
            app.url(`task/${this.model.cid}`)
        } else {

            const newTitle = prompt('Як перейменуємо задачу?', this.model.get('title'))
            this.model.set('title', newTitle)
        }

        return this
    },

    statusTask() {

        this.model.set('complete', !this.model.get('complete'))

        return this
    },

    remove() {

        this.$el.remove()

        setTimeout(() => app.url(''), 150)

        return this
    },

    initialize() {
        // this.model.on('change:title', () => {
        this.model.on('change', this.render, this)

        this.model.on('destroy', this.remove, this)

        return this
    },

    render() {

        const isHome = APP.helper.routerIs('home'),
            ctx = Object.assign({isHome}, this.model.toJSON() )

        this.$el.html( this.template( ctx ) )

        return this
    },
})

APP.view.Tasks = Backbone.View.extend({
    tagName: 'ul',

    initialize() {

        app.vent.on('tasksView:show', this.tasksViewShow, this)

        app.vent.on('taskView:show', this.taskViewShow, this)

        this.collection.on('add', this.addOne, this)

        return this
    },

    taskViewShow(id) {

        console.log('taskViewShow:', id)

        const taskView = this.collection._byId[id]

        app.taskView = new APP.view.Task({model: taskView})

        app.html( app.taskView.render().el )

        return this
    },

    tasksViewShow() {

        app.addTask = new APP.view.AddTask({
            collection: this.collection,
        })

        app.html( app.tasksView.render().el, 'append')

        return this
    },

    addOne(task) {

        const taskView = new APP.view.Task({ model: task})

        this.$el.append( taskView.render().el )

        return this
    },

    render() {

        this.$el.empty()

        this.collection.each(this.addOne, this)

        return this
    },
})

APP.view.AddTask = Backbone.View.extend({
    // el: '#addTask',
    template: APP.helper.template('taskHome'),
    events: {
        submit: 'submit',
    },
    submit(e) {

        e.preventDefault()

        const newTitle = $(e.currentTarget).find('input[type=text]').val(),
            priority = $(e.currentTarget).find('input[type=number]').val()

        const newTask = new APP.model.Task({
            title: newTitle,
            priority,
        })

        app.taskCollection.add( newTask )

        console.log('new addTask', newTask)

        return this
    },
    initialize() {

        this.render()

        return this
    },
    render() {

        app.html( this.$el.html( this.template() ) )

        return this
    },
})
