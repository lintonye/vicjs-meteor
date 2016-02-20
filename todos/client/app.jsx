
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

var TodoItem = React.createClass({
    getInitialState() {
        return {}
    },

    saveUpdatedTask(name,checked) {
        this.props.updateTask(this.props.task._id,name,checked);
        this.setState(this.getInitialState());
    },

    handleChange(event){
        if (event.target.type === 'checkbox') {
            this.saveUpdatedTask(
                this.state.taskName || this.props.task.name,
                event.target.checked
            );
        }
        else {
            this.setState({taskName: event.target.value})
        }
    },

    onTaskNameKeyPressed(event){
        if (event.charCode === 13)
            this.saveUpdatedTask(
                this.state.taskName || this.props.task.name,
                this.props.task.checked
            );
    },

    render() {
        return (
            <div>
                <input type="checkbox"
                    checked={this.props.task.checked}
                    onChange={this.handleChange}/>
                <input type="textbox"
                    className="todo-item"
                    value={this.state.taskName || this.props.task.name}
                    onKeyPress={this.onTaskNameKeyPressed}
                    onChange={this.handleChange}/>
            </div>
        )
    }
})

var TodoApp = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('tasks');
        return {
            Tasks: Tasks.find().fetch()
        }
    },

    createNewTask(taskName) {
        Meteor.call('createTask', taskName);
    },

    updateTask(id, name, checked) {
        Meteor.call('updateTask', id, name, checked);
    },

    render() {
        let todoItems = this.data.Tasks.map( (task) => <TodoItem key={task._id} task={task} updateTask={this.updateTask}/>);
        return (
            <div>
                <h1>My TODOs</h1>
                <TodoItemCreate onCreateNewTask = {this.createNewTask}/>
                {todoItems}
            </div>
        )
    }
})

Meteor.startup(function () {
    ReactDOM.render(<TodoApp />, document.getElementById("render-target"));
});