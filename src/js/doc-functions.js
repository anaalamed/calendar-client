import $ from "jquery";
import { addUpdate, deleteUpdate } from "./sockets";

$(() => {
  var input = $("#main-doc");

  input.on("keydown", (event) => {
    var key = event.keyCode || event.charCode;
    if (key == 8 || key == 46) {
      console.log(
        "deleting: " +
          input
            .val()
            .substring(input.prop("selectionStart"), input.prop("selectionEnd"))
      );
      deleteUpdate($("#userInput").val(), start, end - 1);
    }
  });

  input.on("input", (event) => {
    let start = input.prop("selectionStart");
    let end = input.prop("selectionEnd");

    addUpdate($("#userInput").val(), event.originalEvent.data, start, end - 1);
  });
});

const update = (updateData) => {
  let textArea = $("#main-doc");
  let user = $("#userInput").val();
  let start = textArea.prop("selectionStart");
  if (user != updateData.user) {
    let text = textArea.val();
    text =
      text.substring(0, updateData.position) +
      updateData.content +
      text.substring(updateData.position, text.length);
    textArea.val(text);
    if (updateData.position < start) {
      start++;
      textArea[0].setSelectionRange(start, start);
    }
  }
};

//start = input.prop("selectionStart");
//end = input.prop("selectionEnd");
//let input = $("#main-doc-content");

var $temp = $("<input>");
var $url = $(location).attr("href");

const copyLink = () => {
  $(".clipboard").on("click", function () {
    console.log("on copyLink");

    $("body").append($temp);
    $temp.val($url).select();
    document.execCommand("copy");
    $temp.remove();
    $("p").text("URL copied!");
  });
};

const importFile = () => {
  $(".import").on("click", function () {
    console.log("on import");
    //TODO
  });
};

const exportFile = () => {
  $(".export").on("click", function () {
    console.log("on export");
    //TODO
  });
};

export { update, copyLink, importFile, exportFile };
