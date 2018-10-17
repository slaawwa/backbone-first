
Object.assign(APP.helper, {
    template: id => {
        return _.template( $(`#${id}`).html() )
    },
})
