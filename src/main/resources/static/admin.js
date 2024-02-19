// currentAdmin
const URLCurrentUser = 'http://localhost:8080/admin/currentUser';
let adminHeader = document.getElementById('adminHeader');
let adminTable = document.getElementById('adminTable');

function currentAdmin() {
    fetch(URLCurrentUser)
        .then((response) => response.json())
        .then((user) => {

            let roles = rolesString(user.roles);
            let table = '';

            table += `<tr>
            <td>${user.id}</td>
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.age}</td>
            <td>${user.username}</td>
            <td>${roles}</td>
            </tr>`;
            adminTable.innerHTML = table;
            adminHeader.innerHTML =
                `<span class="text-white" style="padding-right: 0;margin: 5px 10px;">
                 ${user.username}
                 </span>
                 <span class="text-white" style="margin: 5px;">
                 with roles:
                 </span>
                 <span class="text-white" style="margin: 5px;">
                 ${roles}
                 </span>`;
        });
}

currentAdmin()

window.addEventListener(`load`, () => {
    setInterval(currentAdmin, 3000);
});

function rolesString(roles) {
    let rolesString = '';
    for (const role of roles) {
        rolesString += (role.role.toString().replace('ROLE_', '') + ', ');
    }
    rolesString = rolesString.substring(0, rolesString.length - 2);
    return rolesString;
}

async function getUserById(id) {
    let response = await fetch("http://localhost:8080/admin/listUsers/" + id);
    return await response.json();
}
// currentAdmin

// modal
async function openModal(form, modal, id) {
    modal.show();
    let user = await getUserById(id);
    form.id.value = user.id;
    form.firstname.value = user.firstname;
    form.lastname.value = user.lastname;
    form.age.value = user.age;
    form.username.value = user.username;
    form.password.value = "";
    form.roles.value = user.roles;
}
// modal

// admin panel
const URLAdminPanel = 'http://localhost:8080/admin/listUsers/';

function adminPanel() {
    fetch(URLAdminPanel)
        .then(function (response) {
            return response.json();
        })
        .then(function (users) {
            let table = '';
            let roles = '';

            const tableUsers = document.getElementById('tableUsers');

            for (let user of users) {

                roles = rolesString(user.roles);

                table += `<tr>
                        <td>${user.id}</td>
                        <td>${user.firstname}</td>
                        <td>${user.lastname}</td>
                        <td>${user.age}</td>
                        <td>${user.username}</td>
                        <td>${roles}</td>


                        <td>
                          <button type="button"
                          class="btn btn-success"
                          data-bs-toogle="modal"
                          data-bs-target="#updateModal"
                          onclick="updateModal(${user.id})">
                                Edit
                            </button>
                        </td>


                        <td>
                            <button type="button" 
                            class="btn btn-danger" 
                            data-toggle="modal" 
                            data-target="#deleteModal" 
                            onclick="deleteModal(${user.id})">
                                Delete
                            </button>
                        </td>
                    </tr>`;
            }
            tableUsers.innerHTML = table;
        })
}

adminPanel();
// admin panel

// add user
let formAdd = document.forms["addUser"];

addUser();

function addUser() {
    formAdd.addEventListener("submit", event => {
        event.preventDefault();

        let roles = [];
        for (let i = 0; i < formAdd.roles.options.length; i++) {
            if (formAdd.roles.options[i].selected)
                roles.push({
                    id: formAdd.roles.options[i].value,
                    role: "ROLE_" + formAdd.roles.options[i].text
                });
        }

        fetch("http://localhost:8080/admin/listUsers/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: formAdd.firstname.value,
                lastname: formAdd.lastname.value,
                age: formAdd.age.value,
                username: formAdd.username.value,
                password: formAdd.password.value,
                roles: roles
            })
        }).then(() => {
            formAdd.reset();
            adminPanel();
            $('#usersTable').click(); //клик по кнопке Users Table

        });
    });
}

function addRoles() {
    let addRoles = document.getElementById("add-roles");
    addRoles.innerHTML = "";
    fetch("http://localhost:8080/admin/listRoles")
        .then(res => res.json())
        .then(data => {
            data.forEach(role => {
                let option = document.createElement("option");
                option.value = role.id;
                option.text = role.role.toString().replace('ROLE_', '');
                addRoles.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

window.addEventListener("load", addRoles);
// add user

// update user
let formUpdate = document.forms["formUpdate"];

updateUser();

const URLUpdate = "http://localhost:8080/admin/listUsers/";

async function updateModal(id) {
    const updateModal = new bootstrap.Modal(document.querySelector('#updateModal'));
    await openModal(formUpdate, updateModal, id);
    updateRoles();
}

function updateUser() {
    formUpdate.addEventListener("submit", event => {
        event.preventDefault();
        let roles = [];
        for (let i = 0; i < formUpdate.roles.options.length; i++) {
            if (formUpdate.roles.options[i].selected) roles.push({
                id: formUpdate.roles.options[i].value,
                role: "ROLE_" + formUpdate.roles.options[i].text
            });
        }
        fetch(URLUpdate + formUpdate.id.value, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: formUpdate.id.value,
                firstname: formUpdate.firstname.value,
                lastname: formUpdate.lastname.value,
                age: formUpdate.age.value,
                username: formUpdate.username.value,
                password: formUpdate.password.value,
                roles: roles
            })
        }).then(() => {
            $('#updateClose').click();
            adminPanel();
        });
    });
}

function updateRoles() {
    let update = document.getElementById("update-roles");
    update.innerHTML = "";

    fetch("http://localhost:8080/admin/listRoles")
        .then(response => response.json())
        .then(data => {
            data.forEach(role => {
                let option = document.createElement("option");
                option.value = role.id;
                option.text = role.role.toString().replace('ROLE_', '');
                update.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

window.addEventListener("load", updateRoles);
// update user

// delete user
let formDelete = document.forms["formDelete"]
deleteUser();

async function deleteModal(id) {
    const deleteModal = new bootstrap.Modal(document.querySelector('#deleteModal'));
    await openModal(formDelete, deleteModal, id);
    deleteRoles();
}

function deleteUser() {
    formDelete.addEventListener("submit", event => {
        event.preventDefault();
        fetch("http://localhost:8080/admin/listUsers/" + formDelete.id.value, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            $('#deleteClose').click();
            adminPanel();
        });
    });
}

function deleteRoles() {
    let deleteRoles = document.getElementById("delete-roles");
    deleteRoles.innerHTML = "";
    fetch("http://localhost:8080/admin/listRoles")
        .then(response => response.json())
        .then(data => {
            data.forEach(role => {
                let option = document.createElement("option");
                option.value = role.id;
                option.text = role.role.toString().replace('ROLE_', '');
                deleteRoles.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

window.addEventListener("load", deleteRoles);
//delete user
