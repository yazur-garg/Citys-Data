/******************************************************************************
***
* BTI425 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Yazur Garg Student ID: 133395202 Date: 30-01-2022
*
*
******************************************************************************
**/ 

var countries = [];
var cities = [];
var weatherdata= [];
var cityid = [];
var page = 0;
$(document).ready(function() {
    $.ajax({                //load All the countries data into countries array
    url:"https://restcountries.com/v3.1/all",
    success: function(data){    
        countries = data;              
        console.log(countries);
        },
    error: function(){ console.log('Country data Error!')}
    });
    $.ajax({                
    url:"city_list.json",
    success: function(data){    
        cities = data;              
        console.log(cities);
        },
    error: function(){ console.log('city data Error!')}
    });
    $("#output").hide();
});		

function loadData() {               
    let city = $("#city").val();
    page = 0;
    weatherdata = [];
    cityid = [];
    if (validate(city)) {
        let temp = loadWeatherDatacountry(city);
    }
    else {
        for(let i = 0; i < cities.length; ++i) {
            if (cities[i].name.toUpperCase() == city.toUpperCase())
                cityid.push(cities[i].id);
        }
        loadWeatherData(cityid);
    }
}

function validate(city){                
    let ret = false;
    if(city.includes(","))
    {
        if(city.indexOf(",") != city.length - 1)
            ret = true;
    }
    return ret;
}

function loadWeatherData(arr) 
{   
    let temp = "";
    if (arr.length > 0)
    {
        for(let i = 0;i < arr.length - 1; ++i)
        temp += arr[i].toString() + ",";
        temp += arr[arr.length-1].toString();
    }
    $.ajax({                
        url:"http://api.openweathermap.org/data/2.5/group?id=" + temp + "&units=metric&appid=c528f5397888b4f37fef45098aebf883",
        success: function(data){    
            weatherdata = data.list;  
            console.log("watherdata")            
            console.log(weatherdata);
            display();
        },
        error: function(){
            display();
        }
    });
}

function loadWeatherDatacountry(city) 
{       
    $.ajax({                
        url:"http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=c528f5397888b4f37fef45098aebf883",
        success: function(data){    
            weatherdata.push(data);              
            console.log(weatherdata);
            display();
        },
        error: function(){
            display();
        }
    });
}

function display() 
{
    $("#output").show();
    $("#pageno").html(page+1);
    document.getElementById("table-rows").innerHTML = "";
    var dom_rows = document.querySelector("#table-rows");
    if (weatherdata.length == 0)
    {
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var txt = document.createTextNode("No data found the City name is not correct!!!");
        th.colSpan = 12;
        th.appendChild(txt);
        tr.appendChild(th);
        dom_rows.appendChild(tr);
    }
    else
    {
        for(let i = page*5; i < (page*5)+5 && i < weatherdata.length; ++i)
        {
            for(let j = 0; j < countries.length; ++j)
            {
                if (weatherdata[i].sys.country == countries[j].cca2)
                    country = countries[j];
            }
            var r = row(country,weatherdata[i], i);
            dom_rows.appendChild(r);
        }
    }
}
function row(cd, wd, n)
{
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    var txt = document.createTextNode(n+1);
    th.appendChild(txt);
    tr.appendChild(th);
    var td = document.createElement("td");
    txt = document.createTextNode(wd.name);
    td.appendChild(txt);
    tr.appendChild(td);
    td = document.createElement("td");
    txt = document.createTextNode(cd.name.common);
    td.appendChild(txt);
    tr.appendChild(td);
    td = document.createElement("td");
    var img = document.createElement("img");
    img.src = cd.flags.png;
    img.height = "12";
    img.width = "20";
    td.appendChild(img);
    tr.appendChild(td);
    td = document.createElement("td");
    txt = document.createTextNode(wd.main.temp);
    td.appendChild(txt);
    tr.appendChild(td);
    td = document.createElement("td");
    txt = document.createTextNode(wd.weather[0].description);
    td.appendChild(txt);
    tr.appendChild(td);
    td = document.createElement("td");
    txt = document.createTextNode(wd.wind.speed);
    td.appendChild(txt);
    tr.appendChild(td);
    td = document.createElement("td");
    txt = document.createTextNode(wd.main.feels_like);
    td.appendChild(txt);
    tr.appendChild(td);
    td = document.createElement("td");
    txt = document.createTextNode(wd.main.temp_min + " to " + wd.main.temp_max);
    td.appendChild(txt);
    tr.appendChild(td);
    td = document.createElement("td");
    txt = document.createTextNode(wd.main.humidity);
    td.appendChild(txt);
    tr.appendChild(td);
    td = document.createElement("td");
    txt = document.createTextNode(wd.main.pressure);
    td.appendChild(txt);
    tr.appendChild(td);
    td = document.createElement("td");
    txt = document.createTextNode(new Date(wd.sys.sunrise * 1000).toLocaleTimeString());
    td.appendChild(txt);
    tr.appendChild(td);
    td = document.createElement("td");
    txt = document.createTextNode(new Date(wd.sys.sunset * 1000).toLocaleTimeString());
    td.appendChild(txt);
    tr.appendChild(td);
    return tr;
}
function nextpage()
{
    if(Math.ceil(weatherdata.length/5) - 1 > page)
    {
        ++page;
        display();
    }
}
function pevpage()
{
    if(page > 0)
    {
        --page;
        display();
    }
}