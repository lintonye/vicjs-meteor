
var TodoItemCreate = React.createClass({
    getInitialState() {
        return {
            newTaskName: ''
        }
    },

    onTaskNameChange(event) {
        this.setState({
            newTaskName: event.target.value
        })
    },

    onSubmit(event) {
        event.preventDefault();
        this.props.onCreateNewTask(this.state.newTaskName);
        this.setState(this.getInitialState());
    },

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <input type="textbox" value={this.state.newTaskName} onChange={this.onTaskNameChange}/>
            </form>
        )
    }
})

var TodoItemList = React.createClass({
    onTaskNameChange(event) {
        let task_id = event.target.attributes["data-task-id"].value;
        let task_name = event.target.value;
        this.props.updateTaskName(task_id, task_name);
    },

    onTaskStatusChange(event) {
        let task_id = event.target.attributes["data-task-id"].value;
        let task_checked = event.target.checked;
        this.props.updateTaskStatus(task_id, task_name);
    },

    onTaskNameKeyPressed(event) {
        if (event.keyCode == 13) {
            let task_id = event.target.attributes["data-task-id"].value;
            this.props.saveUpdatedTask(task_id);
        }
    },

    render() {
        let todoItems = this.props.TodoItems.map( (todoItem) =>
            <div key={todoItem._id}>
                <input type="checkbox" data-task-id={todoItem._id} checked={todoItem.checked} onChange={this.onTaskStatusChange}/>
                <input type="textbox" data-task-id={todoItem._id}
                    className="todo-item"
                    value={todoItem.name}
                    onKeyPress={this.onTaskNameKeyPressed}
                    onChange={this.onTaskNameChange}/>
            </div>);

        return (
            <div>{todoItems}</div>
        )
    }
})

var TodoApp = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('tasks');
        return {
            TodoItems: Tasks.find().fetch()
        }
    },

    createNewTask(taskName) {
        Meteor.call('createTask', taskName);
    },

    saveUpdatedTask(task_id) {
        let task = Tasks.findOne({_id,task_id});
        if (task) {
            Meteor.call('updateTask', task_id, task.name, task.checked);
        }
    },

    updateTaskName(task_id, task_name) {
        Tasks.update({_id: task_id}, {$set:{name:task_name}});
    },

    updateTaskStatus(task_id, task_status) {
        Tasks.update({_id: task_id}, {$set:{checked:task_status}});
    },

    render() {
        return (
            <div>
                <h1>My TODOs</h1>
                <TodoItemCreate onCreateNewTask = {this.createNewTask}/>
                <TodoItemList TodoItems = {this.data.TodoItems}
                    updateTaskName = {this.updateTaskName}
                    updateTaskStatus = {this.updateTaskStatus}
                    saveUpdatedTask = {this.saveUpdatedTask}
                />
            </div>
        )
    }
})



Meteor.startup(function () {
    ReactDOM.render(<TodoApp />, document.getElementById("render-target"));
});