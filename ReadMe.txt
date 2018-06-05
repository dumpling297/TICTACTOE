console.log("tdis:",td.id);
if(td.classList.contains("unmarked")){
    td.classList.add("cross")
    td.classList.remove("unmarked");
    td.innerHTML = "X";
  }


  console.log("inside ticcMarker");
  //var td = document.getElementById(tableid);
  td.classList.add("cross")
  td.classList.remove("unmarked");
  //doesnt work
  if (client%2 == 0) {
    td.innerHTML = "X";
  } else {
    td.innerHTML = "0";
  }
