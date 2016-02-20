Tasks = new Mongo.Collection('tasks')

if (Meteor.isClient) {
  //Meteor.subscribe('tasks')

  //Template.todos.helpers({
  //  tasks() {
  //    return Tasks.find().fetch();
  //  }
  //})
  //
  //Template.todos.events({
  //  'submit form#createTask': function(e) {
  //    e.preventDefault()
  //    Meteor.call('createTask', e.target.newtask.value)
  //    e.target.newtask.value = null
  //  },
  //  'keypress input.todo-item': function(e) {
  //    if (e.keyCode == 13) {
  //      let taskId = e.target.attributes['task-id'].value
  //      Meteor.call('updateTask', taskId, e.target.value)
  //      e.target.blur()
  //    }
  //  }
  //})
}

if (Meteor.isServer) {
  Meteor.publish('tasks', ()=>{
    return Tasks.find({}, {$sort: {timestamp: 1}});
  });

  Meteor.methods({
    createTask(taskName) {
      Tasks.insert({name: taskName, checked: false, timestamp: new Date().valueOf()})
    },

    updateTask(id, taskName, checked) {
      console.log(id, taskName);
      Tasks.update({_id: id}, {$set: {name: taskName, checked}})
    }
  })
}
