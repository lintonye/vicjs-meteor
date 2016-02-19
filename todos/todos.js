Tasks = new Mongo.Collection('tasks')

if (Meteor.isClient) {
  Meteor.subscribe('tasks')

  Template.todos.helpers({
    tasks() {
      return Tasks.find().fetch();
    }
  })

  Template.todos.events({
    'submit form#createTask': function(e) {
      e.preventDefault()
      Meteor.call('createTask', e.target.newtask.value)
      e.target.newtask.value = null
    },
    'blur input.todo-item': function(e) {
      Meteor.call('updateTask', e.target.attributes['task-id'].value, e.target.value);
    }
  })
}

if (Meteor.isServer) {
  Meteor.publish('tasks', ()=>{
    return Tasks.find({}, {$sort: {timestamp: 1}});
  });

  Meteor.methods({
    createTask(taskName) {
      Tasks.insert({name: taskName, timestamp: new Date().valueOf()})
    },
    updateTask(id, taskName) {
      console.log(id, taskName);
      Tasks.update({_id: id}, {$set: {name: taskName}})
    }
  })
}
