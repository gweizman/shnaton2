var webService = "/ShantonGeeter.asmx";

//strip xml, replace %22 with "
function stripXML(data) {
	return data.replace(/(<([^>]+)>)/ig,"").replace(/%22/, "\\\"");
}

function populateFaculties(callback) {
	var faculties = [];
	var xhr = $.getJSON(webService + "/GetAllFaculty", this.id, function(data, status) {
		if (status == "success") {
			console.log(data);
			var obj = $.parseJSON(data);
			for (var i = 0; i < obj.length; i++) {
				faculties[faculties.length] = new Faculty(obj[i].id, obj[i].name);
			}
		}
	});
	xhr.done(callback(faculties));
}

function Faculty(id, name) {
	this.id = id;
	this.name = name;
	this.chugim = []; //list of chugim object
	
	//fetch list of relavent chugim
	this.fetchChugim = function(callback) {
		var xhr = $.getJSON(webService + "/...", this.id, function(data, status) {
			if (status == "success") {
				var obj = $.parseJSON(data);
				for (var i = 0; i < obj.length; i++) {
					this.chugim[i] = new Chug(obj[i].id, obj[i].name, this.id);
					//reception and extra notes?
				}
			}
		});
		xhr.done(callback);
	}
	
	this.getId = function() { return this.id; }
	this.getName = function() { return this.name; }
	this.getChugim = function() { return this.chugim; }
}

function Chug(id, name, faculty_id) {
	this.id = id;
	this.name = name;
	this.facultyId = faculty_id;
	this.maslulim = []; //list of maslul object
	
	//fetch list of relavent maslulim
	this.fetchMaslulim = function(callback) {
		var xhr = $.getJSON(webService + "/ ...", this.id, function(data, status) {
			if (status == "success") {
				var obj = $.parseJSON(data);
				for (var i = 0; i < obj.length; i++)
					this.maslulim[i] = new Maslul(
						obj[i].id,
						obj[i].name,
						obj[i].degreeType, //parse the type to text on client?
						obj[i].type,
						obj[i].rating,
						obj[i].years //years is taken from Agadim from year_toar per maslul_id
					);
			}
		});
		xhr.done(callback);
	}
	
	this.getId = function() { return this.id; }
	this.getName = function() { return this.name; }
	this.getMaslulim = function() { return this.maslulim; }
}

function Maslul(id, name, degreeType, type, rating, years) {
	this.id = id;
	this.name = name;
	this.degreeType = degreeType;
	this.type = type;
	this.rating = rating;
	this.years = years;
	this.agadim = []; //list of agadim object
	this.courses = []; //list of course object
	
	//fetch entire list of agadim relavent to this maslul
	this.fetchAgadim = function(callback) {
		var xhr = $.getJSON(webService + "/ ...", this.id, function(data, status) {
			if (status == "success") {
				var obj = $.parseJSON(stripXML(data));
				for (var i = 0; i < obj.length; i++)
					this.agadim[i] = new Eged(
						obj[i].id,
						obj[i].year_toar,
						obj[i].type,
						obj[i].note
					);
			}
		});
		xhr.done(callback);
	}
	
	this.getId = function() { return this.id; }
	this.getName = function() { return this.name; }
	this.getMaslulType = function() { return this.type; }
	this.getMaslulTypeName = function() {
		switch (this.type) {
			case 1:
				return 'חד-חוגי';
			case 2:
				return 'חד-חוגי מורחב';
			case 3:
				return 'רב-חוגי - דו-חוגי ויותר';
			case 4:
				return 'חטיבה';
			case 5:
				return 'לימודים משלימים';
			case 6:
				return 'אבני פינה - ניסוי';
			case 7:
				return 'חד-חוגי במסלול דו-חוגי';
			case 8:
				return 'התמחות';
			case 9:
				return 'דו-חוגי - חוג ראשי';
			case 10:
				return 'דו-חוגי  - חוג משני';
			case 11:
				return 'משלים למחקר';
			case 12:
				return 'מדור';
			case 13:
				return 'אבני פינה - רוח';
			case 14:
				return 'אבני פינה - חברה';
			case 15:
				return 'חטיבה משולבת';
			default:
				return "";
		}
	}
	this.getDegreeType = function() { return this.degreeType; }
	this.getDegreeTypeName = function() {
		switch (this.degreeType) {
			case 1:
				return 'תואר בוגר';
			case 2:
				return 'לימודי תעודה';
			case 3:
				return 'שנת השלמה';
			case 4:
				return 'תואר מוסמך';
			case 5:
				return 'דוקטור לפילוסופיה';
			case 6:
				return 'דוקטור לוטרינריה';
			case 7:
				return 'דוקטור לרפואת שיניים';
			case 9:
				return 'תוכניות מיוחדות';
			case 10:
				return 'דוקטור לרפואה';
			case 11:
				return 'דוקטור לרוקחות קלינית';
			case 12:
				return 'משלים למחקר';
			case 18:
				return 'מכינה';
			default:
				return "";
		}
	}
	this.getYears = function() { return this.years; }
	this.getRating = function() { return this.rating; }
	this.getCourses = function() { return this.courses; }
	this.getAgadim = function() { return this.agadim; }
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
	this.fetchCourses = function() {
		var xhr = $.getJSON(webService + "/ ...", this.id, function(data, status) {
			if (status == "success") {
				var obj = $.parseJSON(data);
				for (var i = 0; i < obj.length; i++)
					this.agadim[i] = new Course(
						obj[i].id,
						obj[i].name,
						obj[i].naz,
						obj[i].semester,
						obj[i].rating,
						obj[i].requirements,
						obj[i].mandatory
					);
			}
		});
		xhr.done(callback);
	}
	
	//fetch list of maslulim based on eged id
	this.fetchCourses = function() {
		var xhr = $.getJSON(webService + "/ ...", this.id, function(data, status) {
			if (status == "success") {
				var obj = $.parseJSON(data);
				for (var i = 0; i < obj.length; i++)
					this.agadim[i] = new Maslul(
						
					);
			}
		});
		xhr.done(callback);
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

function Course(id, name, naz, semester, rating, requirements, mandatory) {
	this.id = id;
	this.name = name;
	this.naz = naz;
	this.semester = semester;
	this.rating = rating; //might need to change into a Rating object (and hold more data?)
	this.requirements = requirements;
	this.mandatory = mandatory;
	this.teachers = []; //list of teachers
	
	this.getId = function() { return this.id; }
	this.getName = function() { return this.name; }
	this.getNaz = function() { return this.naz; }
	this.getSemester = function() { return this.semester; }
	this.getRating = function() { return this.rating; }
	this.getRequirements = function() { return this.requirements; }
	this.isMandatory = function() { return this.mandatory; }
}
