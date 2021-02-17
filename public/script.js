let queueLength = 0;
const socket = io();

socket.on('userCount', (data) => {
    console.log(data);
});

socket.on('msg', (msg) => {
    showMessages(msg);
});

socket.on('vid', (vid) => {
    addOneVid(vid);

    queueLength++;
    document.getElementById('queueLength').innerHTML = queueLength;
});

$(document).ready(async function(){
    const data = await $.getJSON('/queue/api');
    console.log(data);
    showQueue(data.vids);
    queueLength = data.vids.length;
    document.getElementById('queueLength').innerHTML = queueLength;
    

    $('#vidQueue').on('click', '#deleteButton', function(){
        deleteVid($(this).parent());
        queueLength = queueLength - 1;
        document.getElementById('queueLength').innerHTML = queueLength;
    });
});

const showQueue = (vids) => {
    for (vid of vids) {
        let elem = $(`
        <li id="${vid.id}">
        <button id="deleteButton" type="button">X</button>
            <h2>${vid.title}</h2>
            <a href="${vid.link}" target="_blank">
            <img src="${vid.thumbnail}" alt="${vid.title}">
            </a>
            <p>Linked by: ${vid.user}</p>
        </li>`);

        $('#vidQueue').append(elem);
    }
}

const addOneVid = (vid) => {
    let elem = $(`
    <li id="${vid.id}">
    <button id="deleteButton" type="button">X</button>
        <h2>${vid.title}</h2>
        <a href="${vid.link}" target="_blank">
        <img src="${vid.thumbnail}" alt="${vid.title}">
        </a>
        <p>Linked by: ${vid.user}</p>
    </li>`);

    $('#vidQueue').append(elem);
}

const showMessages = (msg) => {
    let elem = $(`<li><p><span style="color: ${msg.color};">${msg.user}</span> - ${msg.message}</p></li>`);
    $('#chat').append(elem);
}

async function deleteVid(elem) {
    const deleteVid = await $.ajax({
        type: 'DELETE',
        url: `/queue/api/${elem[0].id}`,
    });
    elem.remove();
}