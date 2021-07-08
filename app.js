const fs = require("fs");
const ejs = require("ejs");
const bodyParser = require("body-parser")
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');




const getDate = inv =>{
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	
	if (!inv){
		today = dd + '/' + mm + '/' + yyyy;
	}else{
		today = yyyy + '-' + mm + '-' + dd;
	};
	return today;
};

app.get("/", (req, res)=>{
	console.log("an incoming request...");
	data = fs.readFileSync("./todolist.json");
	data = JSON.parse(data);
	
	res.render("index", {data : data, currentDate: getDate(true)});
	
});

app.post("/add", (req, res)=>{
	data = fs.readFileSync("./todolist.json");
	data = JSON.parse(data);

	if(req.body != {}){
		let taskDate = req.body.date;
		let tasks = Object.values(req.body);
		tasks.shift();
		tasks = tasks.map(elem=>{
			return (
				{
					task: elem,
					done: false
				}
			);
		});
		
		if(data[taskDate]){
			a = [... data[taskDate], ...tasks];
			uniqueArray = a.filter(function(item, pos) {
				return a.indexOf(item) == pos;
			});
			data[taskDate] = uniqueArray;
		}else{
			data[taskDate] = tasks;
		};
	};	
	
	let newData = JSON.stringify(data);
	
	fs.writeFile("./todolist.json", newData, function(err) {
		if(err) {
			throw err;
		};
		res.redirect("/");
	}); 
	
});



app.get("/delete", (req, res)=>{
	data = fs.readFileSync("./todolist.json", 'utf8');
	data = JSON.parse(data);
	
	let reference = [];
	
	Object.values(data[req.query.date]).forEach(elem=>{
		reference.push(elem[0]);
	});	
		
	let index = reference.indexOf(req.query.target);
	
	data[req.query.date].splice(index, 1);
	
	if (data[req.query.date].length <=0){
		delete data[req.query.date];
	};
	
	let newData = JSON.stringify(data);
	
	fs.writeFile("./todolist.json", newData, function(err) {
		if(err) {
			throw err;
		};
		
		res.redirect("/");
	}); 
});

app.get("/check", (req, res)=>{
	data = fs.readFileSync("./todolist.json");
	data = JSON.parse(data);
	
	let task  = req.query.target;
	let taskDate = req.query.date;

	data[taskDate] = data[taskDate].map(elem=>{
		if(elem.task ==  task){
			if(elem.done == false){
				elem.done = true;
			}else{
				elem.done = false;
			};
		};
		return elem;
	});
	
	let newData = JSON.stringify(data);
	
	fs.writeFile("./todolist.json", newData, function(err) {
		if(err) {
			throw err;
		};
		
		res.redirect("/");
	}); 
	
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
	console.log("Listening...");
});	