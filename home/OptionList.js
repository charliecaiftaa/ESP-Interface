//
// var cityselect = [];
// cityselect['SAC'] = ['-Select a City-'];
// cityselect['AL'] = ['All Layer'];
// cityselect['USA'] = [
//     '-Select a City-',
//     'Kodiak,AK',
//     'Middletown,NY'
// ];

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

function ChangeSelectList(countrylevel) {
    var cityList = document.getElementById("myListCity");
    while (cityList.options.length) {
        cityList.remove(0);
    }
    var option;
    for (var i = 0; i < selectoption.length; i++) {
        if (countrylevel === selectoption[i].countrylevel) {
            if (selectoption[i].citylevel.length > 1) {
                for (var j = 0; j < selectoption[i].citylevel.length; j++) {
                    option = new Option(selectoption[i].citylevel[j].option,selectoption[i].citylevel[j].option);
                    cityList.options.add(option);
                    $('.panel').hide();
                }
            } else {
                option = new Option(selectoption[i].citylevel[i].option, i);
                cityList.options.add(option);
                $('.panel').show();
            }
        }
    }
}

function ChangeLayerList(citylevel) {
    var returnCityObj = getObjects(js,'option',citylevel);
    var cityMenu = [];
    cityMenu = cityMenu.concat(returnCityObj[0].level1).concat(returnCityObj[0].level2).concat(returnCityObj[0].level3);
    $('.panel').hide();
    cityMenu.forEach(function (value) {
        var className = '.' + value;
        $(className).show();
    })
}


