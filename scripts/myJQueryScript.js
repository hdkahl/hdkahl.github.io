
// START UP CODE
let box = "document.querySelector('.square')";
let width1 = 0;
let height = 0;

let months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec"
};
let month_to_solve_for = "None";
let day_to_solve_for = "None";

function startup() {
$(".shape").each(function () {
    $(this).data("originalOffset", $(this).position());
    console.log($(this).position());
    console.log($(this).css("top"));
  });

  let today = new Date(Date.now());
  console.log(today);
  console.log(today.getDate());
  month_to_solve_for = months[today.getMonth()];
  day_to_solve_for = today.getDate();
  
  $("#" + month_to_solve_for).addClass("today");
  $("#" + day_to_solve_for).addClass("today");
  $(".today").droppable({
    classes: {
        "ui-droppable-active": "ui-state-active",
        "ui-droppable-hover": "ui-state-hover"
      }
    }); 
 

box = document.querySelector('.square');
width1 = box.offsetWidth;
let height = box.clientHeight;
console.log({width1});
let r = document.querySelector(':root');
r.style.setProperty('--cell-width', width1 + "px");
}
onresize = (event) => {
    let box = document.querySelector('.square');
    width1 = box.offsetWidth;
    let height = box.clientHeight;
    console.log({width1});
    let r = document.querySelector(':root');
    r.style.setProperty('--cell-width', width1 + "px");
};


function log_element_position(shape_name, el){
    let rect = el.getBoundingClientRect();
    console.log(shape_name, "N=",Math.floor(rect.top),"E=", Math.floor(rect.right),"S=", Math.floor(rect.bottom),"W=", Math.floor(rect.left));
    console.log(shape_name,"offset_left=", el.offsetLeft, "offset_top=",el.offsetTop);

}

function check_if_solved_by_shape_cells(){
    let shape_overCalendar = true;
    $(".cell").each( function() {
        console.log($(this).offset());
        let cell_result = isCellOverCalendar($(this), $(this).offset().left, $(this).offset().top);
        console.log($(this).attr("id") + " " + cell_result);
        shape_overCalendar = cell_result && shape_overCalendar;

    });
    if (shape_overCalendar){
        alert("YOU SOLVED THE PUZZLE");
    }
}

function validate_shape_position(ui){
    // Check if shape is on the calendar,
    // If shape is on calendar, make sure there is no overlap
    
    if (isShapeOverCalendar(ui)){

    }
    else {
        let shape = ui.helper;
        console.log(shape)
        console.log(shape.data("originalOffset"));
        // shape.offset(shape.data("originalOffset"));
        // shape.animate(shape.data("originalOffset"), 1000);
        shape.animate({
            top: "0px",
            left: "0px"
        }, 1000)
    }

}

function isShapeOverCalendar(ui){
    console.log(ui.helper);
    console.log("#" + ui.helper.attr("id") + " .cell");
    let shape_cells = $("#" + ui.helper.attr("id") + " .cell" );
    console.log(shape_cells);
    let shape_overCalendar = shape_cells.length > 0;
    shape_cells.each( function(index){
            let cell_result = isCellOverCalendar($(this), ui.offset.left, ui.offset.top);
            shape_overCalendar = cell_result && shape_overCalendar;
     })
     console.log("SHAPE OVER CALENDAR = " + shape_overCalendar);
     return shape_overCalendar;
}

function isCellOverCalendar(cell, left_initial, top_initial){
    // console.log( ui.position);
    pad_to_middle = 1;
    console.log(cell.offset());
    // console.log(cell[0] + " is at " + cell[0].offsetLeft + " " + cell[0].offsetTop);
    // console.log(cell);
    let left_position = cell.offset().left;
    let top_position = cell.offset().top;
    console.log(cell.attr("id") + " is at " + left_position + " " + top_position);
    return (is_corner_over_calendar(left_position, top_position) && is_corner_over_calendar(left_position + width1, top_position + width1));
   
}

// function mm(x,y){
//     cursor.style.left = x + "px";
//     cursor.style.top = y + "px"
// }

function is_corner_over_calendar(left, top){
    // setTimeout(mm(top,left),500);
    let elements = document.elementsFromPoint(left, top);
    let overCalendar = false;
    // console.log("starting loop");
    elements.forEach((elt, i) => {
        // console.log(elt);
        if (elt.className.includes("calSquare") && !elt.className.includes("today")){
            overCalendar = true;
            // log_element_position("CAl_SQUARE",elt);
            return overCalendar;
        }
        // console.log(overCalendar);
    });
    // console.log(left + " " + top + " " + overCalendar);
    return overCalendar;
}

function isOverCalendar(ui){
    console.log( ui.position);
    console.log(ui.helper.attr("id") + " is at " + ui.offset.left + " " + ui.offset.top);
    let elements = document.elementsFromPoint(ui.offset.left, ui.offset.top);
    let overCalendar = false;
    console.log("starting loop");
    elements.forEach((elt, i) => {
        // console.log(elt);
        if (elt.className.includes("calSquare")){
            overCalendar = true;
            log_element_position("CAl_SQUARE",elt);
            return overCalendar;
        }
        console.log(overCalendar);
    });
    return overCalendar;
}















// Animation Code


function get_rotation(obj) {
    // let elmnt2 = document.getElementById(elmnt.id.replace("-header", ""));
    let rot = obj.css("--rotation");
    rot = parseInt(rot.replace("deg", ""));
    if (isNaN(rot)) {
        rot = 0;
    }
    obj.css({"--rotation":rot + "deg"});
    return rot
}
jQuery.fn.rotate_90 = function() {
    let degrees = (get_rotation($(this)) + 90) % 360;
    $(this).css({
        "--rotation":degrees + "deg",
        'transform' : 'rotate('+ degrees +'deg)'});
    console.log($(this).attr("id") + " rotated to " + degrees);
    return $(this);
};

jQuery.fn.rotate = function(degrees) {
    $(this).css({'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};
$( function() {
    dragged=false;
    $( ".shape" ).draggable({ snap: ".calSquare", handle: ".cell", cursor: "move", opacity: 0.7, helper: "original",
                                stack: ".shape",   snapTolerance: width1/2, revert: "valid", refreshPositions: false,
                                drag: function() {
                                        dragged=true;
                                },
                                stop: function(event, ui) {
                                        console.log("drag stopped");
                                        validate_shape_position(ui);
                                        dragged=false;
                                        check_if_solved_by_shape_cells();
                                    }
                            });
    $(".cell").droppable({
        classes: {
            "ui-droppable-active": "ui-state-active",
            "ui-droppable-hover": "ui-state-hover"
          }
        });   
    $( ".shape" ).mouseup(function() {
        // console.log($(this).prop("rotation"));
        // console.log($(this).attr("class"));
        // console.log(get_rotation($(this)));
        console.log($(this).data("originalOffset"));
        console.log($(this).attr("id") + " clicked and drag=" +dragged);
        if (dragged) {
            dragged=false;
        }
        else {
            $(this).rotate_90();
        }

    });
    // dragged=false;
});
