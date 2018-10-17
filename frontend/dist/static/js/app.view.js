
APP.view.Task = Backbone.View.extend({
    tagName: 'li',
    model: APP.model.Task,

    template: APP.helper.template('taskView'),

    events: {
        'click .deleteBtn': 'deleteTask',
        'click .editBtn': 'editTask',
        'click .statusBtn': 'statusTask',
    },

    deleteTask() {

        this.model.destroy()

        return this
    },

    editTask() {

        const newTitle = prompt('Як перейменуємо задачу?', this.model.get('title'))

        this.model.set('title', newTitle, {validate: true})

        return this
    },

    statusTask() {

        this.model.set('complete', !this.model.get('complete'), {validate: true})

        return this
    },

    remove() {

        this.$el.remove()

        return this
    },

    initialize() {
        // this.model.on('change:title', () => {
        this.model.on('change', this.render, this)

        this.model.on('destroy', this.remove, this)

        return this
    },

    render() {
        this.$el.html( this.template( this.model.toJSON() ) )

        return this
    },
})

APP.view.Tasks = Backbone.View.extend({
    tagName: 'ul',

    initialize() {

        app.vent.on('taskView:show', this.taskViewShow, this)

        this.collection.on('add', this.addOne, this)

        return this
    },

    taskViewShow(id) {

        console.log('taskViewShow:', id)

        return this
    },

    addOne(task) {

        const taskView = new APP.view.Task({ model: task})

        this.$el.append( taskView.render().el )

        return this
    },

    render() {

        this.collection.each(this.addOne, this)

        return this
    },
})

APP.view.AddTask = Backbone.View.extend({
    el: '#addTask',
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
        return this
    },
})
