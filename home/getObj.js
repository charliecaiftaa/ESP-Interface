//return an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

//return an array of values that match on a certain key
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}


var json = '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","ID":"44","str":"SGML","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}';

var selectoption = [
    {
        countrylevel : 'All layer',
        citylevel : [{option: 'All layer'}]
    },
    {
        countrylevel : 'United States of America',
        citylevel : [
            {
                option: '-Select a City-'
            },
            {
                option: 'Kodiak,AK',
                level1: ['Energy','Water','Agriculture','Transportation','Economics','Health_Services','Risk_Management','Education'],
                level2: ['Wind_Energy','Energy_Distribution','Energy_Budgets','Energy_Offices','Hydroelectric_Energy','Canneries','Drainage_Systems','Soil_Testing','Airports','Rental_Cars','Harbors','Piers','Roads','Property','Banks','Postal_Services','Hospital_and_Clinics','Health_Centers','Veterinary_Services','Eye_Care','Fire_Stations','Police_Stations','ESP_System','Higher_Education','Museums','Libraries','Elementary_School','Middle_School','High_School'],
                level3: 'AK'
            },
            {
                option: 'Middletown,NY',
                level1:['Energy','Water','Education'],
                level2:['Energy_Distribution','Water_Quality_Tests','Water_Grids','A_World_Bridge_Sites','UNESCO_WHS','Academies','Higher_Education'],
                level3: 'NY'
            }
        ]

    }
];

var jsStr = JSON.stringify(selectoption);
var js = JSON.parse(jsStr);

var res = getObjects(js,'option','Kodiak,AK');
//example of grabbing objects that match some key and value in JSON
console.log(res);
console.log(res[0].level1);
//returns 1 object where a key names ID has the value SGML
//
// //example of grabbing objects that match some key in JSON
// console.log(getObjects(js,'ID',''));
// //returns 2 objects since keys with name ID are found in 2 objects
//
// //example of grabbing obejcts that match some value in JSON
// console.log(getObjects(js,'','SGML'));
// //returns 2 object since 2 obects have keys with the value SGML
//
// //example of grabbing objects that match some key in JSON
// console.log(getObjects(js,'ID',''));
// //returns 2 objects since keys with name ID are found in 2 objects
//
// //example of grabbing values from any key passed in JSON
// console.log(getValues(js,'Abbrev'));
// //returns array ["SGML", "44"]
//
// //example of grabbing keys by searching via values in JSON
// console.log(getKeys(js,'SGML'));
//returns array ["ID", "SortAs", "Acronym", "str"]