const run = () => {
    if (window.event.keyCode == 13) {
        if ($('#send input').val() == '') return;
        eval(editor.getValue());
        $('#reply').append(`
            <p class="author">나</p>
            <p class="content">${$('#send input').val()}</p>
            <p></p>
        `);
        execute($('#send input').val());
        $('#send input').val('');
        $("#player").scrollTop($("#player")[0].scrollHeight);
    };
};

const execute = (message) => {
    if (bot[message] == undefined) return;
    eval(bot[message]());
};

const comment = (message) => {
    $('#reply').append(`
        <p class="author">봇</p>
        <p class="content">${message}</p>
        <p></p>
    `)
    $("#player").scrollTop($("#player")[0].scrollHeight);
};

const compiler = () => {
    writedCode = editor.getValue();
    eval(writedCode);
    let keys = [];
    let f;
    let top = `
    let lastID = '';
    let text;
    let id;
    let botName = 'bot';
    let like;
    let owner;
    let created;
    alert('BOT - 실행됨');
    const comment = (a) => {
      $.ajax({
        url: '/api/comment',
        dataType: 'json',
        type: 'POST',
        data: {
          content: a,
          target: id,
          targetSubject: 'discuss',
          targetType: 'individual'
        }
      });
    }
    const write = (a, b, c) => {
      $.ajax({
        url: './api/discuss/',
        type: 'POST',
        data: {
          content: a,
          title: b,
          groupNotice: false,
          images: [],
          category: c
        }
      });
    }
    setInterval(() => {
      $.get('https://playentry.org/api/discuss/find?category=free', d => {
        text = d.data[0].title;
        id = d.data[0]._id;
        like = d.data[0].likesLength;
        owner = d.data[0].owner;
        created = d.data[0].created;
      })
      if (id != lastID) {
        lastID = id;
        run();
      }
    }, 220);
    const run = () => {`;
    let bottom = '}'
    for (let k in bot) keys.push(k);
    for (let i in keys) {
        f = bot[keys[i]];
        top += `
        if (text == '${keys[i]}') {
            (${f.toString()})();
        }`
    };
    result = top + bottom;
    console.log(result);
}

let bot, writedCode, result;

$('#runButton').click(() => {
    run();
});

$('#copy-url').click(() => {
    compiler();
    editor.setValue(js_beautify(result));
});

$('#code').val(`bot = {
    "안녕, 세계!": () => {
        comment('Hello, world!');
    }
};`)



let editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    lineWrapping: true,
    theme: 'ayu-mirage',
    val: $('#code').val(),
    matchBrackets: true,
    styleActiveLine: true,
});
