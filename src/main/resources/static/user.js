const URLCurrentUser = 'http://localhost:8080/user/currentUser/';
const userHeader = document.getElementById('userHeader');
const userTable = document.getElementById('userTable');

function currentUser() {
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
            userTable.innerHTML = table;
            userHeader.innerHTML =
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

currentUser()

function rolesString(roles) {
    let rolesString = '';
    for (let element of roles) {
        rolesString += (element.role.toString().replace('ROLE_', '') + ', ');
    }
    rolesString = rolesString.substring(0, rolesString.length - 2);
    return rolesString;
}