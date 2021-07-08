$(document).ready(function() {
    var max_fields = 10;
    var wrapper = $(".container1");
    var add_button = $(".add_form_field");

    var x = 0;
	var y =0;
    $(add_button).click(function(e) {
        e.preventDefault();
		y = $(".container1 > div").length;
        if (x < max_fields) {
            $(wrapper).append(`<div><input type="text" name="task${y+1}" required/><button class="delete">&times</button></div>`); //add input box
			x++;
        };
    });

    $(wrapper).on("click", ".delete", function(e) {
        e.preventDefault();
        $(this).parent("div").remove();
        x--;
    });
	
	$('.items .collapse').collapse();
	
	
		
	$(".list-group").on("click", "li.list-group-item", function(e){
		let task = $(this).attr("name");
		let taskDate = $(this).parents(".collapse").attr("id").replace("taskslist_", "");
		
		window.location.href = `/check?target=${task}&date=${taskDate}`;
	});
	
});