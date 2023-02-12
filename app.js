var coursesApi = 'http://localhost:3000/courses'

function start() {
    getCourses(renderCourses)
    handleCreateForm()
}

start()

function getCourses(callback) {
    fetch(coursesApi)
        .then(function(response) {
            return response.json()
        })
        .then(callback)
}

function renderCourses(courses) {
    var listCoursesBlock = document.querySelector('#list-courses')
    var htmls = courses.map(function(course) {
        return `
            <li class="course-item-${course.id}">
                <h4>${course.name}</h4>
                <p>${course.description}</p>
                <button onclick="handleDeleteCourse(${course.id})">Delete</button>
                <button onclick="handleEditCourse(${course.id})">Edit</button>
            </li>
        `
    })
    listCoursesBlock.innerHTML = htmls.join('')
}

function createCourses(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(coursesApi, options)
        .then(function(response) {
            return response.json()
        })
        .then(callback)
}

function handleEditCourse(id) {
    var courseItem = document.querySelector('.course-item-' + id)
    if(courseItem) {
        var createBtn = document.querySelector('#create')
        var saveBtn = document.querySelector('#save')

        createBtn.style.display = 'none'
        saveBtn.style.display = 'block'

        var inputNameElement = document.querySelector('input[name="name"]')
        var inputDescriptionElement = document.querySelector('input[name="description"]')

        var currentName = courseItem.querySelector('h4').textContent
        var currentDescription = courseItem.querySelector('p').textContent

        
        inputNameElement.value = currentName
        inputDescriptionElement.value = currentDescription
        
        console.log(inputNameElement.value)

        saveBtn.onclick = function() {

            var newName = inputNameElement.value
            var newDescription = inputDescriptionElement.value

            inputNameElement.onchange = function(e) {
                newName = e.target.value
            }
            inputDescriptionElement.onchange = function(e) {
                newDescription = e.target.value
            }

            var formData = {
                name: newName,
                description: newDescription
            }

            saveBtn.style.display = 'none'
            createBtn.style.display = 'block'
            
            handleSaveForm(id, formData, function() {
                getCourses(renderCourses)
            })
        } 
    }
}

function handleSaveForm(id, data, callback) {
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(coursesApi + '/' + id, options)
        .then(function(response) {
            return response.json()
        })
        .then(callback)
}

function handleDeleteCourse(id) {
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(coursesApi + '/' + id, options)
        .then(function(response) {
            return response.json()
        })
        .then(function() {
            var courseItem = document.querySelector('.course-item-' + id)
            if(courseItem) {
                courseItem.remove()
            }
        })
}

function handleCreateForm() {
    var createBtn = document.querySelector('#create')

    createBtn.onclick = function() {
        var name = document.querySelector('input[name="name"]').value
        var description = document.querySelector('input[name="description"]').value

        var formData = {
            name: name,
            description: description
        }

        createCourses(formData, function() {
            getCourses(renderCourses)
        })
    }
}
