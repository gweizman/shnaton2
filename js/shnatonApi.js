var webService = "/ShantonGeeter.asmx";

//strip xml, replace %22 with "
function stripXML(data) {
	return data.toString().replace(/(<([^>]+)>)/ig,"").replace(/%22/ig, "\\\"");
}
function getJSON(url, dataToSend, callback) {
		$.ajax({
		dataType: 'text',
		data: dataToSend,
		url: webService + "/" + url,
		success: function(data, status) {
			if (status == "success") {
				callback($.parseJSON(stripXML(data)));
			}
		}
	});
}

function populateFaculties(callback) {
	getJSON("GetAllFaculty", "", function(obj) {
		var faculties = [];
		for (var i = 0; i < obj.length; i++) {
			faculties[faculties.length] = new Faculty(obj[i].id, obj[i].name);
		}
		callback(faculties);
	});
}

function Faculty(id, name) {
	this.id = id;
	this.name = name;
	this.chugim = []; //list of chugim object
	
	//fetch list of relavent chugim
	this.fetchChugim = function(callback) {
		var _this = this;
		getJSON("GetChugimByFaculty", { "facultyId": this.id }, function(obj) {
			for (var i = 0; i < obj.length; i++) {
				_this.chugim[i] = new Chug(obj[i].id, obj[i].name, new Faculty(obj[i].hogFaculty.id, obj[i].hogFaculty.name));
			}
			callback();
		});
	}
	
	this.getId = function() { return this.id; }
	this.getName = function() { return this.name; }
	this.getChugim = function() { return this.chugim; }
}

function Chug(id, name, faculty) {
	this.id = id;
	this.name = name;
	this.faculty = faculty;
	this.maslulim = []; //list of maslul object
	
	//fetch list of relavent maslulim
	this.fetchMaslulim = function(callback) {
		var _this = this;
		getJSON("GetMaslulimByChug", { "chugId": this.id }, function(obj) {
			for (var i = 0; i < obj.length; i++) {
				_this.maslulim[i] = new Maslul(obj[i].id, obj[i].name, obj[i].degreeType, obj[i].type);
			}
			callback();
		});
	}
	
	this.getId = function() { return this.id; }
	this.getName = function() { return this.name; }
	this.getMaslulim = function() { return this.maslulim; }
}

function Maslul(id, name, degreeType, type) {
	this.id = id;
	this.name = name;
	this.degreeType = degreeType;
	this.type = type;
	this.agadim = []; //list of agadim object
	this.courses = []; //list of course object
	
	//fetch entire list of agadim relavent to this maslul
	this.fetchAgadim = function(callback) {
		var _this = this;
		getJSON("GetAggadimByMaslul", { "maslulId": this.id }, function(obj) {
			for (var i = 0; i < obj.length; i++) {
				 //also recieving max/min/exact courses/naz
				_this.agadim[i] = new Eged(obj[i].id, obj[i].yearToar, obj[i].type, obj[i].note);
			}
			callback();
		});
	}
	this.fetchCourses = function(callback) {
		var _this = this;
		getJSON("GetCourseByMaslul", { "maslulId": this.id }, function(obj) {
			for (var i = 0; i < obj.length; i++) {
				var divisor, semester = courseSemester.replace("\u0027", "'");
				if (semester == "קורס שנתי") divisor = 28;
				else if (semester == "א'" || semester == "ב'") divisor = 14;
				else divisor = 1; // summer semester
				_this.courses[i] = new Course(obj[i].id, obj[i].name, obj[i].nz, semester, obj[i].totalHours / divisor,
					obj[i].type, obj[i].exam, obj[i].aggadim); //no reparse for agadim
			}
			callback();
		});
	}
	this.getId = function() { return this.id; }
	this.getName = function() { return this.name; }
	this.getMaslulType = function() { return this.type; }
	this.getDegreeType = function() { return this.degreeType; }
	this.getCourses = function() { return this.courses; }
	this.getAgadim = function() { return this.agadim; }
	this.getSecondPossibleMaslulim = function(chug_id) {
		getJSON("GetSecondMaslul", { "firstMaslulId": this.id, "chugId": chug_id }, function(obj) {
			var arr = [];
			for (var i = 0; i < obj.length; i++) {
				arr[i] = new Maslul(obj[i].id, obj[i].name, obj[i].degreeType, obj[i].type);
			}
		});
	}
}

//might need to add naz, courses, etc.
function Eged(id, year, type, notes) {
	this.id = id;
	this.year = year;
	this.type = type;
	this.notes = notes;
	this.courses = []; //list of course object
	this.maslulim = []; //list of maslul object
	
	//fetch list of courses based on eged id
	this.fetchCourses = function(callback) {
		var _this = this;
		getJSON("GetCoursesByAgged", { "aggedId": this.id }, function(obj) {
			for (var i = 0; i < obj.length; i++) {
				var divisor, semester = obj[i].courseSemester.replace("\u0027", "'");
				if (semester == "קורס שנתי") divisor = 28;
				else if (semester == "א'" || semester == "ב'") divisor = 14;
				else divisor = 1; // summer semester
				/*var eged = [];
				for (var j = 0; j < obj[i].aggadim.length; j++) {
					getJSON("GetAggadByAggadId", { "aggadId": obj[i].aggadim[j] }, function(obj) {
						eged[j] = new Eged(obj.id, obj.yearToar, obj.type, obj.note);
					});
				}*/
				_this.courses[i] = new Course(obj[i].id, obj[i].name, obj[i].nz, semester, obj[i].totalHours / divisor,
					obj[i].type, obj[i].exam, obj[i].aggadim); //no reparsing for aggadim
			}
			callback();
		});
	}
	
	this.getId = function() { return this.id; }
	this.getYear = function() { return this.year; }
	this.getTypeID = function() { return this.type; }
	this.getTypeName = function() {
		switch (this.type) {
			case 1:
				return 'לימודי חובה';
			case 2:
				return 'לימודי חובת בחירה'; //And
			case 3:
				return 'לימודי חובת בחירה'; //Or
			case 4:
				return 'קורסי בחירה';
			default:
				return "";
		}
	}
	this.getNotes = function() { return this.notes; }
	this.getCourses = function() { return this.courses; }
}

function Course(id, name, naz, semester, weeklyHours, type, exam, agadim) {
	this.id = id;
	this.name = name;
	this.naz = naz;
	this.semester = semester;
	this.teachers = []; //list of teachers
	this.weeklyHours = weeklyHours;
	this.type = type;
	this.exam = exam;
	this.agadim = agadim;
	
	this.getId = function() { return this.id; }
	this.getName = function() { return this.name; }
	this.getNaz = function() { return this.naz; }
	this.getSemester = function() { return this.semester; }
	this.getWeeklyHours = function() { return this.weeklyHours; } //might return semesterial hours
	this.getCourseLessonType = function() { return this.type; }
	this.getExamType = function() { return this.type; }
	this.getAgadim = function() { return this.agadim; }
}

function getChugByID(id, callback) {
	getJSON("GetChugByChugId", { "chugId": id }, function(obj) {
		if (obj.length > 15) callback(new Chug(obj.id, obj.name, new Faculty(obj.hogFaculty.id, obj.hogFaculty.name)));
	});
}
