Tasks = new Mongo.Collection('tasks')

if (Meteor.isClient) {
}

if (Meteor.isServer) {
  Meteor.publish('tasks', ()=>{
    return Tasks.find({}, {$sort: {timestamp: 1}});
  });

  Meteor.methods({
    createTask(taskName) {
      Tasks.insert({name: taskName, checked: false, timestamp: new Date().valueOf()})
    },

    updateTask(id, taskName) {
      console.log(id, taskName);
      Tasks.update({_id: id}, {$set: {name: taskName}})
    }
  })
}
