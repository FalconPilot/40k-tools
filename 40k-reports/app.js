/*
**  Instance variables
*/

let current_view;
let current_file;
let text_list;

/*
**  Initialize
*/

document.addEventListener("DOMContentLoaded", function() {
  let container = document.getElementById('list');
  $.ajax({
    url: "./documents",
    type: "GET",
    success: function(data) {
      let list = $(data).find("a:contains('doc$')");
      appendData(list, container, 0);
    }
  });
});

/*
**  Append data, recursive
*/

function appendData(list, container, index) {
  let item = list[index];
  let name = item.href.split('\/').slice(-2)[0].split('$')[1];

  let elem = document.createElement('div');
  let title = document.createElement('div');

  title.className = "root-file";
  title.innerHTML = name;
  title.id = name;
  title.addEventListener("click", function() {
    openFile(this.id);
  });

  elem.className = "parent-file";

  elem.appendChild(title);
  container.appendChild(elem);
  let url = "./documents/doc$" + name;
  $.ajax({
    url: url,
    type: "GET",
    success: function(data) {
      $(data).find("a:contains('.txt')").each(function() {
        let subname = this.href.split('\/').slice(-1)[0];
        let sub = document.createElement("div");
        sub.innerHTML = subname;
        sub.className = "sub-file";
        sub.id = url + "/" + subname;
        sub.addEventListener("click", function() {
          addText(this.id);
        });
        elem.appendChild(sub);
      });
      if (index + 1 < list.length) {
        appendData(list, container, index + 1);
      }
    }
  });
}

/*
**  Download file
*/

function downloadFile(url) {
  $.ajax({
    url: url,
    type: "GET",
    success: function(data) {
      let elem = document.createElement('a');
      let name = url.split('\/').slice(-1)[0];
      elem.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data));
      elem.setAttribute("download", name);
      elem.style.display = "none";

      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  });
}

/*
**  Open file
*/

function openFile(ref) {
  let item = document.getElementById(ref);
  if (current_file || current_file === ref) {
    let old = document.getElementById(current_file);
    old.parentNode.className = "parent-file";
  }
  if (current_file !== ref) {
    current_file = ref;
    item.parentNode.className = "parent-file active";
  } else {
    current_file = null;
  }
}

/*
**  Add text window
*/

function addText(link) {
  let win = document.getElementById('content');
  $.ajax({
    url: link,
    type: "GET",
    success: function(data) {
      if (current_view || current_view === link) {
        document.getElementById(current_view).className = "sub-file";
      }
      if (current_view !== link) {
        current_view = link;
        document.getElementById(link).className = "sub-file active";
        win.innerHTML = "";
        win.innerHTML = formatText(data);

        let download_btn = document.createElement('div');
        download_btn.className = "download-btn";

        let final_btn = document.createElement("p");
        final_btn.innerHTML = "Download";
        final_btn.value = link;
        final_btn.addEventListener("click", function() {
          downloadFile(this.value);
        });
        download_btn.appendChild(final_btn);
        win.appendChild(download_btn);
      } else {
        win.innerHTML = "";
        current_view = null;
      }
    }
  });
}

/*
**  Format text
*/

function formatText(raw) {
  let text = raw
    .replace(/\n(.?[0-9])\//g, "\n<span class='list-puce'>$1/</span>")
    .replace(/\n\*\* (.*?)\n/g, "\n<h2>$1</h2>")
    .replace(/^## (.*?)\n/g, "<h1>$1</h1>");
  return text;
}
